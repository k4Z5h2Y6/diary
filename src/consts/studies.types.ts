export interface StudiesType {
  public: {
    Tables: {
      studies: {
        Row: {
          id: number
          user_id: string
          created_at: string | null
          update_at: string | null
          start_studying: string | null
          finish_studying: string | null
        }
        Insert: {
          id?: number
          user_id: string
          created_at?: string | null
          update_at?: string | null
          start_studying?: string | null
          finish_studying?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          update_at: string | null
          start_studying?: string | null
          finish_studying?: string | null
        }
        Delete: {
          id: number
          user_id: string | null
          created_at?: string | null
          update_at?: string | null
          start_studying?: string | null
          finish_studying?: string | null
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

export interface UpdateFinishStudyingType {
  update_at: string;
  finish_studying: string;
}

export interface UpdateStudyType {
  update_at: string;
  start_studying?: string | null;
  finish_studying?: string | null;
}

export interface StudyDataType {
  id: number
  user_id: string
  created_at: string | null
  update_at: string | null
  start_studying: string | null
  finish_studying: string | null
}