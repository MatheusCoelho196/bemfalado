import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const supabase = createClient()

    // Verificar se a conversa pertence ao usuário
    const { data: conversation } = await supabase
      .from('conversations')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!conversation || conversation.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting conversation:', error)
      return NextResponse.json({ error: 'Erro ao deletar conversa' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
