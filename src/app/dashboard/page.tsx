import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata = {
  title: 'Dashboard — Cinematic Concierge',
  description: 'Manage your hotel digital concierge.',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch user's hotel
  const { data: hotel } = await supabase
    .from('hotels')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch locations if hotel exists
  const { data: locations } = hotel
    ? await supabase.from('locations').select('*').eq('hotel_id', hotel.id).order('name')
    : { data: [] };

  // Fetch knowledge base if hotel exists
  const { data: knowledgeBase } = hotel
    ? await supabase.from('knowledge_base').select('*').eq('hotel_id', hotel.id).order('created_at', { ascending: false })
    : { data: [] };

  return (
    <DashboardShell
      user={user}
      hotel={hotel}
      locations={locations ?? []}
      knowledgeBase={knowledgeBase ?? []}
    />
  );
}
