export interface SleepsType {
  public: {
    Tables: {
      sleeps: {
        Row: {
          id: number;
          user_id: string;
          created_at: string | null;
          update_at: string | null;
          sleep_onset_at: string | null;
          wake_up_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          created_at?: string | null;
          update_at?: string | null;
          sleep_onset_at?: string | null;
          wake_up_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          created_at?: string | null;
          update_at: string | null;
          sleep_onset_at?: string | null;
          wake_up_at?: string | null;
        };
        Delete: {
          id: number;
          user_id: string | null;
          created_at?: string | null;
          update_at?: string | null;
          sleep_onset_at?: string | null;
          wake_up_at?: string | null;
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

export interface UpdateWakeupType {
  update_at: string;
  wake_up_at: string;
}

export interface UpdateSleepType {
  update_at: string;
  sleep_onset_at?: string | null;
  wake_up_at?: string | null;
}

export interface SleepDataType {
  id: number;
  user_id: string;
  created_at: string | null;
  update_at: string | null;
  sleep_onset_at: string | null;
  wake_up_at: string | null;
}
