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
      audio_function_mappings: {
        Row: {
          audio_file_name: string
          audio_url: string | null
          created_at: string
          function_id: string
          id: string
          is_primary: boolean
          updated_at: string | null
        }
        Insert: {
          audio_file_name: string
          audio_url?: string | null
          created_at?: string
          function_id: string
          id?: string
          is_primary?: boolean
          updated_at?: string | null
        }
        Update: {
          audio_file_name?: string
          audio_url?: string | null
          created_at?: string
          function_id?: string
          id?: string
          is_primary?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
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
          feature: string | null
          frequency: number
          group_id: string | null
          id: string
          length: number | null
          principle: string | null
          session_type: string | null
          tags: string[] | null
          title: string
          type: string | null
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
          feature?: string | null
          frequency: number
          group_id?: string | null
          id?: string
          length?: number | null
          principle?: string | null
          session_type?: string | null
          tags?: string[] | null
          title: string
          type?: string | null
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
          feature?: string | null
          frequency?: number
          group_id?: string | null
          id?: string
          length?: number | null
          principle?: string | null
          session_type?: string | null
          tags?: string[] | null
          title?: string
          type?: string | null
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
      journey_template_audio_mappings: {
        Row: {
          audio_file_name: string
          audio_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          display_title: string | null
          id: string
          is_primary: boolean | null
          journey_template_id: string | null
        }
        Insert: {
          audio_file_name: string
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          display_title?: string | null
          id?: string
          is_primary?: boolean | null
          journey_template_id?: string | null
        }
        Update: {
          audio_file_name?: string
          audio_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          display_title?: string | null
          id?: string
          is_primary?: boolean | null
          journey_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_audio_mappings_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_features: {
        Row: {
          created_at: string | null
          feature: string
          id: string
          journey_template_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature: string
          id?: string
          journey_template_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature?: string
          id?: string
          journey_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_features_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_frequencies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          journey_template_id: string | null
          name: string
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          journey_template_id?: string | null
          name: string
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          journey_template_id?: string | null
          name?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_frequencies_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_sound_sources: {
        Row: {
          created_at: string | null
          id: string
          journey_template_id: string | null
          source: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          journey_template_id?: string | null
          source: string
        }
        Update: {
          created_at?: string | null
          id?: string
          journey_template_id?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_sound_sources_journey_template_id_fkey"
            columns: ["journey_template_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_templates: {
        Row: {
          affirmation: string | null
          chakras: string[] | null
          color: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          emoji: string | null
          guided_prompt: string | null
          id: string
          name: string | null
          purpose: string | null
          session_type: string | null
          subtitle: string | null
          title: string
          vale_quote: string | null
          vibe: string | null
          visual_theme: string | null
        }
        Insert: {
          affirmation?: string | null
          chakras?: string[] | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          emoji?: string | null
          guided_prompt?: string | null
          id: string
          name?: string | null
          purpose?: string | null
          session_type?: string | null
          subtitle?: string | null
          title: string
          vale_quote?: string | null
          vibe?: string | null
          visual_theme?: string | null
        }
        Update: {
          affirmation?: string | null
          chakras?: string[] | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          emoji?: string | null
          guided_prompt?: string | null
          id?: string
          name?: string | null
          purpose?: string | null
          session_type?: string | null
          subtitle?: string | null
          title?: string
          vale_quote?: string | null
          vibe?: string | null
          visual_theme?: string | null
        }
        Relationships: []
      }
      love_quotes: {
        Row: {
          created_at: string | null
          frequency_level: number | null
          id: string
          mood: string | null
          text: string
          topic: string | null
        }
        Insert: {
          created_at?: string | null
          frequency_level?: number | null
          id?: string
          mood?: string | null
          text: string
          topic?: string | null
        }
        Update: {
          created_at?: string | null
          frequency_level?: number | null
          id?: string
          mood?: string | null
          text?: string
          topic?: string | null
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
      mirror_moments: {
        Row: {
          created_at: string | null
          id: string
          message: string
          return_date: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          return_date: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          return_date?: string
          user_id?: string
          viewed_at?: string | null
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
      sacred_blueprint_quiz_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          response: string | null
          response_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          response?: string | null
          response_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          response?: string | null
          response_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sacred_blueprints: {
        Row: {
          blueprint_text: string | null
          chakra_signature: Json | null
          core_frequency: string | null
          created_at: string | null
          elemental_resonance: string | null
          emotional_profile: string | null
          energetic_archetype: string | null
          frequency_value: number | null
          id: string
          musical_key: string | null
          name: string | null
          shadow_frequencies: string[] | null
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          blueprint_text?: string | null
          chakra_signature?: Json | null
          core_frequency?: string | null
          created_at?: string | null
          elemental_resonance?: string | null
          emotional_profile?: string | null
          energetic_archetype?: string | null
          frequency_value?: number | null
          id?: string
          musical_key?: string | null
          name?: string | null
          shadow_frequencies?: string[] | null
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          blueprint_text?: string | null
          chakra_signature?: Json | null
          core_frequency?: string | null
          created_at?: string | null
          elemental_resonance?: string | null
          emotional_profile?: string | null
          energetic_archetype?: string | null
          frequency_value?: number | null
          id?: string
          musical_key?: string | null
          name?: string | null
          shadow_frequencies?: string[] | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
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
      soul_hugs: {
        Row: {
          created_at: string | null
          id: string
          is_anonymous: boolean
          message: string
          recipient_id: string | null
          sender_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean
          message: string
          recipient_id?: string | null
          sender_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string
          recipient_id?: string | null
          sender_id?: string
          tag?: string
        }
        Relationships: []
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
          consciousness_mode: string | null
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
          consciousness_mode?: string | null
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
          consciousness_mode?: string | null
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
      get_audio_by_feature: {
        Args: { feature_name: string }
        Returns: {
          id: string
          title: string
          audio_url: string
          frequency: number
          chakra: string
          description: string
          group_id: string
        }[]
      }
      get_audio_url: {
        Args: { filename: string }
        Returns: string
      }
      get_journey_audio_mapping: {
        Args: { template_id: string }
        Returns: {
          journey_template_id: string
          audio_file_name: string
          audio_url: string
          is_primary: boolean
          display_order: number
          display_title: string
        }[]
      }
      get_random_audio_from_group: {
        Args: { group_name: string }
        Returns: {
          id: string
          title: string
          audio_url: string
          frequency: number
          chakra: string
          description: string
        }[]
      }
      use_generation_credit: {
        Args: { user_id: string; credit_cost?: number }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
