export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      incident_reports: {
        Row: {
          additional_documentation: string | null
          auto_save_data: Json | null
          contributing_factors: string | null
          created_at: string | null
          evidence_collected: boolean | null
          family_notification_details: string | null
          family_notified: boolean | null
          follow_up_actions_required: string | null
          hospital_details: string | null
          hospital_transport_required: boolean | null
          id: string
          immediate_actions_taken: string | null
          immediate_cause: string | null
          incident_date: string
          incident_description: string
          incident_prevention_measures: string | null
          incident_time: string
          incident_type: string
          injuries_sustained: string | null
          last_saved_at: string | null
          location: string
          medical_professional_contacted: boolean | null
          medical_professional_details: string | null
          medical_treatment_provided: boolean | null
          photos_taken: boolean | null
          regulatory_agencies: string | null
          regulatory_reporting_required: boolean | null
          report_status: string | null
          residents_involved: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          severity_level: string
          staff_involved: Json | null
          submitted_at: string | null
          supervisor_name: string | null
          supervisor_notification_time: string | null
          supervisor_notified: boolean | null
          updated_at: string | null
          user_id: string
          visitors_involved: Json | null
          witnesses: Json | null
        }
        Insert: {
          additional_documentation?: string | null
          auto_save_data?: Json | null
          contributing_factors?: string | null
          created_at?: string | null
          evidence_collected?: boolean | null
          family_notification_details?: string | null
          family_notified?: boolean | null
          follow_up_actions_required?: string | null
          hospital_details?: string | null
          hospital_transport_required?: boolean | null
          id?: string
          immediate_actions_taken?: string | null
          immediate_cause?: string | null
          incident_date: string
          incident_description: string
          incident_prevention_measures?: string | null
          incident_time: string
          incident_type: string
          injuries_sustained?: string | null
          last_saved_at?: string | null
          location: string
          medical_professional_contacted?: boolean | null
          medical_professional_details?: string | null
          medical_treatment_provided?: boolean | null
          photos_taken?: boolean | null
          regulatory_agencies?: string | null
          regulatory_reporting_required?: boolean | null
          report_status?: string | null
          residents_involved?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity_level: string
          staff_involved?: Json | null
          submitted_at?: string | null
          supervisor_name?: string | null
          supervisor_notification_time?: string | null
          supervisor_notified?: boolean | null
          updated_at?: string | null
          user_id: string
          visitors_involved?: Json | null
          witnesses?: Json | null
        }
        Update: {
          additional_documentation?: string | null
          auto_save_data?: Json | null
          contributing_factors?: string | null
          created_at?: string | null
          evidence_collected?: boolean | null
          family_notification_details?: string | null
          family_notified?: boolean | null
          follow_up_actions_required?: string | null
          hospital_details?: string | null
          hospital_transport_required?: boolean | null
          id?: string
          immediate_actions_taken?: string | null
          immediate_cause?: string | null
          incident_date?: string
          incident_description?: string
          incident_prevention_measures?: string | null
          incident_time?: string
          incident_type?: string
          injuries_sustained?: string | null
          last_saved_at?: string | null
          location?: string
          medical_professional_contacted?: boolean | null
          medical_professional_details?: string | null
          medical_treatment_provided?: boolean | null
          photos_taken?: boolean | null
          regulatory_agencies?: string | null
          regulatory_reporting_required?: boolean | null
          report_status?: string | null
          residents_involved?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity_level?: string
          staff_involved?: Json | null
          submitted_at?: string | null
          supervisor_name?: string | null
          supervisor_notification_time?: string | null
          supervisor_notified?: boolean | null
          updated_at?: string | null
          user_id?: string
          visitors_involved?: Json | null
          witnesses?: Json | null
        }
        Relationships: []
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
          drivers_license_received: number | null
          drug_screens: number | null
          evaluation_details: string | null
          evaluations: string | null
          events: string | null
          facility_issues: string | null
          ged_completions: number | null
          ged_preparation_starts: number | null
          id: string
          life_skills_starts: number | null
          mat_clients: number | null
          mat_intakes: number | null
          meeting_dates: string | null
          ots_count: number | null
          ots1_orientations: number | null
          peer_mentors: number | null
          phase1_completions: number | null
          phase1_count: number | null
          phase1_next_steps: string | null
          phase2_completions: number | null
          phase2_count: number | null
          phase2_next_steps: string | null
          program_concerns: string | null
          program_name: string | null
          report_date: string | null
          reporter_name: string | null
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
          drivers_license_received?: number | null
          drug_screens?: number | null
          evaluation_details?: string | null
          evaluations?: string | null
          events?: string | null
          facility_issues?: string | null
          ged_completions?: number | null
          ged_preparation_starts?: number | null
          id?: string
          life_skills_starts?: number | null
          mat_clients?: number | null
          mat_intakes?: number | null
          meeting_dates?: string | null
          ots_count?: number | null
          ots1_orientations?: number | null
          peer_mentors?: number | null
          phase1_completions?: number | null
          phase1_count?: number | null
          phase1_next_steps?: string | null
          phase2_completions?: number | null
          phase2_count?: number | null
          phase2_next_steps?: string | null
          program_concerns?: string | null
          program_name?: string | null
          report_date?: string | null
          reporter_name?: string | null
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
          drivers_license_received?: number | null
          drug_screens?: number | null
          evaluation_details?: string | null
          evaluations?: string | null
          events?: string | null
          facility_issues?: string | null
          ged_completions?: number | null
          ged_preparation_starts?: number | null
          id?: string
          life_skills_starts?: number | null
          mat_clients?: number | null
          mat_intakes?: number | null
          meeting_dates?: string | null
          ots_count?: number | null
          ots1_orientations?: number | null
          peer_mentors?: number | null
          phase1_completions?: number | null
          phase1_count?: number | null
          phase1_next_steps?: string | null
          phase2_completions?: number | null
          phase2_count?: number | null
          phase2_next_steps?: string | null
          program_concerns?: string | null
          program_name?: string | null
          report_date?: string | null
          reporter_name?: string | null
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
      get_location_stats_with_date_filter: {
        Args: { date_filter_type?: string }
        Returns: {
          location_name: string
          total_hours: number
          total_residents: number
          entry_count: number
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
