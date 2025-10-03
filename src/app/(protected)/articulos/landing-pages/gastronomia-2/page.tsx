'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Coffee, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Cargando mapa...</p></div>,
});


export default function LandingGastronomiaCafe() {
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
  
  const topProducts = [
    { name: 'Croissant de Mantequilla', img: 'https://images.unsplash.com/photo-1589114471223-dec0d8b471c6?q=80&w=800' },
    { name: 'Café Latte Artesanal', img: 'https://images.unsplash.com/photo-1572442388159-200a7d3c9967?q=80&w=800' },
    { name: 'Tarta de Frutos Rojos', img: 'https://images.unsplash.com/photo-1562440102-369a843935d7?q=80&w=800' },
    { name: 'Pan de Masa Madre', img: 'https://images.unsplash.com/photo-1533083829193-64210a11a483?q=80&w=800' },
  ];
  
   const testimonials = [
      { name: 'Ana S.', text: 'El mejor café de la ciudad, sin duda. Y los croissants... ¡son de otro mundo! Vengo casi todos los días.', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'David M.', text: 'Un rincón acogedor para trabajar o simplemente disfrutar de un buen libro. El personal es encantador.', avatar: 'https://i.pravatar.cc/150?img=60' },
      { name: 'Clara R.', text: 'Las tartas son una obra de arte y están deliciosas. El lugar perfecto para una tarde con amigas.', avatar: 'https://i.pravatar.cc/150?img=25' },
  ];


  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 font-sans">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-stone-900/70 border-b border-stone-200/60 dark:border-stone-700/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Coffee className="h-7 w-7 text-amber-800" />
            <span className="font-semibold tracking-tight text-lg">Café Aroma</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#historia" className="hover:text-amber-800">Nuestra Pasión</a>
            <a href="#productos" className="hover:text-amber-800">Especialidades</a>
            <a href="#mapa" className="hover:text-amber-800">Visítanos</a>
          </nav>
          <a href="#contacto" className="inline-flex items-center rounded-xl bg-amber-800 px-4 py-2 text-white font-medium shadow hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500">Contacto</a>
        </div>
      </header>

      <section className="relative h-[65vh] min-h-[450px] flex items-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1771&auto=format&fit=crop" alt="Interior acogedor de una cafetería" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="relative z-20 mx-auto max-w-3xl text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            El Arte de un Buen Café
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-200 max-w-xl mx-auto drop-shadow-md">
            Donde cada grano cuenta una historia y cada dulce es un momento de felicidad.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="#productos" className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-stone-900 font-semibold shadow hover:bg-stone-200">Ver Especialidades</a>
            <a href="#mapa" className="inline-flex items-center rounded-xl border border-white/50 bg-black/20 px-5 py-3 text-white font-medium backdrop-blur-sm hover:bg-white/10">Cómo Llegar</a>
          </div>
        </div>
      </section>

      <section id="historia" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
                <h2 className="text-3xl font-bold tracking-tight text-amber-900 dark:text-amber-600">Nuestra Pasión por el Sabor</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-300">
                    Nacimos de un sueño simple: crear un espacio donde la gente pudiera hacer una pausa y disfrutar de un café excepcional. Seleccionamos granos de las mejores fincas del mundo y los tostamos aquí mismo, cada semana, para garantizar una frescura que se siente en cada sorbo.
                </p>
                <p className="mt-3 text-slate-600 dark:text-slate-300">
                    Nuestra panadería y pastelería siguen la misma filosofía, usando ingredientes de proximidad y recetas que han pasado de generación en generación, horneando cada día para ti.
                </p>
            </div>
            <div className="order-1 lg:order-2">
                <img src="https://images.unsplash.com/photo-1559928117-0635742193d9?q=80&w=1587&auto=format&fit=crop" alt="Barista preparando un café con arte latte" className="rounded-2xl shadow-xl aspect-square object-cover"/>
            </div>
        </div>
      </section>
      
      <section id="productos" className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-amber-900 dark:text-amber-600">Nuestras Especialidades</h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Hecho a mano, cada día.</p>
            </div>
             <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topProducts.map((product, i) => (
                    <Card key={i} className="group overflow-hidden">
                        <div className="overflow-hidden">
                          <img src={product.img} alt={product.name} className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold">{product.name}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>
      
       <section id="testimonios" className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Lo que dicen nuestros clientes</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">El corazón de nuestro café es nuestra comunidad.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full" />
                            <div>
                                <p className="font-semibold">{t.name}</p>
                                <div className="flex text-yellow-500"><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/></div>
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 italic">"{t.text}"</p>
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>
      </section>

       <section id="mapa" className="py-16 lg:py-24 bg-stone-100 dark:bg-stone-900">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
                 <h2 className="text-3xl font-bold tracking-tight text-amber-900 dark:text-amber-600">Visítanos</h2>
                 <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Te esperamos en nuestro rincón especial.</p>
                 <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
                    <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-amber-800 mt-1 flex-shrink-0"/><span>Calle del Café, 12, 28004 Madrid, España</span></p>
                    <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-amber-800"/><span>+34 912 345 678</span></p>
                    <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-800"/><span>hola@cafearoma.es</span></p>
                    <p className="flex items-center gap-3"><Clock className="h-5 w-5 text-amber-800"/><span>Lunes - Sábado: 08:00 - 20:00</span></p>
                 </div>
            </div>
             <div className="h-96 rounded-2xl overflow-hidden shadow-xl border">
                 <MapWithNoSSR businesses={[]} zoneGeoJson={null} selectedBusinessId={null} mapView={{ center: [40.422, -3.701], zoom: 16 }} />
            </div>
         </div>
       </section>
       
        <section id="contacto" className="py-16 lg:py-24">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-amber-900 dark:text-amber-600">Contacta con Nosotros</h2>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">¿Sugerencias, preguntas o pedidos especiales? ¡Escríbenos!</p>
                </div>
                <form onSubmit={onSubmit} className="mt-10 space-y-4" noValidate>
                    <div><Label htmlFor="name">Nombre</Label><Input id="name" name="name" className="mt-1"/>{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}</div>
                    <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" className="mt-1"/>{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}</div>
                    <div><Label htmlFor="message">Mensaje</Label><Textarea id="message" name="message" rows={4} className="mt-1" />{errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}</div>
                    <Button type="submit" disabled={sending} className="w-full bg-amber-800 hover:bg-amber-900 text-white">{sending ? "Enviando…" : "Enviar Mensaje"}</Button>
                    {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Hemos recibido tu mensaje.</p>}
                </form>
            </div>
        </section>

      <footer className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Café Aroma. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
