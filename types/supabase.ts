export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          image: string | null
          password_hash: string | null
          provider: string
          subscription_tier: 'free' | 'premium' | 'pro'
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          image?: string | null
          password_hash?: string | null
          provider: string
          subscription_tier?: 'free' | 'premium' | 'pro'
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          image?: string | null
          password_hash?: string | null
          provider?: string
          subscription_tier?: 'free' | 'premium' | 'pro'
          subscription_expires_at?: string | null
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          mode: 'formal' | 'casual' | 'jovem'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          mode?: 'formal' | 'casual' | 'jovem'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          mode?: 'formal' | 'casual' | 'jovem'
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          encrypted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          encrypted?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          encrypted?: boolean
        }
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood: number
          emotions: string[]
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: number
          emotions: string[]
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: number
          emotions?: string[]
          notes?: string | null
        }
      }
    }
  }
}
