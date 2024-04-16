export interface CategoriesType {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          user_id: string;
          category_name: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          category_name: string;
        };
        Update: {
          id?: number;
          user_id: string;
          category_name: string;
        };
        Delete: {
          id?: number;
          user_id: string;
          category_name: string;
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

export interface CategoryType {
  id: number;
  user_id: string;
  category_name: string;
}

export interface OptionsCategoriesType {
  id: number;
  label: string;
}