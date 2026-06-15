'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'home.subtitle': 'Your stay at',
    'home.tagline': 'Everything you need for an unforgettable experience — hand-picked recommendations, live transit info, and your personal AI travel assistant.',
    'home.btn.discover': 'Discover Cusco',
    'home.btn.transit': 'Tours & Transit',
    'home.btn.guide': 'Ask Your Guide',
    'home.altitude': 'altitude',
    'home.wifi': 'Connect to WiFi',
    'nav.home': 'Home',
    'nav.discover': 'Discover',
    'nav.transit': 'Transit',
    'nav.guide': 'Guide',
    'map.back': 'Back',
    'map.places': 'places to explore',
    'map.cat.all': 'All',
    'map.cat.ruins': 'Ruins',
    'map.cat.culture': 'Culture',
    'map.cat.dining': 'Dining',
    'map.cat.cafes': 'Cafés',
    'map.cat.tours': 'Tours',
    'map.cat.transit': 'Transit',
    'map.cat.markets': 'Markets',
    'map.cat.views': 'Views',
    'map.loading': 'Map Loading...',
    'map.apikey': 'Add your Google Maps API key to NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local to enable the interactive map.',
    'transit.title': 'Tours & Transport',
    'transit.subtitle': 'Schedules, prices & booking info',
    'transit.book': 'Book online',
    'tips.title': 'Local Tips',
    'location.about': 'About',
    'location.directions': 'Get Directions',
    'ai.guide': 'Your Travel Guide',
    'ai.welcome': 'Welcome to {hotelName}! 🌿\n\nI\'m your personal travel guide — I know Cusco inside and out. Whether you need dining reservations, tour bookings, altitude advice, or hidden local gems, I\'m here to help.\n\nWhat can I assist you with?',
    'ai.prompt.restaurants': '🍽️ Best restaurants nearby?',
    'ai.prompt.altitude': '🏔️ Altitude tips for today',
    'ai.prompt.sacred_valley': '🚌 Sacred Valley tour info',
    'ai.prompt.machu_picchu': '🚂 How to get to Machu Picchu?',
    'ai.placeholder': 'Ask me anything about Cusco...',
    'wifi.title': 'WiFi Access',
    'wifi.network': 'Network:',
    'wifi.password': 'Password:',
  },
  es: {
    'home.subtitle': 'Tu estancia en',
    'home.tagline': 'Todo lo que necesitas para una experiencia inolvidable: recomendaciones seleccionadas, información de transporte y tu asistente personal de viajes con IA.',
    'home.btn.discover': 'Descubrir Cusco',
    'home.btn.transit': 'Tours y Transporte',
    'home.btn.guide': 'Pregunta a tu Guía',
    'home.altitude': 'altitud',
    'home.wifi': 'Conectarse al WiFi',
    'nav.home': 'Inicio',
    'nav.discover': 'Descubrir',
    'nav.transit': 'Transporte',
    'nav.guide': 'Guía',
    'map.back': 'Volver',
    'map.places': 'lugares para explorar',
    'map.cat.all': 'Todo',
    'map.cat.ruins': 'Ruinas',
    'map.cat.culture': 'Cultura',
    'map.cat.dining': 'Comida',
    'map.cat.cafes': 'Cafés',
    'map.cat.tours': 'Tours',
    'map.cat.transit': 'Transporte',
    'map.cat.markets': 'Mercados',
    'map.cat.views': 'Vistas',
    'map.loading': 'Cargando mapa...',
    'map.apikey': 'Añade tu clave API de Google Maps en NEXT_PUBLIC_GOOGLE_MAPS_API_KEY dentro de .env.local para ver el mapa interactivo.',
    'transit.title': 'Tours y Transporte',
    'transit.subtitle': 'Horarios, precios y reservas',
    'transit.book': 'Reservar en línea',
    'tips.title': 'Consejos Locales',
    'location.about': 'Acerca de',
    'location.directions': 'Cómo llegar',
    'ai.guide': 'Tu Guía de Viaje',
    'ai.welcome': '¡Bienvenido a {hotelName}! 🌿\n\nSoy tu guía de viaje personal — conozco Cusco a la perfección. Ya sea que necesites reservas para cenar, tours, consejos sobre la altitud o descubrir lugares ocultos, estoy aquí para ayudarte.\n\n¿En qué te puedo ayudar hoy?',
    'ai.prompt.restaurants': '🍽️ ¿Mejores restaurantes cerca?',
    'ai.prompt.altitude': '🏔️ Consejos de altitud',
    'ai.prompt.sacred_valley': '🚌 Info tour Valle Sagrado',
    'ai.prompt.machu_picchu': '🚂 ¿Cómo ir a Machu Picchu?',
    'ai.placeholder': 'Pregúntame lo que sea sobre Cusco...',
    'wifi.title': 'Acceso WiFi',
    'wifi.network': 'Red:',
    'wifi.password': 'Contraseña:',
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, replacements?: Record<string, string>) => {
    let text = translations[language][key] || key;
    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        text = text.replace(`{${k}}`, v);
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
