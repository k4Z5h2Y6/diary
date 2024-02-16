export interface CigarettesType {
  public: {
    Tables: {
      cigarettes: {
        Row: {
          id: number;
          user_id: string;
          created_at: string;
          cigarettes_counter: number;
        };
        Insert: {
          id?: number;
          user_id: string;
          created_at?: string;
          cigarettes_counter?: number;
        };
        Update: {
          id?: number;
          user_id?: string;
          created_at?: string;
          cigarettes_counter: number;
        };
        Delete: {
          id: number;
          user_id?: string;
          created_at?: string;
          cigarettes_counter?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface UpdateCigarettesType {
  cigarettes_counter: number;
}
