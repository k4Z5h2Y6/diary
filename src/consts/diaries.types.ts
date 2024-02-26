export interface DiariesType {
  public: {
    Tables: {
      sleeps: {
        Row: {
          id: number
          user_id: string
          created_at: string | null
          update_at: string | null
          diary: string
        }
        Insert: {
          id?: number
          user_id: string
          created_at?: string | null
          update_at?: string | null
          diary: string
        }
        Update: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          update_at: string | null
          diary: string | null
        }
        Delete: {
          id: number
          user_id: string | null
          created_at?: string | null
          update_at?: string | null
          diary?: string | null
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

export interface UpdateDiaryType {
  update_at: string;
  diary: string;
}