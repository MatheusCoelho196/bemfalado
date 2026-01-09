import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validar dados
    const validatedData = registerSchema.parse(body)

    const supabase = createClient()

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", validatedData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      )
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Criar usuário
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        password_hash: passwordHash,
        provider: "credentials",
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar usuário:", error)
      return NextResponse.json(
        { error: "Erro ao criar conta" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Conta criada com sucesso", user: newUser },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Erro no registro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
