import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const moodEntrySchema = z.object({
  mood: z.number().min(1).max(10),
  emotions: z.array(z.string()),
  notes: z.string().nullable().optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const supabase = createClient()

    const { data: entries, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      console.error('Error fetching mood entries:', error)
      return NextResponse.json({ error: 'Erro ao buscar entradas' }, { status: 500 })
    }

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = moodEntrySchema.parse(body)

    const supabase = createClient()

    const { data: entry, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: session.user.id,
        mood: validatedData.mood,
        emotions: validatedData.emotions,
        notes: validatedData.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating mood entry:', error)
      return NextResponse.json({ error: 'Erro ao criar entrada' }, { status: 500 })
    }

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
