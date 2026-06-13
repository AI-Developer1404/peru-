import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import GuestLayout from '@/components/guest/GuestLayout';
import type { Metadata } from 'next';
import type { Hotel, Location } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ============================================
// CUSCO DEMO DATA
// ============================================
const mockHotel: Hotel = {
  id: 'demo-hotel-id',
  user_id: 'demo-user-id',
  name: 'Casa del Sol Cusco',
  slug: 'demo',
  logo_url: null,
  brand_color: '#D4956A',
  background_video_url: '/background ebook page.mp4',
  welcome_audio_url: null,
  wifi_ssid: 'CasaDelSol_Guest',
  wifi_password: 'bienvenidos2025',
  created_at: new Date().toISOString(),
};

const mockLocations: Location[] = [
  // — ATTRACTIONS & RUINS —
  {
    id: 'loc-1',
    hotel_id: 'demo-hotel-id',
    name: 'Sacsayhuamán',
    lat: -13.5092,
    lng: -71.9827,
    type: 'ruins',
    description: 'Monumental Inca fortress overlooking Cusco. The massive stone walls — some blocks weighing over 100 tons — showcase incredible engineering. Best visited in the morning for soft light and fewer crowds.',
    image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'loc-2',
    hotel_id: 'demo-hotel-id',
    name: 'Qorikancha — Temple of the Sun',
    lat: -13.5200,
    lng: -71.9733,
    type: 'ruins',
    description: 'Once the most important temple in the Inca Empire, entirely covered in gold. Today you can see the original Inca stonework beneath the colonial Santo Domingo church — a fascinating fusion of two civilizations.',
    image_url: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'loc-3',
    hotel_id: 'demo-hotel-id',
    name: 'Plaza de Armas',
    lat: -13.5160,
    lng: -71.9785,
    type: 'attraction',
    description: 'The beating heart of Cusco. Surrounded by colonial arcades, the cathedral, and the Jesuit church. Beautiful at any time, but especially magical when illuminated at night. Great starting point for exploring the city.',
    image_url: 'https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  // — MARKETS & SHOPPING —
  {
    id: 'loc-4',
    hotel_id: 'demo-hotel-id',
    name: 'San Pedro Market',
    lat: -13.5190,
    lng: -71.9822,
    type: 'market',
    description: 'The most vibrant market in Cusco. Fresh tropical fruits, local cheeses, medicinal herbs, and incredible fresh juices for just 3 soles. Try the chicharrón sandwich. A sensory experience you won\'t forget.',
    image_url: 'https://images.unsplash.com/photo-1583425423320-3a067028e927?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  // — RESTAURANTS & CAFÉS —
  {
    id: 'loc-5',
    hotel_id: 'demo-hotel-id',
    name: 'Cicciolina',
    lat: -13.5155,
    lng: -71.9773,
    type: 'restaurant',
    description: 'An elegant fine-dining restaurant on the second floor overlooking a colonial courtyard. Peruvian-Mediterranean fusion at its finest. Reservations recommended — ask your concierge to book for you.',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'loc-6',
    hotel_id: 'demo-hotel-id',
    name: 'Jack\'s Café',
    lat: -13.5147,
    lng: -71.9780,
    type: 'cafe',
    description: 'Beloved by travelers and locals alike. Excellent breakfasts, great coffee, and generous portions. The perfect way to fuel up before a day of exploring. Try the eggs Benedict or the pancake stack.',
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'loc-7',
    hotel_id: 'demo-hotel-id',
    name: 'Morena Peruvian Kitchen',
    lat: -13.5163,
    lng: -71.9799,
    type: 'restaurant',
    description: 'Modern Peruvian cuisine with creative takes on traditional dishes. The ceviche and lomo saltado are outstanding. Beautiful interior with exposed stone walls and warm lighting. Mid-range prices.',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  // — TOURS & TRANSPORT —
  {
    id: 'loc-8',
    hotel_id: 'demo-hotel-id',
    name: 'Sacred Valley Day Tour',
    lat: -13.5175,
    lng: -71.9800,
    type: 'tour',
    description: 'Full-day guided bus tour through the Sacred Valley. Visits Pisac ruins & market, Ollantaytambo fortress, and Chinchero weaving community. Includes lunch. Departs daily at 8:00 AM, returns around 6:00 PM. Book at reception.',
    image_url: 'https://images.unsplash.com/photo-1580889272746-3e40bb89e58a?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'loc-9',
    hotel_id: 'demo-hotel-id',
    name: 'PeruRail — Poroy Station',
    lat: -13.4862,
    lng: -72.0353,
    type: 'transport',
    description: 'Train departures to Machu Picchu via the Expedition and Vistadome services. Morning trains at 6:10, 7:45, and 8:25 AM. The scenic ride through the Urubamba valley is an experience in itself. Book tickets at perurail.com.',
    image_url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'loc-10',
    hotel_id: 'demo-hotel-id',
    name: 'Rainbow Mountain Departure',
    lat: -13.5160,
    lng: -71.9785,
    type: 'tour',
    description: 'Day trip to Vinicunca (Rainbow Mountain) at 5,200m altitude. Early pickup at 4:00 AM, return by 5:00 PM. Strenuous hike but unforgettable views. Only recommended after 2–3 days of acclimatization in Cusco.',
    image_url: 'https://images.unsplash.com/photo-1580968738440-8b56fa368712?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  // — NATURE & WELLNESS —
  {
    id: 'loc-11',
    hotel_id: 'demo-hotel-id',
    name: 'San Cristóbal Viewpoint',
    lat: -13.5130,
    lng: -71.9800,
    type: 'viewpoint',
    description: 'The best panoramic view over Cusco and the surrounding mountains. A short but steep walk from Plaza de Armas. Come at sunset for golden hour light across the terracotta rooftops. Bring a light jacket — it gets cool.',
    image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'loc-12',
    hotel_id: 'demo-hotel-id',
    name: 'Tambomachay',
    lat: -13.4832,
    lng: -71.9615,
    type: 'ruins',
    description: 'Known as the "Bath of the Inca", this archaeological site features beautifully carved aqueducts and cascading water channels still flowing after 600 years. A peaceful place surrounded by green hills. 15 min by taxi from the center.',
    image_url: 'https://images.unsplash.com/photo-1569161031678-f49b4b9fbe82?auto=format&fit=crop&w=800&q=80',
    audio_guide_url: null,
    created_at: new Date().toISOString(),
  },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === 'demo') {
    return {
      title: `${mockHotel.name} — Digital Concierge`,
      description: `Everything you need for an unforgettable Cusco experience — hand-picked recommendations, live transit info, and your personal AI travel assistant.`,
      openGraph: {
        title: `${mockHotel.name} — Digital Concierge`,
        description: `Your premium digital guidebook for Cusco, Peru.`,
      },
    };
  }

  const supabase = await createClient();
  const { data: hotel } = await supabase
    .from('hotels')
    .select('name, logo_url')
    .eq('slug', slug)
    .single();

  if (!hotel) return { title: 'Hotel Not Found' };

  return {
    title: `${hotel.name} — Digital Concierge`,
    description: `Welcome to ${hotel.name}. Explore curated experiences and local recommendations.`,
    openGraph: {
      title: `${hotel.name} — Digital Concierge`,
      description: `Your premium digital guidebook.`,
      images: hotel.logo_url ? [hotel.logo_url] : [],
    },
  };
}

export default async function HotelGuestPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === 'demo') {
    return (
      <GuestLayout
        hotel={mockHotel}
        locations={mockLocations}
      />
    );
  }

  const supabase = await createClient();

  const { data: hotel, error: hotelError } = await supabase
    .from('hotels')
    .select('*')
    .eq('slug', slug)
    .single();

  if (hotelError || !hotel) {
    notFound();
  }

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('hotel_id', hotel.id)
    .order('name');

  return (
    <GuestLayout
      hotel={hotel}
      locations={locations ?? []}
    />
  );
}
