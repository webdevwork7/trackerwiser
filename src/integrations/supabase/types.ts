export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)";
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          browser: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          device_type: string | null;
          event_type: string;
          id: string;
          ip_address: unknown | null;
          is_bot: boolean | null;
          os: string | null;
          page_url: string | null;
          referrer: string | null;
          session_id: string;
          user_agent: string | null;
          visitor_id: string;
          website_id: string;
          cloaking_action: string | null;
        };
        Insert: {
          browser?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          device_type?: string | null;
          event_type: string;
          id?: string;
          ip_address?: unknown | null;
          is_bot?: boolean | null;
          os?: string | null;
          page_url?: string | null;
          referrer?: string | null;
          session_id: string;
          user_agent?: string | null;
          visitor_id: string;
          website_id: string;
          cloaking_action?: string | null;
        };
        Update: {
          browser?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          device_type?: string | null;
          event_type?: string;
          id?: string;
          ip_address?: unknown | null;
          is_bot?: boolean | null;
          os?: string | null;
          page_url?: string | null;
          referrer?: string | null;
          session_id?: string;
          user_agent?: string | null;
          visitor_id?: string;
          website_id?: string;
          cloaking_action?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_events_website_id_fkey";
            columns: ["website_id"];
            isOneToOne: false;
            referencedRelation: "websites";
            referencedColumns: ["id"];
          }
        ];
      };
      bot_detections: {
        Row: {
          created_at: string;
          detection_reason: string;
          id: string;
          ip_address: unknown;
          is_blocked: boolean | null;
          user_agent: string | null;
          website_id: string;
        };
        Insert: {
          created_at?: string;
          detection_reason: string;
          id?: string;
          ip_address: unknown;
          is_blocked?: boolean | null;
          user_agent?: string | null;
          website_id: string;
        };
        Update: {
          created_at?: string;
          detection_reason?: string;
          id?: string;
          ip_address?: unknown;
          is_blocked?: boolean | null;
          user_agent?: string | null;
          website_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bot_detections_website_id_fkey";
            columns: ["website_id"];
            isOneToOne: false;
            referencedRelation: "websites";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      websites: {
        Row: {
          created_at: string;
          domain: string;
          id: string;
          is_active: boolean | null;
          name: string;
          tracking_code: string;
          updated_at: string;
          user_id: string;
          cloaking_enabled: boolean | null;
          heatmap_enabled: boolean | null;
          session_recording_enabled: boolean | null;
        };
        Insert: {
          created_at?: string;
          domain: string;
          id?: string;
          is_active?: boolean | null;
          name: string;
          tracking_code: string;
          updated_at?: string;
          user_id: string;
          cloaking_enabled?: boolean | null;
          heatmap_enabled?: boolean | null;
          session_recording_enabled?: boolean | null;
        };
        Update: {
          created_at?: string;
          domain?: string;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          tracking_code?: string;
          updated_at?: string;
          user_id?: string;
          cloaking_enabled?: boolean | null;
          heatmap_enabled?: boolean | null;
          session_recording_enabled?: boolean | null;
        };
        Relationships: [];
      };
      cloaking_rules: {
        Row: {
          id: string;
          website_id: string;
          name: string;
          trigger: string;
          condition: string;
          action: string;
          status: string;
          hits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          website_id: string;
          name: string;
          trigger: string;
          condition: string;
          action: string;
          status?: string;
          hits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          website_id?: string;
          name?: string;
          trigger?: string;
          condition?: string;
          action?: string;
          status?: string;
          hits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cloaking_rules_website_id_fkey";
            columns: ["website_id"];
            isOneToOne: false;
            referencedRelation: "websites";
            referencedColumns: ["id"];
          }
        ];
      };
      cloaking_pages: {
        Row: {
          id: string;
          website_id: string;
          page_type: string;
          url: string;
          title: string;
          content: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          website_id: string;
          page_type: string;
          url: string;
          title: string;
          content: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          website_id?: string;
          page_type?: string;
          url?: string;
          title?: string;
          content?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cloaking_pages_website_id_fkey";
            columns: ["website_id"];
            isOneToOne: false;
            referencedRelation: "websites";
            referencedColumns: ["id"];
          }
        ];
      };
      heatmap_events: {
        Row: {
          id: string;
          website_id: string;
          event_type: string;
          page_url: string;
          x_position: number | null;
          y_position: number | null;
          element_selector: string | null;
          element_text: string | null;
          session_id: string;
          visitor_id: string;
          scroll_depth: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          website_id: string;
          event_type: string;
          page_url: string;
          x_position?: number | null;
          y_position?: number | null;
          element_selector?: string | null;
          element_text?: string | null;
          session_id: string;
          visitor_id: string;
          scroll_depth?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          website_id?: string;
          event_type?: string;
          page_url?: string;
          x_position?: number | null;
          y_position?: number | null;
          element_selector?: string | null;
          element_text?: string | null;
          session_id?: string;
          visitor_id?: string;
          scroll_depth?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "heatmap_events_website_id_fkey";
            columns: ["website_id"];
            isOneToOne: false;
            referencedRelation: "websites";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
