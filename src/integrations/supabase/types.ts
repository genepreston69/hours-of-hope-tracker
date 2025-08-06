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
          organization_id: string | null
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
          organization_id?: string | null
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
          organization_id?: string | null
          state?: string | null
          street?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facilities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_locations: {
        Row: {
          facility_id: string
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          facility_id: string
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          facility_id?: string
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_locations_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      grievances: {
        Row: {
          additional_info: string | null
          advocate_help: boolean
          anonymous_request: boolean
          assigned_to: string | null
          categories: string[]
          created_at: string
          date_of_incident: string
          description: string
          desired_resolution: string
          facility_id: string
          id: string
          organization_id: string | null
          preferred_contact: string
          previous_action: string | null
          resident_name: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          updated_at: string
          urgency: string
          user_id: string
          witnesses: string | null
        }
        Insert: {
          additional_info?: string | null
          advocate_help?: boolean
          anonymous_request?: boolean
          assigned_to?: string | null
          categories?: string[]
          created_at?: string
          date_of_incident: string
          description: string
          desired_resolution: string
          facility_id: string
          id?: string
          organization_id?: string | null
          preferred_contact: string
          previous_action?: string | null
          resident_name: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
          urgency: string
          user_id: string
          witnesses?: string | null
        }
        Update: {
          additional_info?: string | null
          advocate_help?: boolean
          anonymous_request?: boolean
          assigned_to?: string | null
          categories?: string[]
          created_at?: string
          date_of_incident?: string
          description?: string
          desired_resolution?: string
          facility_id?: string
          id?: string
          organization_id?: string | null
          preferred_contact?: string
          previous_action?: string | null
          resident_name?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
          urgency?: string
          user_id?: string
          witnesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_grievances_facility"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          actions_taken_outcome: string | null
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
          organization_id: string | null
          photos_taken: boolean | null
          regulatory_agencies: string | null
          regulatory_reporting_required: boolean | null
          report_status: string | null
          residents_involved: Json | null
          resolved: boolean | null
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
          actions_taken_outcome?: string | null
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
          organization_id?: string | null
          photos_taken?: boolean | null
          regulatory_agencies?: string | null
          regulatory_reporting_required?: boolean | null
          report_status?: string | null
          residents_involved?: Json | null
          resolved?: boolean | null
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
          actions_taken_outcome?: string | null
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
          organization_id?: string | null
          photos_taken?: boolean | null
          regulatory_agencies?: string | null
          regulatory_reporting_required?: boolean | null
          report_status?: string | null
          residents_involved?: Json | null
          resolved?: boolean | null
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
        Relationships: [
          {
            foreignKeyName: "incident_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      innovations: {
        Row: {
          additional_ideas: string | null
          assigned_to: string | null
          budget: string | null
          categories: string[]
          created_at: string
          help_implement: boolean
          id: string
          idea_description: string
          idea_title: string
          impact: string | null
          implementation: string | null
          implementation_date: string | null
          innovator_name: string | null
          inspiration: string | null
          organization_id: string | null
          problem_solved: string | null
          review_notes: string | null
          status: string
          time_at_facility: string | null
          updated_at: string
          user_id: string
          want_recognition: boolean
        }
        Insert: {
          additional_ideas?: string | null
          assigned_to?: string | null
          budget?: string | null
          categories?: string[]
          created_at?: string
          help_implement?: boolean
          id?: string
          idea_description: string
          idea_title: string
          impact?: string | null
          implementation?: string | null
          implementation_date?: string | null
          innovator_name?: string | null
          inspiration?: string | null
          organization_id?: string | null
          problem_solved?: string | null
          review_notes?: string | null
          status?: string
          time_at_facility?: string | null
          updated_at?: string
          user_id: string
          want_recognition?: boolean
        }
        Update: {
          additional_ideas?: string | null
          assigned_to?: string | null
          budget?: string | null
          categories?: string[]
          created_at?: string
          help_implement?: boolean
          id?: string
          idea_description?: string
          idea_title?: string
          impact?: string | null
          implementation?: string | null
          implementation_date?: string | null
          innovator_name?: string | null
          inspiration?: string | null
          organization_id?: string | null
          problem_solved?: string | null
          review_notes?: string | null
          status?: string
          time_at_facility?: string | null
          updated_at?: string
          user_id?: string
          want_recognition?: boolean
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          notification_type: string
          recipient_email: string
          recipient_phone: string | null
          report_id: string
          report_type: string
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          notification_type: string
          recipient_email: string
          recipient_phone?: string | null
          report_id: string
          report_type: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          notification_type?: string
          recipient_email?: string
          recipient_phone?: string | null
          report_id?: string
          report_type?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: []
      }
      notification_recipients: {
        Row: {
          created_at: string
          critical_only: boolean
          director_reports_enabled: boolean
          email: string
          email_enabled: boolean
          id: string
          incident_reports_enabled: boolean
          name: string
          organization_id: string | null
          phone: string | null
          role: string
          sms_enabled: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          critical_only?: boolean
          director_reports_enabled?: boolean
          email: string
          email_enabled?: boolean
          id?: string
          incident_reports_enabled?: boolean
          name: string
          organization_id?: string | null
          phone?: string | null
          role?: string
          sms_enabled?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          critical_only?: boolean
          director_reports_enabled?: boolean
          email?: string
          email_enabled?: boolean
          id?: string
          incident_reports_enabled?: boolean
          name?: string
          organization_id?: string | null
          phone?: string | null
          role?: string
          sms_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_recipients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          organization_id: string | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          organization_id?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
          organization_id: string | null
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
          organization_id?: string | null
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
          organization_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "recovery_surveys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      resident_emails: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message: string
          organization_id: string | null
          recipient_email: string
          recipient_name: string
          relationship: string
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message: string
          organization_id?: string | null
          recipient_email: string
          recipient_name: string
          relationship: string
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string
          organization_id?: string | null
          recipient_email?: string
          recipient_name?: string
          relationship?: string
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      routes_data: {
        Row: {
          account_code: string | null
          created_at: string | null
          dropoff_address: string | null
          dropoff_city: string | null
          dropoff_name: string | null
          dropoff_zip: string | null
          first_name: string | null
          id: number
          last_name: string | null
          miles: number | null
          pickup_address: string | null
          pickup_city: string | null
          pickup_name: string | null
          pickup_zip: string | null
          ride_date: string
          ride_time: number | null
          sheet_year: string | null
          total: number | null
          trip_number: number | null
        }
        Insert: {
          account_code?: string | null
          created_at?: string | null
          dropoff_address?: string | null
          dropoff_city?: string | null
          dropoff_name?: string | null
          dropoff_zip?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          miles?: number | null
          pickup_address?: string | null
          pickup_city?: string | null
          pickup_name?: string | null
          pickup_zip?: string | null
          ride_date: string
          ride_time?: number | null
          sheet_year?: string | null
          total?: number | null
          trip_number?: number | null
        }
        Update: {
          account_code?: string | null
          created_at?: string | null
          dropoff_address?: string | null
          dropoff_city?: string | null
          dropoff_name?: string | null
          dropoff_zip?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          miles?: number | null
          pickup_address?: string | null
          pickup_city?: string | null
          pickup_name?: string | null
          pickup_zip?: string | null
          ride_date?: string
          ride_time?: number | null
          sheet_year?: string | null
          total?: number | null
          trip_number?: number | null
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
          organization_id: string | null
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
          organization_id?: string | null
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
          organization_id?: string | null
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
          {
            foreignKeyName: "service_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      location_hours_summary: {
        Row: {
          facility_location_id: string | null
          ly_mtd_hours: number | null
          ly_ytd_hours: number | null
          mtd_hours: number | null
          ytd_hours: number | null
        }
        Relationships: [
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
    Functions: {
      get_current_user_organization: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_location_stats_with_date_filter: {
        Args: { date_filter_type?: string }
        Returns: {
          location_name: string
          total_hours: number
          total_residents: number
          entry_count: number
          last_year_hours: number
        }[]
      }
      has_role: {
        Args:
          | {
              _user_id: string
              _organization_id: string
              _role: Database["public"]["Enums"]["app_role"]
            }
          | { required_role: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "user"
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
      app_role: ["admin", "manager", "user"],
    },
  },
} as const
