'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Trash2, Calendar } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import Link from 'next/link'

type Conversation = {
  id: string
  title: string
  mode: string
  created_at: string
  updated_at: string
}

export default function HistoricoPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteConversation = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conversa?')) return

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      formal: 'Formal',
      casual: 'Casual',
      jovem: 'Jovem',
    }
    return labels[mode] || mode
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20 lg:pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Histórico de Conversas</h1>
          <p className="text-muted-foreground">
            Acesse suas conversas anteriores e continue de onde parou
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nenhuma conversa ainda</p>
              <p className="text-muted-foreground mb-4">
                Comece uma nova conversa para ver seu histórico aqui
              </p>
              <Link href="/chat">
                <Button>Iniciar Conversa</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{conversation.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(conversation.created_at)}
                        </span>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {getModeLabel(conversation.mode)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/chat?conversationId=${conversation.id}`}>
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Continuar
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteConversation(conversation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
