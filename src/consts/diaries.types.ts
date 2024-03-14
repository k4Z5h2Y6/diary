export interface DiariesType {
  public: {
    Tables: {
      diaries: {
        Row: {
          id: number;
          user_id: string;
          created_at: string | null;
          update_at: string | null;
          diary_text: string | null;
          diary_img_url: string | null;
          diary_category: number | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          created_at?: string | null;
          update_at?: string | null;
          diary_text?: string | null;
          diary_img_url?: string | null;
          diary_category?: number | null;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          created_at?: string | null;
          update_at: string | null;
          diary_text?: string | null;
          diary_img_url?: string | null;
          diary_category?: number | null;
        };
        Delete: {
          id: number;
          user_id: string | null;
          created_at?: string | null;
          update_at?: string | null;
          diary_text?: string | null;
          diary_img_url?: string | null;
          diary_category?: number | null;
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

export interface UpdateDiaryType {
  update_at: string;
  diary: string;
}

export interface DiaryDataType {
  id: number;
  user_id: string;
  created_at: string | null;
  update_at: string | null;
  diary_text: string | null;
  diary_img_url: string | null;
  diary_category: number | null;
}
