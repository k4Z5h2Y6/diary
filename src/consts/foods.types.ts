export interface FoodsType {
  public: {
    Tables: {
      foods: {
        Row: {
          id: number;
          user_id: string;
          created_at: string | null;
          food_text: string | null;
          food_img_url: string | null;
          ingredient: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          created_at?: string | null;
          food_text?: string | null;
          food_img_url?: string | null;
          ingredient?: string | null;
        };
        Delete: {
          id: number;
          user_id: string;
          created_at?: string | null;
          food_text?: string | null;
          food_img_url?: string | null;
          ingredient?: string | null;
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

export interface FoodDataType {
  id: number;
  user_id: string;
  created_at?: string | null;
  food_text?: string | null;
  food_img_url?: string | null;
  ingredient?: string | null;
}
