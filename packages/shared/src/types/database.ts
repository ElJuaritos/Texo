/**
 * Generado desde Supabase Texo (MCP user-supabase_texo).
 * Regenerar: npx supabase gen types typescript --linked > packages/shared/src/types/database.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      inspection_items: {
        Row: {
          category: Database["public"]["Enums"]["inspection_category"];
          component: string;
          description: string;
          id: string;
          inspection_id: string;
          photo_path: string | null;
          severity: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["inspection_category"];
          component: string;
          description: string;
          id?: string;
          inspection_id: string;
          photo_path?: string | null;
          severity: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["inspection_category"];
          component?: string;
          description?: string;
          id?: string;
          inspection_id?: string;
          photo_path?: string | null;
          severity?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inspection_items_inspection_id_fkey";
            columns: ["inspection_id"];
            isOneToOne: false;
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
        ];
      };
      inspections: {
        Row: {
          certified_at: string | null;
          created_at: string;
          id: string;
          inspector_name: string;
          notes: string | null;
          passed: boolean;
          score: number;
          vehicle_id: string;
        };
        Insert: {
          certified_at?: string | null;
          created_at?: string;
          id?: string;
          inspector_name: string;
          notes?: string | null;
          passed?: boolean;
          score: number;
          vehicle_id: string;
        };
        Update: {
          certified_at?: string | null;
          created_at?: string;
          id?: string;
          inspector_name?: string;
          notes?: string | null;
          passed?: boolean;
          score?: number;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inspections_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: true;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      offers: {
        Row: {
          amount: number;
          buyer_id: string;
          created_at: string;
          expires_at: string | null;
          id: string;
          message: string | null;
          status: Database["public"]["Enums"]["offer_status"];
          updated_at: string;
          vehicle_id: string;
        };
        Insert: {
          amount: number;
          buyer_id: string;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          message?: string | null;
          status?: Database["public"]["Enums"]["offer_status"];
          updated_at?: string;
          vehicle_id: string;
        };
        Update: {
          amount?: number;
          buyer_id?: string;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          message?: string | null;
          status?: Database["public"]["Enums"]["offer_status"];
          updated_at?: string;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "offers_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offers_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [];
      };
      test_drive_appointments: {
        Row: {
          buyer_confirmed: boolean;
          buyer_id: string;
          created_at: string;
          id: string;
          location: string;
          offer_id: string;
          scheduled_at: string;
          seller_confirmed: boolean;
          status: Database["public"]["Enums"]["test_drive_status"];
          vehicle_id: string;
        };
        Insert: {
          buyer_confirmed?: boolean;
          buyer_id: string;
          created_at?: string;
          id?: string;
          location: string;
          offer_id: string;
          scheduled_at: string;
          seller_confirmed?: boolean;
          status?: Database["public"]["Enums"]["test_drive_status"];
          vehicle_id: string;
        };
        Update: {
          buyer_confirmed?: boolean;
          buyer_id?: string;
          created_at?: string;
          id?: string;
          location?: string;
          offer_id?: string;
          scheduled_at?: string;
          seller_confirmed?: boolean;
          status?: Database["public"]["Enums"]["test_drive_status"];
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_drive_appointments_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_drive_appointments_offer_id_fkey";
            columns: ["offer_id"];
            isOneToOne: false;
            referencedRelation: "offers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_drive_appointments_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          buyer_id: string;
          closed_at: string | null;
          created_at: string;
          id: string;
          offer_id: string;
          seller_id: string;
          status: Database["public"]["Enums"]["transaction_status"];
          vehicle_id: string;
        };
        Insert: {
          buyer_id: string;
          closed_at?: string | null;
          created_at?: string;
          id?: string;
          offer_id: string;
          seller_id: string;
          status?: Database["public"]["Enums"]["transaction_status"];
          vehicle_id: string;
        };
        Update: {
          buyer_id?: string;
          closed_at?: string | null;
          created_at?: string;
          id?: string;
          offer_id?: string;
          seller_id?: string;
          status?: Database["public"]["Enums"]["transaction_status"];
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_offer_id_fkey";
            columns: ["offer_id"];
            isOneToOne: false;
            referencedRelation: "offers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicle_documents: {
        Row: {
          document_type: Database["public"]["Enums"]["document_type"];
          id: string;
          storage_path: string;
          uploaded_at: string;
          vehicle_id: string;
        };
        Insert: {
          document_type: Database["public"]["Enums"]["document_type"];
          id?: string;
          storage_path: string;
          uploaded_at?: string;
          vehicle_id: string;
        };
        Update: {
          document_type?: Database["public"]["Enums"]["document_type"];
          id?: string;
          storage_path?: string;
          uploaded_at?: string;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicles: {
        Row: {
          created_at: string;
          estimated_price: number | null;
          id: string;
          listing_price: number | null;
          make: string;
          mileage: number;
          model: string;
          published_at: string | null;
          seller_id: string;
          status: Database["public"]["Enums"]["vehicle_status"];
          trim: string | null;
          updated_at: string;
          year: number;
        };
        Insert: {
          created_at?: string;
          estimated_price?: number | null;
          id?: string;
          listing_price?: number | null;
          make: string;
          mileage: number;
          model: string;
          published_at?: string | null;
          seller_id: string;
          status?: Database["public"]["Enums"]["vehicle_status"];
          trim?: string | null;
          updated_at?: string;
          year: number;
        };
        Update: {
          created_at?: string;
          estimated_price?: number | null;
          id?: string;
          listing_price?: number | null;
          make?: string;
          mileage?: number;
          model?: string;
          published_at?: string | null;
          seller_id?: string;
          status?: Database["public"]["Enums"]["vehicle_status"];
          trim?: string | null;
          updated_at?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "vehicles_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_vehicle_published: {
        Args: { p_vehicle_id: string };
        Returns: boolean;
      };
      is_vehicle_seller: { Args: { p_vehicle_id: string }; Returns: boolean };
    };
    Enums: {
      document_type: "ine" | "invoice" | "circulation_card" | "other";
      inspection_category:
        | "exterior"
        | "interior"
        | "mechanical"
        | "documentation"
        | "road_test";
      offer_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "countered"
        | "expired";
      test_drive_status: "scheduled" | "completed" | "cancelled" | "no_show";
      transaction_status: "initiated" | "confirmed" | "closing" | "closed";
      user_role: "seller" | "buyer" | "admin";
      vehicle_status:
        | "draft"
        | "pending_documents"
        | "pending_inspection"
        | "inspection_failed"
        | "published"
        | "offer_accepted"
        | "sold"
        | "withdrawn";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
