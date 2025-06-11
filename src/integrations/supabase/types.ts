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
      customers: {
        Row: {
          city: string | null
          contact_email: string | null
          contact_person: string
          contact_phone: string | null
          id: string
          name: string
          state: string | null
          street: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          contact_email?: string | null
          contact_person: string
          contact_phone?: string | null
          id?: string
          name: string
          state?: string | null
          street?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          contact_email?: string | null
          contact_person?: string
          contact_phone?: string | null
          id?: string
          name?: string
          state?: string | null
          street?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      facility_locations: {
        Row: {
          facility_id: string
          id: string
          name: string
        }
        Insert: {
          facility_id: string
          id?: string
          name: string
        }
        Update: {
          facility_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_locations_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      recovery_surveys: {
        Row: {
          accomplishments: string | null
          additional_comments: string | null
          celebrations: string | null
          court_intakes: number | null
          created_at: string
          discharge_reasons: string | null
          discharges: number | null
          drug_screens: number | null
          evaluation_details: string | null
          evaluations: string | null
          events: string | null
          facility_issues: string | null
          id: string
          mat_clients: number | null
          mat_intakes: number | null
          meeting_dates: string | null
          ots1_orientations: number | null
          peer_mentors: number | null
          phase1_completions: number | null
          phase1_count: number | null
          phase1_next_steps: string | null
          phase2_completions: number | null
          phase2_count: number | null
          phase2_next_steps: string | null
          program_concerns: string | null
          program_name: string
          report_date: string
          reporter_name: string
          scheduled_intakes: number | null
          staff_meetings: number | null
          staffing_needs: string | null
          supply_needs: string | null
          total_intakes: number | null
          upcoming_events: string | null
          updated_at: string
          user_id: string
          week_summary: string | null
        }
        Insert: {
          accomplishments?: string | null
          additional_comments?: string | null
          celebrations?: string | null
          court_intakes?: number | null
          created_at?: string
          discharge_reasons?: string | null
          discharges?: number | null
          drug_screens?: number | null
          evaluation_details?: string | null
          evaluations?: string | null
          events?: string | null
          facility_issues?: string | null
          id?: string
          mat_clients?: number | null
          mat_intakes?: number | null
          meeting_dates?: string | null
          ots1_orientations?: number | null
          peer_mentors?: number | null
          phase1_completions?: number | null
          phase1_count?: number | null
          phase1_next_steps?: string | null
          phase2_completions?: number | null
          phase2_count?: number | null
          phase2_next_steps?: string | null
          program_concerns?: string | null
          program_name: string
          report_date: string
          reporter_name: string
          scheduled_intakes?: number | null
          staff_meetings?: number | null
          staffing_needs?: string | null
          supply_needs?: string | null
          total_intakes?: number | null
          upcoming_events?: string | null
          updated_at?: string
          user_id: string
          week_summary?: string | null
        }
        Update: {
          accomplishments?: string | null
          additional_comments?: string | null
          celebrations?: string | null
          court_intakes?: number | null
          created_at?: string
          discharge_reasons?: string | null
          discharges?: number | null
          drug_screens?: number | null
          evaluation_details?: string | null
          evaluations?: string | null
          events?: string | null
          facility_issues?: string | null
          id?: string
          mat_clients?: number | null
          mat_intakes?: number | null
          meeting_dates?: string | null
          ots1_orientations?: number | null
          peer_mentors?: number | null
          phase1_completions?: number | null
          phase1_count?: number | null
          phase1_next_steps?: string | null
          phase2_completions?: number | null
          phase2_count?: number | null
          phase2_next_steps?: string | null
          program_concerns?: string | null
          program_name?: string
          report_date?: string
          reporter_name?: string
          scheduled_intakes?: number | null
          staff_meetings?: number | null
          staffing_needs?: string | null
          supply_needs?: string | null
          total_intakes?: number | null
          upcoming_events?: string | null
          updated_at?: string
          user_id?: string
          week_summary?: string | null
        }
        Relationships: []
      }
      service_entries: {
        Row: {
          created_at: string | null
          customer_id: string
          date: string
          description: string | null
          end_time: string | null
          facility_location_id: string
          hours: number
          id: string
          start_time: string | null
          updated_at: string | null
          volunteer_count: number
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          date: string
          description?: string | null
          end_time?: string | null
          facility_location_id: string
          hours: number
          id?: string
          start_time?: string | null
          updated_at?: string | null
          volunteer_count: number
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          date?: string
          description?: string | null
          end_time?: string | null
          facility_location_id?: string
          hours?: number
          id?: string
          start_time?: string | null
          updated_at?: string | null
          volunteer_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_entries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_entries_facility_location_id_fkey"
            columns: ["facility_location_id"]
            isOneToOne: false
            referencedRelation: "facility_locations"
            referencedColumns: ["id"]
          },
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
