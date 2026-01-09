import { Brain } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Brain className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold">Terapeuta IA</span>
        </Link>
        {children}
      </div>
    </div>
  )
}
