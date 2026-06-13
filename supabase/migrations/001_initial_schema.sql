-- ============================================
-- Cinematic Concierge — Initial Database Schema
-- Supabase PostgreSQL Migration
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. HOTELS TABLE
-- ============================================
CREATE TABLE public.hotels (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  logo_url      TEXT,
  brand_color   TEXT DEFAULT '#c9a96e',    -- hex color
  background_video_url TEXT,
  welcome_audio_url    TEXT,
  wifi_ssid     TEXT,
  wifi_password TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug-based lookups (guest-facing routes)
CREATE INDEX idx_hotels_slug ON public.hotels(slug);
-- Index for user dashboard queries
CREATE INDEX idx_hotels_user_id ON public.hotels(user_id);

-- ============================================
-- 2. LOCATIONS TABLE
-- ============================================
CREATE TABLE public.locations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id        UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  type            VARCHAR(50) NOT NULL DEFAULT 'attraction',
  description     TEXT,
  audio_guide_url TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Index for fetching locations by hotel
CREATE INDEX idx_locations_hotel_id ON public.locations(hotel_id);

-- ============================================
-- 3. KNOWLEDGE BASE TABLE (for RAG AI chatbot)
-- ============================================
CREATE TABLE public.knowledge_base (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id        UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  title           TEXT,
  document_text   TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Index for fetching knowledge by hotel
CREATE INDEX idx_knowledge_base_hotel_id ON public.knowledge_base(hotel_id);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- --- Hotels RLS ---
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

-- Guests can read any hotel by slug (public read)
CREATE POLICY "hotels_public_read"
  ON public.hotels
  FOR SELECT
  USING (true);

-- Authenticated hosts can insert their own hotels
CREATE POLICY "hotels_owner_insert"
  ON public.hotels
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated hosts can update only their own hotels
CREATE POLICY "hotels_owner_update"
  ON public.hotels
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated hosts can delete only their own hotels
CREATE POLICY "hotels_owner_delete"
  ON public.hotels
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- --- Locations RLS ---
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Public read: guests can view locations for any hotel
CREATE POLICY "locations_public_read"
  ON public.locations
  FOR SELECT
  USING (true);

-- Hosts can insert locations for their own hotels
CREATE POLICY "locations_owner_insert"
  ON public.locations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hotels
      WHERE hotels.id = hotel_id
        AND hotels.user_id = auth.uid()
    )
  );

-- Hosts can update locations for their own hotels
CREATE POLICY "locations_owner_update"
  ON public.locations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.hotels
      WHERE hotels.id = hotel_id
        AND hotels.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hotels
      WHERE hotels.id = hotel_id
        AND hotels.user_id = auth.uid()
    )
  );

-- Hosts can delete locations for their own hotels
CREATE POLICY "locations_owner_delete"
  ON public.locations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.hotels
      WHERE hotels.id = hotel_id
        AND hotels.user_id = auth.uid()
    )
  );

-- --- Knowledge Base RLS ---
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public read: the AI chatbot needs to read knowledge base entries
CREATE POLICY "knowledge_base_public_read"
  ON public.knowledge_base
  FOR SELECT
  USING (true);

-- Hosts can insert knowledge entries for their own hotels
CREATE POLICY "knowledge_base_owner_insert"
  ON public.knowledge_base
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hotels
      WHERE hotels.id = hotel_id
        AND hotels.user_id = auth.uid()
    )
  );

-- Hosts can update knowledge entries for their own hotels
CREATE POLICY "knowledge_base_owner_update"
  ON public.knowledge_base
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.hotels
      WHERE hotels.id = hotel_id
        AND hotels.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hotels
      WHERE hotels.id = hotel_id
        AND hotels.user_id = auth.uid()
    )
  );

-- Hosts can delete knowledge entries for their own hotels
CREATE POLICY "knowledge_base_owner_delete"
  ON public.knowledge_base
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.hotels
      WHERE hotels.id = hotel_id
        AND hotels.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. SUPABASE STORAGE BUCKETS
-- ============================================
-- Note: Run these via Supabase dashboard or SQL editor
-- (Storage bucket creation is not standard SQL, but Supabase supports it)

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('hotel-assets', 'hotel-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: allow authenticated users to upload to their own folder
CREATE POLICY "hotel_assets_upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hotel-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update their own files
CREATE POLICY "hotel_assets_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hotel-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "hotel_assets_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hotel-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read access for all hotel assets (logos, videos, audio)
CREATE POLICY "hotel_assets_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hotel-assets');
