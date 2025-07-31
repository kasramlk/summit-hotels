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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      billing_info: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          card_brand: string | null
          card_expiry: string
          card_holder_name: string
          card_last_four: string
          card_number_encrypted: string
          created_at: string | null
          hotel_id: string | null
          id: string
          is_default: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          card_brand?: string | null
          card_expiry: string
          card_holder_name: string
          card_last_four: string
          card_number_encrypted: string
          created_at?: string | null
          hotel_id?: string | null
          id?: string
          is_default?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          card_brand?: string | null
          card_expiry?: string
          card_holder_name?: string
          card_last_four?: string
          card_number_encrypted?: string
          created_at?: string | null
          hotel_id?: string | null
          id?: string
          is_default?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_info_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          adults: number | null
          booking_date: string | null
          booking_source: string | null
          check_in_date: string
          check_out_date: string
          children: number | null
          created_at: string | null
          guest_id: string | null
          hotel_id: string | null
          id: string
          payment_status: string | null
          room_id: string | null
          special_requests: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          adults?: number | null
          booking_date?: string | null
          booking_source?: string | null
          check_in_date: string
          check_out_date: string
          children?: number | null
          created_at?: string | null
          guest_id?: string | null
          hotel_id?: string | null
          id?: string
          payment_status?: string | null
          room_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          adults?: number | null
          booking_date?: string | null
          booking_source?: string | null
          check_in_date?: string
          check_out_date?: string
          children?: number | null
          created_at?: string | null
          guest_id?: string | null
          hotel_id?: string | null
          id?: string
          payment_status?: string | null
          room_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      fb_revenue: {
        Row: {
          bar_revenue: number | null
          created_at: string | null
          event_catering_revenue: number | null
          hotel_id: string | null
          id: string
          restaurant_revenue: number | null
          revenue_date: string
          room_service_revenue: number | null
          total_covers: number | null
        }
        Insert: {
          bar_revenue?: number | null
          created_at?: string | null
          event_catering_revenue?: number | null
          hotel_id?: string | null
          id?: string
          restaurant_revenue?: number | null
          revenue_date: string
          room_service_revenue?: number | null
          total_covers?: number | null
        }
        Update: {
          bar_revenue?: number | null
          created_at?: string | null
          event_catering_revenue?: number | null
          hotel_id?: string | null
          id?: string
          restaurant_revenue?: number | null
          revenue_date?: string
          room_service_revenue?: number | null
          total_covers?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fb_revenue_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_surveys: {
        Row: {
          booking_id: string | null
          cleanliness_rating: number | null
          comments: string | null
          created_at: string | null
          guest_id: string | null
          hotel_id: string | null
          id: string
          overall_rating: number | null
          room_rating: number | null
          service_rating: number | null
          survey_date: string | null
          value_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          booking_id?: string | null
          cleanliness_rating?: number | null
          comments?: string | null
          created_at?: string | null
          guest_id?: string | null
          hotel_id?: string | null
          id?: string
          overall_rating?: number | null
          room_rating?: number | null
          service_rating?: number | null
          survey_date?: string | null
          value_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          booking_id?: string | null
          cleanliness_rating?: number | null
          comments?: string | null
          created_at?: string | null
          guest_id?: string | null
          hotel_id?: string | null
          id?: string
          overall_rating?: number | null
          room_rating?: number | null
          service_rating?: number | null
          survey_date?: string | null
          value_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_surveys_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_surveys_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_surveys_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string
          guest_type: string | null
          id: string
          last_name: string
          nationality: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name: string
          guest_type?: string | null
          id?: string
          last_name: string
          nationality?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string
          guest_type?: string | null
          id?: string
          last_name?: string
          nationality?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hotel_comparisons: {
        Row: {
          adr_after: number
          adr_before: number
          created_at: string | null
          hotel_id: string
          id: string
          implementation_month: string
          occupancy_after: number
          occupancy_before: number
          revenue_after: number
          revenue_before: number
          review_score_after: number
          review_score_before: number
        }
        Insert: {
          adr_after: number
          adr_before: number
          created_at?: string | null
          hotel_id: string
          id?: string
          implementation_month: string
          occupancy_after: number
          occupancy_before: number
          revenue_after: number
          revenue_before: number
          review_score_after: number
          review_score_before: number
        }
        Update: {
          adr_after?: number
          adr_before?: number
          created_at?: string | null
          hotel_id?: string
          id?: string
          implementation_month?: string
          occupancy_after?: number
          occupancy_before?: number
          revenue_after?: number
          revenue_before?: number
          review_score_after?: number
          review_score_before?: number
        }
        Relationships: [
          {
            foreignKeyName: "hotel_comparisons_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_metrics: {
        Row: {
          created_at: string | null
          expenses: number
          hotel_id: string
          id: string
          month: string
          occupancy: number
          profit: number
          revenue: number
        }
        Insert: {
          created_at?: string | null
          expenses: number
          hotel_id: string
          id?: string
          month: string
          occupancy: number
          profit: number
          revenue: number
        }
        Update: {
          created_at?: string | null
          expenses?: number
          hotel_id?: string
          id?: string
          month?: string
          occupancy?: number
          profit?: number
          revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "hotel_metrics_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          location: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          name?: string
        }
        Relationships: []
      }
      operational_metrics: {
        Row: {
          created_at: string | null
          energy_consumption: number | null
          guest_complaints: number | null
          guest_compliments: number | null
          hotel_id: string | null
          id: string
          maintenance_completed: number | null
          maintenance_requests: number | null
          metric_date: string
          rooms_cleaned: number | null
          staff_hours_worked: number | null
          water_consumption: number | null
        }
        Insert: {
          created_at?: string | null
          energy_consumption?: number | null
          guest_complaints?: number | null
          guest_compliments?: number | null
          hotel_id?: string | null
          id?: string
          maintenance_completed?: number | null
          maintenance_requests?: number | null
          metric_date: string
          rooms_cleaned?: number | null
          staff_hours_worked?: number | null
          water_consumption?: number | null
        }
        Update: {
          created_at?: string | null
          energy_consumption?: number | null
          guest_complaints?: number | null
          guest_compliments?: number | null
          hotel_id?: string | null
          id?: string
          maintenance_completed?: number | null
          maintenance_requests?: number | null
          metric_date?: string
          rooms_cleaned?: number | null
          staff_hours_worked?: number | null
          water_consumption?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_metrics_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          amenities: string[] | null
          base_rate: number
          created_at: string | null
          description: string | null
          hotel_id: string | null
          id: string
          max_occupancy: number
          name: string
        }
        Insert: {
          amenities?: string[] | null
          base_rate: number
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          max_occupancy: number
          name: string
        }
        Update: {
          amenities?: string[] | null
          base_rate?: number
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          max_occupancy?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_types_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string | null
          floor_number: number | null
          hotel_id: string | null
          id: string
          last_maintenance: string | null
          room_number: string
          room_type_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          floor_number?: number | null
          hotel_id?: string | null
          id?: string
          last_maintenance?: string | null
          room_number: string
          room_type_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          floor_number?: number | null
          hotel_id?: string | null
          id?: string
          last_maintenance?: string | null
          room_number?: string
          room_type_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_channels: {
        Row: {
          channel_name: string
          created_at: string | null
          hotel_id: string
          id: string
          percentage: number
        }
        Insert: {
          channel_name: string
          created_at?: string | null
          hotel_id: string
          id?: string
          percentage: number
        }
        Update: {
          channel_name?: string
          created_at?: string | null
          hotel_id?: string
          id?: string
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_channels_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string | null
          department: string
          email: string
          first_name: string
          hire_date: string
          hotel_id: string | null
          id: string
          last_name: string
          phone: string | null
          position: string
          salary: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          first_name: string
          hire_date: string
          hotel_id?: string | null
          id?: string
          last_name: string
          phone?: string | null
          position: string
          salary?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          first_name?: string
          hire_date?: string
          hotel_id?: string | null
          id?: string
          last_name?: string
          phone?: string | null
          position?: string
          salary?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          description: string | null
          hotel_id: string | null
          id: string
          payment_method: string | null
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          payment_method?: string | null
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          payment_method?: string | null
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hotels: {
        Row: {
          created_at: string | null
          hotel_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hotel_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          hotel_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_hotels_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
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
