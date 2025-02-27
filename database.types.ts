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
      games: {
        Row: {
          avatar_url: string | null
          id: string
          lives: number | null
          score: number | null
          time: number | null
          timestamp: string
          type: number | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id?: string
          lives?: number | null
          score?: number | null
          time?: number | null
          timestamp?: string
          type?: number | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          lives?: number | null
          score?: number | null
          time?: number | null
          timestamp?: string
          type?: number | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_avatar_url_fkey"
            columns: ["avatar_url"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["avatar_url"]
          },
          {
            foreignKeyName: "games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_username_fkey"
            columns: ["username"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      multiplayer_games: {
        Row: {
          code: string
          end: string | null
          game_type: number | null
          id: string
          is_over: boolean
          winner: string | null
        }
        Insert: {
          code: string
          end?: string | null
          game_type?: number | null
          id?: string
          is_over?: boolean
          winner?: string | null
        }
        Update: {
          code?: string
          end?: string | null
          game_type?: number | null
          id?: string
          is_over?: boolean
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multiplayer_games_winner_fkey"
            columns: ["winner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      multiplayer_players: {
        Row: {
          code: string
          id: string
          lives: number | null
          score: number | null
          user_id: string
        }
        Insert: {
          code: string
          id?: string
          lives?: number | null
          score?: number | null
          user_id?: string
        }
        Update: {
          code?: string
          id?: string
          lives?: number | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "multiplayer_players_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "multiplayer_games"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "multiplayer_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      finish_multiplayer_game: {
        Args: {
          game_code: string
        }
        Returns: undefined
      }
      initialize_multiplayer_game: {
        Args: Record<PropertyKey, never>
        Returns: {
          new_code: string
          game_type: number
        }[]
      }
      join_multiplayer_game: {
        Args: {
          game_code: string
        }
        Returns: {
          game_type: number
        }[]
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
