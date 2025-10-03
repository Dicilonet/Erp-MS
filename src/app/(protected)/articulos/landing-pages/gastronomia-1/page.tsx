
'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import { FullScreenLoader } from '@/components/ui/fullscreen-loader';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><FullScreenLoader /></div>,
});


export default function LandingGastronomia() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const errs: { [k: string]: string } = {};
    if (!name) errs.name = 'Ingresa tu nombre';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido';
    if (!message) errs.message = 'El mensaje no puede estar vacío';
    return errs;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
      form.reset();
    } finally {
      setSending(false);
    }
  }
  
    const topDishes = [
    { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop', alt: 'Ensalada Fresca de Salmón' },
    { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1681&auto=format&fit=crop', alt: 'Pizza Artesanal con Rúcula' },
    { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1680&auto=format&fit=crop', alt: 'Pancakes con Frutos Rojos' },
    { src: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1547&auto=format&fit=crop', alt: 'Tostada de Aguacate y Huevo' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-stone-900/70 border-b border-stone-200/60 dark:border-stone-700/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <UtensilsCrossed className="h-7 w-7 text-amber-600" />
            <span className="font-semibold tracking-tight text-lg">El Buen Sabor</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#historia" className="hover:text-amber-600">Nuestra Historia</a>
            <a href="#platos" className="hover:text-amber-600">Platos Estrella</a>
            <a href="#mapa" className="hover:text-amber-600">Ubicación</a>
          </nav>
          <a href="#contacto" className="inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-white font-medium shadow hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500">Reservar</a>
        </div>
      </header>

      <section className="relative h-[60vh] min-h-[400px] flex items-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1674&auto=format&fit=crop" alt="Interior de restaurante elegante" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="relative z-20 mx-auto max-w-3xl text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            Sabor y Tradición en Cada Plato
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-200 max-w-xl mx-auto drop-shadow-md">
            Descubre una experiencia culinaria única, donde los ingredientes frescos y las recetas familiares se unen para crear momentos inolvidables.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="#platos" className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-stone-900 font-semibold shadow hover:bg-stone-200">Ver Platos</a>
            <a href="/menu-placeholder.pdf" download className="inline-flex items-center rounded-xl border border-white/50 bg-black/20 px-5 py-3 text-white font-medium backdrop-blur-sm hover:bg-white/10">Descargar Menú</a>
          </div>
        </div>
      </section>

      <section id="historia" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
                <h2 className="text-3xl font-bold tracking-tight text-amber-700">Desde 1985, cocinando con pasión</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-300">
                    Nuestra historia comienza con la abuela Elena y su pequeño recetario. Lo que empezó como una modesta casa de comidas familiar se ha transformado, tres generaciones después, en un referente de la cocina tradicional con un toque moderno.
                </p>
                <p className="mt-3 text-slate-600 dark:text-slate-300">
                    Mantenemos viva la llama de su legado, seleccionando cada día los mejores ingredientes del mercado local y preparando cada plato con el mismo amor y dedicación que ella nos enseñó.
                </p>
            </div>
            <div className="order-1 lg:order-2">
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1587&auto=format&fit=crop" alt="Chef cocinando con pasión" className="rounded-2xl shadow-xl aspect-square object-cover"/>
            </div>
        </div>
      </section>
      
      <section id="platos" className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-amber-700">Nuestros Platos Estrella</h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Los favoritos de nuestros comensales, una selección que no te puedes perder.</p>
            </div>
             <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topDishes.map((dish, i) => (
                    <figure key={i} className="group relative overflow-hidden rounded-2xl shadow-lg">
                        <img src={dish.src} alt={dish.alt} className="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                            <p className="font-semibold">{dish.alt}</p>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
      </section>

      <section id="contacto" className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-amber-700">Haz tu Reserva o Sugerencia</h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Nos encantaría escucharte. Rellena el formulario y te contactaremos a la brevedad.</p>
            </div>
            <form onSubmit={onSubmit} className="mt-10 max-w-xl mx-auto space-y-4" noValidate>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
                    <Input id="name" name="name" type="text" placeholder="Tu nombre" className="mt-1"/>
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <Input id="email" name="email" type="email" placeholder="tu@email.com" className="mt-1"/>
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium">Mensaje</label>
                    <Textarea id="message" name="message" rows={4} placeholder="Tu reserva, consulta o recomendación..." className="mt-1" />
                    {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>
                <Button type="submit" disabled={sending} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    {sending ? "Enviando…" : "Enviar Mensaje"}
                </Button>
                {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Hemos recibido tu mensaje.</p>}
            </form>
        </div>
      </section>

       <section id="mapa" className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-900">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
                 <h2 className="text-3xl font-bold tracking-tight text-amber-700">Visítanos</h2>
                 <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Encuéntranos en el corazón de la ciudad.</p>
                 <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
                    <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-amber-600"/>Calle Falsa 123, 08080, Barcelona</p>
                    <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-amber-600"/>+34 930 123 456</p>
                    <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-600"/>reservas@elbuensabor.es</p>
                    <p className="flex items-center gap-3"><Clock className="h-5 w-5 text-amber-600"/>Martes - Domingo: 13:00 - 23:00</p>
                 </div>
            </div>
             <div className="h-96 rounded-2xl overflow-hidden shadow-xl border">
                 <MapWithNoSSR businesses={[]} zoneGeoJson={null} selectedBusinessId={null} mapView={{ center: [41.3874, 2.1686], zoom: 15 }} />
            </div>
         </div>
       </section>

      <footer className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} El Buen Sabor. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
