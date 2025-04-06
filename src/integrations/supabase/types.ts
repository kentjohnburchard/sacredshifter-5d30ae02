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
          created_at: string | null
          description: string | null
          id: string
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fractal_visuals: {
        Row: {
          chakra: string | null
          created_at: string | null
          formula: string | null
          frequency: number
          id: string
          notes: string | null
          prime_number: number
          principle: string | null
          type: string | null
          visual_url: string | null
        }
        Insert: {
          chakra?: string | null
          created_at?: string | null
          formula?: string | null
          frequency: number
          id?: string
          notes?: string | null
          prime_number: number
          principle?: string | null
          type?: string | null
          visual_url?: string | null
        }
        Update: {
          chakra?: string | null
          created_at?: string | null
          formula?: string | null
          frequency?: number
          id?: string
          notes?: string | null
          prime_number?: number
          principle?: string | null
          type?: string | null
          visual_url?: string | null
        }
        Relationships: []
      }
      frequency_audio_files: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          filename: string
          frequency_id: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          filename: string
          frequency_id: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          filename?: string
          frequency_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "frequency_audio_files_frequency_id_fkey"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "frequency_library"
            referencedColumns: ["id"]
          },
        ]
      }
      frequency_feedback: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          name: string
          track_id: string
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          name: string
          track_id: string
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          name?: string
          track_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "frequency_feedback_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "frequency_library"
            referencedColumns: ["id"]
          },
        ]
      }
      frequency_library: {
        Row: {
          affirmation: string | null
          audio_url: string | null
          category: string | null
          chakra: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          frequency: number
          id: string
          length: number | null
          principle: string | null
          session_type: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          url: string | null
          vibe_profile: string | null
          visual_theme: string | null
        }
        Insert: {
          affirmation?: string | null
          audio_url?: string | null
          category?: string | null
          chakra?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          frequency: number
          id?: string
          length?: number | null
          principle?: string | null
          session_type?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          url?: string | null
          vibe_profile?: string | null
          visual_theme?: string | null
        }
        Update: {
          affirmation?: string | null
          audio_url?: string | null
          category?: string | null
          chakra?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          frequency?: number
          id?: string
          length?: number | null
          principle?: string | null
          session_type?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string | null
          vibe_profile?: string | null
          visual_theme?: string | null
        }
        Relationships: []
      }
      frequency_visuals: {
        Row: {
          chakra: string | null
          created_at: string | null
          frequency: number
          id: string
          principle: string | null
          tags: string[] | null
          title: string | null
          type: string | null
          visual_url: string
        }
        Insert: {
          chakra?: string | null
          created_at?: string | null
          frequency: number
          id?: string
          principle?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          visual_url: string
        }
        Update: {
          chakra?: string | null
          created_at?: string | null
          frequency?: number
          id?: string
          principle?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string | null
          visual_url?: string
        }
        Relationships: []
      }
      journey_quotes: {
        Row: {
          created_at: string | null
          id: string
          journey_slug: string
          mode: string
          phase: string
          quote: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          journey_slug: string
          mode: string
          phase: string
          quote: string
        }
        Update: {
          created_at?: string | null
          id?: string
          journey_slug?: string
          mode?: string
          phase?: string
          quote?: string
        }
        Relationships: []
      }
      meditation_music: {
        Row: {
          audio_url: string
          created_at: string | null
          description: string | null
          frequency_id: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          description?: string | null
          frequency_id?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          description?: string | null
          frequency_id?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      music_generations: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          elemental_mode: string | null
          frequency: number | null
          id: string
          intention: string | null
          lyrics_type: string | null
          music_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          elemental_mode?: string | null
          frequency?: number | null
          id: string
          intention?: string | null
          lyrics_type?: string | null
          music_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          elemental_mode?: string | null
          frequency?: number | null
          id?: string
          intention?: string | null
          lyrics_type?: string | null
          music_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          display_name: string | null
          energy_level: number | null
          full_name: string | null
          id: string
          initial_mood: string | null
          interests: string[] | null
          onboarding_completed: boolean | null
          primary_intention: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          energy_level?: number | null
          full_name?: string | null
          id: string
          initial_mood?: string | null
          interests?: string[] | null
          onboarding_completed?: boolean | null
          primary_intention?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          energy_level?: number | null
          full_name?: string | null
          id?: string
          initial_mood?: string | null
          interests?: string[] | null
          onboarding_completed?: boolean | null
          primary_intention?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session_reflections: {
        Row: {
          content: string
          id: string
          session_id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          session_id: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          session_id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_reflections_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          frequency_id: string | null
          id: string
          initial_mood: string | null
          intention: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frequency_id?: string | null
          id?: string
          initial_mood?: string | null
          intention?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          frequency_id?: string | null
          id?: string
          initial_mood?: string | null
          intention?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_frequency_id_fkey"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "frequency_library"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          credits_per_period: number
          features: Json | null
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
          credits_per_period: number
          features?: Json | null
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
          credits_per_period?: number
          features?: Json | null
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
          chakra: string | null
          created_at: string | null
          frequency: number | null
          id: string
          intention: string | null
          notes: string | null
          tag: string | null
          title: string
          updated_at: string | null
          user_id: string
          visual_type: string | null
        }
        Insert: {
          chakra?: string | null
          created_at?: string | null
          frequency?: number | null
          id?: string
          intention?: string | null
          notes?: string | null
          tag?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          visual_type?: string | null
        }
        Update: {
          chakra?: string | null
          created_at?: string | null
          frequency?: number | null
          id?: string
          intention?: string | null
          notes?: string | null
          tag?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          visual_type?: string | null
        }
        Relationships: []
      }
      user_astrology_data: {
        Row: {
          birth_date: string
          birth_place: string
          birth_time: string | null
          created_at: string | null
          dominant_element: string | null
          id: string
          moon_sign: string | null
          rising_sign: string | null
          sun_sign: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_place: string
          birth_time?: string | null
          created_at?: string | null
          dominant_element?: string | null
          id?: string
          moon_sign?: string | null
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_place?: string
          birth_time?: string | null
          created_at?: string | null
          dominant_element?: string | null
          id?: string
          moon_sign?: string | null
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number | null
          last_updated: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          last_updated?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          last_updated?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_intentions: {
        Row: {
          created_at: string | null
          id: string
          intention: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          intention: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          intention?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          element: string | null
          id: string
          kent_mode: boolean | null
          soundscape_mode: string | null
          theme_gradient: string | null
          updated_at: string | null
          user_id: string | null
          watermark_style: string | null
          zodiac_sign: string | null
        }
        Insert: {
          created_at?: string | null
          element?: string | null
          id?: string
          kent_mode?: boolean | null
          soundscape_mode?: string | null
          theme_gradient?: string | null
          updated_at?: string | null
          user_id?: string | null
          watermark_style?: string | null
          zodiac_sign?: string | null
        }
        Update: {
          created_at?: string | null
          element?: string | null
          id?: string
          kent_mode?: boolean | null
          soundscape_mode?: string | null
          theme_gradient?: string | null
          updated_at?: string | null
          user_id?: string | null
          watermark_style?: string | null
          zodiac_sign?: string | null
        }
        Relationships: []
      }
      user_saved_frequencies: {
        Row: {
          created_at: string | null
          frequency_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frequency_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          frequency_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_frequencies_frequency_id_fkey"
            columns: ["frequency_id"]
            isOneToOne: false
            referencedRelation: "frequency_library"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_yearly: boolean | null
          plan_id: string | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_yearly?: boolean | null
          plan_id?: string | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_yearly?: boolean | null
          plan_id?: string | null
          started_at?: string | null
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
      create_user_intentions_table: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_audio_url: {
        Args: {
          filename: string
        }
        Returns: string
      }
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
