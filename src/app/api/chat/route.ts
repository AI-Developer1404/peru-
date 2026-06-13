import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

// ============================================
// Cusco Knowledge Base — used for demo mode
// ============================================
const CUSCO_KNOWLEDGE = `
## Casa del Sol Cusco — Guest Information

### Altitude & Health
Cusco sits at 3,400m (11,150ft) above sea level. Most travelers experience mild altitude sickness during the first 24–48 hours.
- Take it slow your first day — avoid strenuous activity
- Drink plenty of coca tea (mate de coca), available at reception
- Stay very well hydrated (3+ liters of water per day)
- Common symptoms: headache, shortness of breath, slight nausea — all normal
- If symptoms persist beyond 48 hours, contact the front desk for medical assistance
- Wait at least 2–3 full days before attempting Rainbow Mountain or other high-altitude excursions

### Transport
- Airport (Alejandro Velasco Astete) to hotel: 20 minutes by taxi, approximately 15–20 soles (€4–5)
- Sacred Valley bus tour: departs daily at 8:00 AM from Plaza de Armas, returns around 6:00 PM. Includes Pisac ruins & market, Ollantaytambo fortress, and Chinchero weaving community. Book at reception.
- PeruRail to Machu Picchu: trains depart from Poroy station (20 min from Cusco). Departure times: 6:10, 7:45, and 8:25 AM. Book at perurail.com at least 1 week in advance during peak season.
- Rainbow Mountain (Vinicunca): day trip with early 4:00 AM pickup, returns by 5:00 PM. Strenuous — altitude reaches 5,200m. Only recommended after 2–3 days of acclimatization.
- Uber works in Cusco. Taxis within the center: 5–10 soles per ride. Always agree on the price before getting in.

### Dining Recommendations
- Cicciolina: fine dining, Peruvian-Mediterranean fusion, second floor with colonial courtyard views. Reservations recommended.
- Jack's Café: best breakfast in Cusco, generous portions, great coffee. Try the eggs Benedict.
- Morena Peruvian Kitchen: modern Peruvian cuisine, excellent ceviche and lomo saltado. Beautiful stone interior.
- San Pedro Market: incredible fresh juices (3 soles), chicharrón sandwiches, tropical fruits. A must-visit.
- For vegetarian options: try Green Point or The Meeting Place.

### Money & Practical Tips
- Currency: Peruvian Sol (PEN). 1 EUR ≈ 4 soles.
- Best exchange rate: banks on Plaza de Armas or ATMs (BCP, Interbank).
- Tipping: 10% at restaurants is standard. Round up for taxis.
- Water: drink ONLY bottled water. Tap water is not safe.
- Best photo spot: San Cristóbal viewpoint at sunset — golden hour over terracotta rooftops.

### WiFi
Network: CasaDelSol_Guest
Password: bienvenidos2025

### Safety
- Cusco is generally safe for tourists, but be aware of pickpockets in crowded areas (San Pedro Market, Plaza de Armas).
- Don't carry large amounts of cash or flashy electronics.
- Use official taxis or Uber, especially at night.
- The hotel has a 24/7 security desk and in-room safe.

### Check-out
Check-out time is 11:00 AM. Late check-out available upon request (subject to availability).
Luggage storage is available free of charge if you have a later flight.
`;

