export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface SleepsType {
  public: {
    Tables: {
      sleeps: {
        Row: {
          id: number
          user_id: string
          created_at: string | null
          update_at: string | null
          sleep_onset_at: string | null
          wake_up_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          created_at?: string | null
          update_at?: string | null
          sleep_onset_at?: string | null
          wake_up_at?: string | null
        }
        Update: {
          id: number
          user_id: string | null
          created_at: string | null
          update_at: string | null
          sleep_onset_at: string | null
          wake_up_at: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}