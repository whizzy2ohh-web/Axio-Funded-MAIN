export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_credentials: {
        Row: {
          api_key_secret: string | null
          api_secret_secret: string | null
          challenge_id: string | null
          created_at: string
          id: string
          login_id: string | null
          password_secret: string | null
          platform: Database["public"]["Enums"]["platform_kind"]
          server: string | null
          user_id: string
        }
        Insert: {
          api_key_secret?: string | null
          api_secret_secret?: string | null
          challenge_id?: string | null
          created_at?: string
          id?: string
          login_id?: string | null
          password_secret?: string | null
          platform: Database["public"]["Enums"]["platform_kind"]
          server?: string | null
          user_id: string
        }
        Update: {
          api_key_secret?: string | null
          api_secret_secret?: string | null
          challenge_id?: string | null
          created_at?: string
          id?: string
          login_id?: string | null
          password_secret?: string | null
          platform?: Database["public"]["Enums"]["platform_kind"]
          server?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_credentials_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          account_size: number
          available_balance: number
          created_at: string
          drawdown_pct: number
          id: string
          phase: Database["public"]["Enums"]["challenge_phase"]
          profit_pct: number
          status: Database["public"]["Enums"]["challenge_status"]
          stripe_session_id: string | null
          tier: Database["public"]["Enums"]["challenge_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_size: number
          available_balance?: number
          created_at?: string
          drawdown_pct?: number
          id?: string
          phase?: Database["public"]["Enums"]["challenge_phase"]
          profit_pct?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          stripe_session_id?: string | null
          tier: Database["public"]["Enums"]["challenge_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_size?: number
          available_balance?: number
          created_at?: string
          drawdown_pct?: number
          id?: string
          phase?: Database["public"]["Enums"]["challenge_phase"]
          profit_pct?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          stripe_session_id?: string | null
          tier?: Database["public"]["Enums"]["challenge_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          challenge_id: string | null
          destination: string
          id: string
          method: Database["public"]["Enums"]["payout_method"]
          processed_at: string | null
          requested_at: string
          status: Database["public"]["Enums"]["payout_status"]
          user_id: string
        }
        Insert: {
          amount: number
          challenge_id?: string | null
          destination: string
          id?: string
          method: Database["public"]["Enums"]["payout_method"]
          processed_at?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
          user_id: string
        }
        Update: {
          amount?: number
          challenge_id?: string | null
          destination?: string
          id?: string
          method?: Database["public"]["Enums"]["payout_method"]
          processed_at?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          referral_code: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          referral_code?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          referral_code?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          challenge_id: string | null
          closed_at: string | null
          entry_price: number
          exit_price: number | null
          id: string
          lots: number
          opened_at: string
          pnl: number
          side: Database["public"]["Enums"]["trade_side"]
          status: Database["public"]["Enums"]["trade_status"]
          symbol: string
          user_id: string
        }
        Insert: {
          challenge_id?: string | null
          closed_at?: string | null
          entry_price: number
          exit_price?: number | null
          id?: string
          lots: number
          opened_at?: string
          pnl?: number
          side: Database["public"]["Enums"]["trade_side"]
          status?: Database["public"]["Enums"]["trade_status"]
          symbol: string
          user_id: string
        }
        Update: {
          challenge_id?: string | null
          closed_at?: string | null
          entry_price?: number
          exit_price?: number | null
          id?: string
          lots?: number
          opened_at?: string
          pnl?: number
          side?: Database["public"]["Enums"]["trade_side"]
          status?: Database["public"]["Enums"]["trade_status"]
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      challenge_phase: "phase_1" | "phase_2" | "funded"
      challenge_status: "active" | "passed" | "breached"
      challenge_tier: "starter" | "pro" | "elite"
      payout_method: "bank" | "usdt_trc20" | "usdt_erc20" | "btc"
      payout_status: "pending" | "approved" | "paid" | "rejected"
      platform_kind: "mt4" | "mt5" | "binance" | "bybit" | "bingx"
      trade_side: "buy" | "sell"
      trade_status: "open" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      challenge_phase: ["phase_1", "phase_2", "funded"],
      challenge_status: ["active", "passed", "breached"],
      challenge_tier: ["starter", "pro", "elite"],
      payout_method: ["bank", "usdt_trc20", "usdt_erc20", "btc"],
      payout_status: ["pending", "approved", "paid", "rejected"],
      platform_kind: ["mt4", "mt5", "binance", "bybit", "bingx"],
      trade_side: ["buy", "sell"],
      trade_status: ["open", "closed"],
    },
  },
} as const