// ============================================
// Mock responses for offline testing
// ============================================
const MOCK_RESPONSES: Record<string, string> = {
  default: `Welcome to Casa del Sol! I'm your personal travel guide for Cusco. I can help you with restaurant recommendations, tour bookings, transport information, altitude tips, and anything else you need for an unforgettable stay. What would you like to know?`,
  restaurant: `I'd highly recommend **Cicciolina** for a special dinner — it's elegant Peruvian-Mediterranean fusion with a beautiful colonial courtyard. For a more casual experience, **Jack's Café** has the best breakfast in Cusco. And you absolutely must visit **San Pedro Market** for fresh juices and local street food. Would you like me to provide more details on any of these?`,
  tour: `The **Sacred Valley Day Tour** is the most popular excursion — it departs daily at 8:00 AM and includes Pisac, Ollantaytambo, and Chinchero. For Machu Picchu, the **PeruRail** from Poroy station has morning departures at 6:10, 7:45, and 8:25 AM. **Rainbow Mountain** is breathtaking but very strenuous at 5,200m — I'd recommend waiting at least 2–3 days to acclimatize first. Shall I help you book any of these?`,
  altitude: `Great question! Cusco is at 3,400m altitude, so it's very important to take it easy on your first day. Drink lots of **coca tea** (available at reception), stay well hydrated with at least 3 liters of water per day, and avoid alcohol for the first 24 hours. Most people feel normal after 48 hours. If symptoms persist, our front desk can arrange medical assistance.`,
  wifi: `Our WiFi network is **CasaDelSol_Guest** and the password is **bienvenidos2025**. You can also find this information in the WiFi section of the app. Enjoy!`,
  machu: `For Machu Picchu, I recommend taking the **PeruRail** from Poroy station. There are departures at 6:10, 7:45, and 8:25 AM. The scenic ride through the Urubamba valley is an experience in itself! Book your tickets at perurail.com at least a week in advance during peak season (June–August). Would you like tips on what to bring?`,
};

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('restaurant') || lower.includes('eat') || lower.includes('food') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast')) {
    return MOCK_RESPONSES.restaurant;
  }
  if (lower.includes('tour') || lower.includes('valley') || lower.includes('rainbow') || lower.includes('excursion')) {
    return MOCK_RESPONSES.tour;
  }
  if (lower.includes('altitude') || lower.includes('height') || lower.includes('sick') || lower.includes('coca') || lower.includes('acclimat')) {
    return MOCK_RESPONSES.altitude;
  }
  if (lower.includes('wifi') || lower.includes('internet') || lower.includes('password')) {
    return MOCK_RESPONSES.wifi;
  }
  if (lower.includes('machu') || lower.includes('picchu') || lower.includes('train') || lower.includes('perurail')) {
    return MOCK_RESPONSES.machu;
  }
  return MOCK_RESPONSES.default;
}

export async function POST(req: Request) {
  const { messages, hotelId } = await req.json();

  // ============================================
  // MOCK MODE — no API key needed
  // ============================================
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const response = getMockResponse(lastUserMessage?.content || '');

    // Simulate streaming by returning a proper text stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Format as Vercel AI SDK data stream
        const lines = [
          `0:"${response.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`,
          `e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`,
          `d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`,
        ];
        for (const line of lines) {
          controller.enqueue(encoder.encode(line));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
      },
    });
  }

  // ============================================
  // LIVE MODE — Gemini API
  // ============================================
  let knowledgeContext = CUSCO_KNOWLEDGE;
  let wifiInfo = 'WiFi Network: CasaDelSol_Guest, Password: bienvenidos2025';
  let hotelName = 'Casa del Sol Cusco';

  // If not demo, fetch from Supabase
  if (hotelId !== 'demo-hotel-id') {
    try {
      const supabase = await createClient();

      const { data: hotel } = await supabase
        .from('hotels')
        .select('name, wifi_ssid, wifi_password')
        .eq('id', hotelId)
        .single();

      const { data: docs } = await supabase
        .from('knowledge_base')
        .select('title, document_text')
        .eq('hotel_id', hotelId);

      if (hotel) hotelName = hotel.name;
      if (docs && docs.length > 0) {
        knowledgeContext = docs.map((d: any) => `### ${d.title ?? 'Info'}\n${d.document_text}`).join('\n\n');
      }
      if (hotel?.wifi_ssid) {
        wifiInfo = `WiFi Network: ${hotel.wifi_ssid}, Password: ${hotel.wifi_password}`;
      }
    } catch {
      // Fall through to default Cusco knowledge
    }
  }

  const systemPrompt = `You are the AI travel guide for "${hotelName}" in Cusco, Peru. You are warm, knowledgeable, and genuinely helpful — like a trusted local friend who happens to know everything about the city.

Your knowledge base:
${knowledgeContext}

${wifiInfo ? `Hotel WiFi: ${wifiInfo}` : ''}

Guidelines:
- Be warm and conversational, but concise. No fluff.
- Give specific, actionable recommendations with concrete details (prices, times, distances).
- Use markdown formatting (bold for emphasis, bullet points for lists) to make responses scannable.
- If recommending places, mention approximate walking distance or taxi time from the hotel.
- If you don't know something, say so honestly and suggest the guest ask at reception.
- Always prioritize guest safety — especially regarding altitude, water safety, and transport.
- Respond in the same language the guest uses (English, Spanish, Dutch, etc.).`;

  const result = await streamText({
    model: google('gemini-2.0-flash') as any,
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
