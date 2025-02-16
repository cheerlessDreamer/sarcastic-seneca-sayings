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
      "cmd+ctrl": {
        Row: {
          author: string | null
          description: string
          emoji: string | null
          id: number
          title: string
          url: string | null
        }
        Insert: {
          author?: string | null
          description: string
          emoji?: string | null
          id?: number
          title: string
          url?: string | null
        }
        Update: {
          author?: string | null
          description?: string
          emoji?: string | null
          id?: number
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      "do-this-next_responses": {
        Row: {
          created_at: string
          id: number
          respondent_name: string
          scores: Json
          task_list_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          respondent_name: string
          scores: Json
          task_list_id: number
        }
        Update: {
          created_at?: string
          id?: number
          respondent_name?: string
          scores?: Json
          task_list_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_task_list"
            columns: ["task_list_id"]
            isOneToOne: false
            referencedRelation: "do-this-next_tasks_list"
            referencedColumns: ["id"]
          },
        ]
      }
      "do-this-next_tasks_list": {
        Row: {
          created_at: string
          id: number
          share_id: string | null
          tasks: Json | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          share_id?: string | null
          tasks?: Json | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          share_id?: string | null
          tasks?: Json | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      "human-readable-weights": {
        Row: {
          category: string
          created_at: string | null
          icon: string
          id: number
          locality: string
          name: string
          type: string
          updated_at: string | null
          weight: number
        }
        Insert: {
          category: string
          created_at?: string | null
          icon?: string
          id?: number
          locality: string
          name: string
          type: string
          updated_at?: string | null
          weight: number
        }
        Update: {
          category?: string
          created_at?: string | null
          icon?: string
          id?: number
          locality?: string
          name?: string
          type?: string
          updated_at?: string | null
          weight?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      "seneca-says": {
        Row: {
          created_at: string
          feedback: number | null
          id: number
          philosopher: string | null
          philosopher_instructions: string | null
          reference: number
          request: string | null
          response: string | null
        }
        Insert: {
          created_at?: string
          feedback?: number | null
          id?: number
          philosopher?: string | null
          philosopher_instructions?: string | null
          reference: number
          request?: string | null
          response?: string | null
        }
        Update: {
          created_at?: string
          feedback?: number | null
          id?: number
          philosopher?: string | null
          philosopher_instructions?: string | null
          reference?: number
          request?: string | null
          response?: string | null
        }
        Relationships: []
      }
      "seneca-says_philosopher_suggestions": {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          status: string
          submitter_email: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: never
          name: string
          status?: string
          submitter_email?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: never
          name?: string
          status?: string
          submitter_email?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_old_anonymous_lists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
