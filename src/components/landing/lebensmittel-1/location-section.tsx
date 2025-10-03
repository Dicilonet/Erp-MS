
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Cargando mapa...</p></div>,
});

export function LocationSection() {
  // Simulación de envío de formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Formulario enviado (simulación).');
  };

  return (
    <section id="location" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-500">Visítanos o Haz tu Pedido</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Te esperamos en nuestra tienda o puedes contactarnos para pedidos especiales.</p>
          <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
            <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-emerald-600 mt-1"/><span>Calle del Mercado, 5, 28012 Madrid, España</span></p>
            <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-emerald-600"/><span>+34 912 345 999</span></p>
            <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-emerald-600"/><span>pedidos@delcampo.es</span></p>
            <p className="flex items-center gap-3"><Clock className="h-5 w-5 text-emerald-600"/><span>Lunes - Sábado: 09:00 - 20:00</span></p>
          </div>
        </div>
        <div className="space-y-6">
           <div className="h-80 rounded-2xl overflow-hidden shadow-xl border">
              <MapWithNoSSR businesses={[]} zoneGeoJson={null} selectedBusinessId={null} mapView={{ center: [40.413, -3.705], zoom: 16 }} />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Tu nombre" />
                  </div>
                  <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
              </div>
              <div>
                  <Label htmlFor="message">Tu Mensaje</Label>
                  <Textarea id="message" placeholder="¿Necesitas un pedido especial o tienes alguna consulta?" />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Enviar Consulta</Button>
            </form>
        </div>
      </div>
    </section>
  );
}
