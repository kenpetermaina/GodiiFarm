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
      breeding_records: {
        Row: {
          cow_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cow_id: string
          created_at?: string
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cow_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeding_records_cow_id_fkey"
            columns: ["cow_id"]
            isOneToOne: false
            referencedRelation: "cows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cows: {
        Row: {
          breed: string | null
          created_at: string
          date_of_birth: string | null
          gender: string | null
          id: string
          name: string | null
          status: string
          tag_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          breed?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          status?: string
          tag_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          breed?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          status?: string
          tag_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      feed_records: {
        Row: {
          cow_id: string
          created_at: string
          feed_type: string
          feeding_time: string
          id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cow_id: string
          created_at?: string
          feed_type: string
          feeding_time: string
          id?: string
          quantity: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cow_id?: string
          created_at?: string
          feed_type?: string
          feeding_time?: string
          id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_records_cow_id_fkey"
            columns: ["cow_id"]
            isOneToOne: false
            referencedRelation: "cows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      health_records: {
        Row: {
          cow_id: string
          created_at: string
          id: string
          illness: string
          treatment: string | null
          updated_at: string
          user_id: string
          vet_name: string | null
          visit_date: string
        }
        Insert: {
          cow_id: string
          created_at?: string
          id?: string
          illness: string
          treatment?: string | null
          updated_at?: string
          user_id: string
          vet_name?: string | null
          visit_date: string
        }
        Update: {
          cow_id?: string
          created_at?: string
          id?: string
          illness?: string
          treatment?: string | null
          updated_at?: string
          user_id?: string
          vet_name?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_cow_id_fkey"
            columns: ["cow_id"]
            isOneToOne: false
            referencedRelation: "cows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      milk_records: {
        Row: {
          amount_liters: number
          cow_id: string
          created_at: string
          date: string
          id: string
          notes: string | null
          session: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_liters: number
          cow_id: string
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          session?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_liters?: number
          cow_id?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          session?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milk_records_cow_id_fkey"
            columns: ["cow_id"]
            isOneToOne: false
            referencedRelation: "cows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milk_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
          }
        ]
      }
      cows: {
        Row: {
          age: number
          breed: string | null
          created_at: string
          health: string
          id: string
          last_checkup: string
          name: string
          tag: string
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          age?: number
          breed?: string | null
          created_at?: string
          health?: string
          id?: string
          last_checkup?: string
          name: string
          tag: string
          updated_at?: string
          user_id: string
          weight?: number
        }
        Update: {
          age?: number
          breed?: string | null
          created_at?: string
          health?: string
          id?: string
          last_checkup?: string
          name?: string
          tag?: string
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "cows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feed_records: {
        Row: {
          cow_id: string
          created_at: string
          date: string
          feed_type: string
          id: string
          quantity: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cow_id: string
          created_at?: string
          date: string
          feed_type: string
          id?: string
          quantity: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cow_id?: string
          created_at?: string
          date?: string
          feed_type?: string
          id?: string
          quantity?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_records_cow_id_fkey"
            columns: ["cow_id"]
            isOneToOne: false
            referencedRelation: "cows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      health_records: {
        Row: {
          cow_id: string
          created_at: string
          date: string
          id: string
          status: string
          symptoms: string | null
          treatment: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cow_id: string
          created_at?: string
          date: string
          id: string
          status: string
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cow_id?: string
          created_at?: string
          date?: string
          id?: string
          status?: string
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_cow_id_fkey"
            columns: ["cow_id"]
            isOneToOne: false
            referencedRelation: "cows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      milk_records: {
        Row: {
          amount: number
          cow_id: string
          created_at: string
          date: string
          id: string
          session: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          cow_id: string
          created_at?: string
          date: string
          id?: string
          session: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          cow_id?: string
          created_at?: string
          date?: string
          id?: string
          session?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milk_records_cow_id_fkey"
            columns: ["cow_id"]
            isOneToOne: false
            referencedRelation: "cows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milk_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          content: string
          cow_id: string
          created_at: string
          date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          cow_id: string
          created_at?: string
          date: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          cow_id?: string
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_cow_id_fkey"
            columns: ["cow_id"]
            isOneToOne: false
            referencedRelation: "cows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
