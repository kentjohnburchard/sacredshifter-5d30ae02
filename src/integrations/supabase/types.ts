export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          id: string
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_music: {
        Row: {
          audio_url: string
          created_at: string
          description: string | null
          frequency_id: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          description?: string | null
          frequency_id: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          description?: string | null
          frequency_id?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      music: {
        Row: {
          created_at: string | null
          id: number
          music_file: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          music_file?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          music_file?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      music_generations: {
        Row: {
          audio_parameters: Json | null
          audio_url: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          elemental_mode: string
          frequency: number
          id: string
          intention: string
          lyrics_type: string | null
          mood: string | null
          music_url: string | null
          source: string | null
          status: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          audio_parameters?: Json | null
          audio_url?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          elemental_mode: string
          frequency: number
          id?: string
          intention: string
          lyrics_type?: string | null
          mood?: string | null
          music_url?: string | null
          source?: string | null
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          audio_parameters?: Json | null
          audio_url?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          elemental_mode?: string
          frequency?: number
          id?: string
          intention?: string
          lyrics_type?: string | null
          mood?: string | null
          music_url?: string | null
          source?: string | null
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      music_tracks: {
        Row: {
          created_at: string
          id: string
          mood: string | null
          track_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mood?: string | null
          track_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string | null
          track_url?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          chakra: string | null
          chosen_color: string | null
          created_at: string | null
          duration: number | null
          frequency: number | null
          id: string
          initial_mood: string | null
          intention: string | null
          post_session_feeling: string | null
          session_duration: number | null
          timestamp: string
          user_id: string
          visual_theme: string | null
        }
        Insert: {
          chakra?: string | null
          chosen_color?: string | null
          created_at?: string | null
          duration?: number | null
          frequency?: number | null
          id?: string
          initial_mood?: string | null
          intention?: string | null
          post_session_feeling?: string | null
          session_duration?: number | null
          timestamp?: string
          user_id: string
          visual_theme?: string | null
        }
        Update: {
          chakra?: string | null
          chosen_color?: string | null
          created_at?: string | null
          duration?: number | null
          frequency?: number | null
          id?: string
          initial_mood?: string | null
          intention?: string | null
          post_session_feeling?: string | null
          session_duration?: number | null
          timestamp?: string
          user_id?: string
          visual_theme?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          credits_per_period: number
          features: Json
          id: string
          is_best_value: boolean | null
          is_popular: boolean | null
          name: string
          period: string
          price: number
          songs_equivalent: number
          yearly_discount: number | null
        }
        Insert: {
          created_at?: string
          credits_per_period: number
          features: Json
          id?: string
          is_best_value?: boolean | null
          is_popular?: boolean | null
          name: string
          period: string
          price: number
          songs_equivalent: number
          yearly_discount?: number | null
        }
        Update: {
          created_at?: string
          credits_per_period?: number
          features?: Json
          id?: string
          is_best_value?: boolean | null
          is_popular?: boolean | null
          name?: string
          period?: string
          price?: number
          songs_equivalent?: number
          yearly_discount?: number | null
        }
        Relationships: []
      }
      timeline_snapshots: {
        Row: {
          created_at: string
          id: string
          journal: string | null
          notes: string | null
          session_id: string | null
          tag: string | null
          tags: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journal?: string | null
          notes?: string | null
          session_id?: string | null
          tag?: string | null
          tags?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journal?: string | null
          notes?: string | null
          session_id?: string | null
          tag?: string | null
          tags?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number
          id: string
          last_updated: string
          user_id: string
        }
        Insert: {
          balance?: number
          id?: string
          last_updated?: string
          user_id: string
        }
        Update: {
          balance?: number
          id?: string
          last_updated?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_yearly: boolean | null
          plan_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_yearly?: boolean | null
          plan_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_yearly?: boolean | null
          plan_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      use_generation_credit: {
        Args: {
          user_id: string
          credit_cost?: number
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
