import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  name: z.string().min(2),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = profileUpdateSchema.parse(body)

    const supabase = createClient()

    const { data: user, error } = await supabase
      .from('users')
      .update({ name: validatedData.name })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
