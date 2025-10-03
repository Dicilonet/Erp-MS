
'use client';

import { HeroSection } from '@/components/landing/hotellerie-1/hero-section';
import { RoomShowcase } from '@/components/landing/hotellerie-1/room-showcase';
import { ServicesGrid } from '@/components/landing/hotellerie-1/services-grid';
import { Testimonials } from '@/components/landing/hotellerie-1/testimonials';
import { BookingTabs } from '@/components/landing/hotellerie-1/booking-tabs';
import { LocationMap } from '@/components/landing/hotellerie-1/location-map';
import { Footer } from '@/components/landing/hotellerie-1/footer';

export default function LandingHotellerie() {
  // Datos de ejemplo para los servicios. En una implementación real, esto vendría de un CMS o base de datos.
  const allServices = {
    wifi: { name: 'Wi-Fi de Alta Velocidad', enabled: true },
    pool: { name: 'Piscina Climatizada', enabled: true },
    spa: { name: 'Spa y Bienestar', enabled: true },
    gym: { name: 'Gimnasio 24h', enabled: true },
    parking: { name: 'Parking Privado', enabled: true },
    restaurant: { name: 'Restaurante Gourmet', enabled: true },
    roomService: { name: 'Servicio de Habitaciones', enabled: false },
    laundry: { name: 'Servicio de Lavandería', enabled: true },
  };

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200">
      <HeroSection />
      <main>
        <RoomShowcase />
        <ServicesGrid services={allServices} />
        <BookingTabs />
        <Testimonials />
        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}
