// ============================================
// Database Types — Auto-generated from schema
// ============================================

export type Hotel = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  brand_color: string;
  background_video_url: string | null;
  welcome_audio_url: string | null;
  wifi_ssid: string | null;
  wifi_password: string | null;
  created_at: string;
}

export type Location = {
  id: string;
  hotel_id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  description: string | null;
  image_url: string | null;
  audio_guide_url: string | null;
  external_url?: string | null;
  created_at: string;
}

export type KnowledgeBaseEntry = {
  id: string;
  hotel_id: string;
  title: string | null;
  document_text: string;
  created_at: string;
}

// Supabase Database type map
export type Database = {
  public: {
    Tables: {
      hotels: {
        Row: Hotel;
        Insert: Omit<Hotel, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Hotel, 'id'>>;
        Relationships: [];
      };
      locations: {
        Row: Location;
        Insert: Omit<Location, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Location, 'id'>>;
        Relationships: [];
      };
      knowledge_base: {
        Row: KnowledgeBaseEntry;
        Insert: Omit<KnowledgeBaseEntry, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<KnowledgeBaseEntry, 'id'>>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Location types for the map
export type LocationType =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'attraction'
  | 'museum'
  | 'ruins'
  | 'tour'
  | 'transport'
  | 'market'
  | 'shopping'
  | 'spa'
  | 'wellness'
  | 'nature'
  | 'park'
  | 'viewpoint'
  | 'other';

// Stripe subscription status
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';

