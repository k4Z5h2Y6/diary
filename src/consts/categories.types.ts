export interface CategoriesType {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          category_name: string;
        };
        Insert: {
          id: number;
          category_name: string;
        };
        Update: {
          id: number;
          category_name: string;
        };
        Delete: {
          id: number;
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

export interface InputCategoriesType {
  id: number;
  category_name: string;
}

export interface LabelCategoriesType {
  id: number;
  label: string;
}