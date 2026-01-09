import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { anthropic, CLAUDE_MODEL } from '@/lib/claude'
import { getSystemPrompt, detectCrisis, CRISIS_RESPONSE } from '@/lib/prompts'
import { checkRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encryption'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    // Autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Rate limiting
    const rateLimitResult = checkRateLimit(session.user.id)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Muitas requisições. Tente novamente em alguns instantes.',
          resetAt: rateLimitResult.resetAt,
        },
        { status: 429 }
      )
    }

    const { messages, mode = 'casual', conversationId } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Mensagens inválidas' },
        { status: 400 }
      )
    }

    // Detectar crise na última mensagem do usuário
    const lastUserMessage = messages[messages.length - 1]
    const isCrisis = lastUserMessage?.role === 'user' && detectCrisis(lastUserMessage.content)

    // Se detectar crise, adicionar resposta de emergência
    let systemPrompt = getSystemPrompt(mode)
    if (isCrisis) {
      systemPrompt += CRISIS_RESPONSE
    }

    // Criar stream do Claude
    const stream = await anthropic.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    })

    // Configurar encoder para SSE (Server-Sent Events)
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = ''

          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
              const text = chunk.delta.type === 'text_delta' ? chunk.delta.text : ''
              if (text) {
                fullResponse += text
                // Enviar chunk para o cliente
                const data = JSON.stringify({ content: text })
                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              }
            }
          }

          // Salvar mensagem no banco de dados (criptografada)
          if (conversationId && fullResponse) {
            try {
              const supabase = createClient()

              // Salvar mensagem do usuário
              await supabase.from('messages').insert({
                conversation_id: conversationId,
                role: 'user',
                content: encrypt(lastUserMessage.content),
                encrypted: true,
              })

              // Salvar resposta do assistente
              await supabase.from('messages').insert({
                conversation_id: conversationId,
                role: 'assistant',
                content: encrypt(fullResponse),
                encrypted: true,
              })
            } catch (dbError) {
              console.error('Error saving messages:', dbError)
            }
          }

          // Finalizar stream
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
