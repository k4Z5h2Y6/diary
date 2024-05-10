export interface ProfilesType {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_name: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          user_name?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_name: string | null;
          created_at?: string | null;
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

export interface ProfileDataType {
  id: string;
  user_name: string | null;
  created_at: string | null;
}

export interface UpdateUserNameType {
  user_name: string | null;
}
