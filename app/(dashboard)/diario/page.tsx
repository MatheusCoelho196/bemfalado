'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Calendar, Smile, Meh, Frown, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type MoodEntry = {
  id: string
  mood: number
  emotions: string[]
  notes: string | null
  created_at: string
}

const EMOTION_OPTIONS = [
  'Feliz', 'Triste', 'Ansioso', 'Calmo', 'Irritado',
  'Motivado', 'Cansado', 'Esperançoso', 'Frustrado', 'Grato',
]

const MOOD_ICONS = [
  { value: 1, icon: Frown, color: 'text-red-500', label: 'Muito mal' },
  { value: 3, icon: Frown, color: 'text-orange-500', label: 'Mal' },
  { value: 5, icon: Meh, color: 'text-yellow-500', label: 'Neutro' },
  { value: 7, icon: Smile, color: 'text-lime-500', label: 'Bem' },
  { value: 10, icon: Smile, color: 'text-green-500', label: 'Muito bem' },
]

export default function DiarioPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [mood, setMood] = useState(5)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const response = await fetch('/api/mood')
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries || [])
      }
    } catch (error) {
      console.error('Error loading entries:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          emotions: selectedEmotions,
          notes: notes.trim() || null,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Entrada salva!',
          description: 'Seu registro emocional foi salvo com sucesso.',
        })
        setMood(5)
        setSelectedEmotions([])
        setNotes('')
        loadEntries()
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a entrada.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    )
  }

  const getMoodIcon = (value: number) => {
    const closest = MOOD_ICONS.reduce((prev, curr) =>
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    )
    const Icon = closest.icon
    return <Icon className={`h-8 w-8 ${closest.color}`} />
  }

  const getAverageMood = () => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => acc + entry.mood, 0)
    return (sum / entries.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20 lg:pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Diário Emocional</h1>
          <p className="text-muted-foreground">
            Registre como você está se sentindo e acompanhe seu progresso
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Como você está se sentindo hoje?</CardTitle>
              <CardDescription>
                Escolha seu humor e as emoções que está sentindo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Humor (1-10)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={mood}
                      onChange={(e) => setMood(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="w-20 text-center font-bold text-2xl">
                      {mood}
                    </div>
                    {getMoodIcon(mood)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Emoções</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMOTION_OPTIONS.map((emotion) => (
                      <button
                        key={emotion}
                        type="button"
                        onClick={() => toggleEmotion(emotion)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedEmotions.includes(emotion)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="O que aconteceu hoje? Como você se sentiu?"
                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Entrada'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Humor Médio</p>
                  <p className="text-3xl font-bold">{getAverageMood()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Registros</p>
                  <p className="text-3xl font-bold">{entries.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* History */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Histórico</h2>
          <div className="space-y-3">
            {entries.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum registro ainda. Comece registrando como você se sente hoje!
                </CardContent>
              </Card>
            ) : (
              entries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getMoodIcon(entry.mood)}
                          <div>
                            <p className="font-medium">Humor: {entry.mood}/10</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(entry.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {entry.emotions.map((emotion) => (
                            <span
                              key={emotion}
                              className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full"
                            >
                              {emotion}
                            </span>
                          ))}
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
