// Database types for Supabase
// These types match the schema defined in the plan

export interface Database {
  public: {
    Tables: {
      okrs: {
        Row: {
          id: string;
          display_id: string | null;
          objective: string;
          created_at: string;
          parent_id: string | null;
          area: string | null;
          owner: string | null;
          challenges: string | null;
          needs: string | null;
          comments: string | null;
          status: string | null;
        };
        Insert: {
          id?: string;
          display_id?: string | null;
          objective: string;
          created_at?: string;
          parent_id?: string | null;
          area?: string | null;
          owner?: string | null;
          challenges?: string | null;
          needs?: string | null;
          comments?: string | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          display_id?: string | null;
          objective?: string;
          created_at?: string;
          parent_id?: string | null;
          area?: string | null;
          owner?: string | null;
          challenges?: string | null;
          needs?: string | null;
          comments?: string | null;
          status?: string | null;
        };
      };
      key_results: {
        Row: {
          id: string;
          okr_id: string;
          metric_name: string;
          from_value: number;
          to_value: number;
          unit: string | null;
          current_value: number | null;
          status: string | null;
          function: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          okr_id: string;
          metric_name: string;
          from_value: number;
          to_value: number;
          unit?: string | null;
          current_value?: number | null;
          status?: string | null;
          function?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          okr_id?: string;
          metric_name?: string;
          from_value?: number;
          to_value?: number;
          unit?: string | null;
          current_value?: number | null;
          status?: string | null;
          function?: string | null;
          sort_order?: number;
        };
      };
      quality_checklist: {
        Row: {
          id: string;
          okr_id: string;
          item_id: string;
          checked: boolean;
        };
        Insert: {
          id?: string;
          okr_id: string;
          item_id: string;
          checked?: boolean;
        };
        Update: {
          id?: string;
          okr_id?: string;
          item_id?: string;
          checked?: boolean;
        };
      };
      actions: {
        Row: {
          id: string;
          okr_id: string;
          text: string;
          owner: string;
          due_date: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          okr_id: string;
          text: string;
          owner: string;
          due_date: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          okr_id?: string;
          text?: string;
          owner?: string;
          due_date?: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Convenience types
export type OKRRow = Database['public']['Tables']['okrs']['Row'];
export type OKRInsert = Database['public']['Tables']['okrs']['Insert'];
export type KeyResultRow = Database['public']['Tables']['key_results']['Row'];
export type KeyResultInsert = Database['public']['Tables']['key_results']['Insert'];
export type QualityChecklistRow = Database['public']['Tables']['quality_checklist']['Row'];
export type ActionRow = Database['public']['Tables']['actions']['Row'];
export type ActionInsert = Database['public']['Tables']['actions']['Insert'];
