
'use client';

import React, { useState } from "react";
import { Search, MapPin, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function LandingReisen() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const errs: { [k: string]: string } = {};
    if (!name) errs.name = "Ingresa tu nombre";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email inválido";
    if (!message) errs.message = "El mensaje no puede estar vacío";
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

  const offers = [
    { title: "Safari en Kenia", price: "1.800€", img: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1770&auto=format&fit=crop" },
    { title: "Playas de Tailandia", price: "1.250€", img: "https://images.unsplash.com/photo-1499955914327-04a7732912a6?q=80&w=1770&auto=format&fit=crop" },
    { title: "Auroras en Islandia", price: "2.100€", img: "https://images.unsplash.com/photo-1534570111563-06110283b8b9?q=80&w=1770&auto=format&fit=crop" },
    { title: "Cultura en Japón", price: "2.500€", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1770&auto=format&fit=crop" },
    { title: "Aventura en Perú", price: "1.950€", img: "https://images.unsplash.com/photo-1526481280642-423244d6a693?q=80&w=1770&auto=format&fit=crop" },
  ];
  
  const testimonials = [
      { name: 'Ana García', text: 'El mejor viaje de mi vida. La organización fue impecable y los destinos, espectaculares. ¡Repetiré sin duda!', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Michael Schmidt', text: 'Una experiencia inolvidable. El equipo cuidó cada detalle y nos sentimos seguros y acompañados en todo momento.', avatar: 'https://i.pravatar.cc/150?img=5' },
      { name: 'Sophie Dubois', text: 'Superó todas mis expectativas. Los guías eran expertos y apasionados. ¡100% recomendable!', avatar: 'https://i.pravatar.cc/150?img=3' },
  ];
  
  const destinations = [
      { name: 'Italia', img: 'https://images.unsplash.com/photo-1515859005217-46615b4e41de?q=80&w=800' },
      { name: 'Egipto', img: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=800' },
      { name: 'Brasil', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800' },
      { name: 'Australia', img: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#" className="font-bold text-xl text-blue-600">MundoAventura</a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#ofertas" className="hover:text-blue-600">Ofertas</a>
            <a href="#nosotros" className="hover:text-blue-600">Nosotros</a>
            <a href="#contacto" className="hover:text-blue-600">Contacto</a>
          </nav>
          <a href="#form" className="hidden sm:inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow-lg hover:bg-blue-700">Planifica tu Viaje</a>
        </div>
      </header>

      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1770&auto=format&fit=crop" alt="Paisaje de montaña con lago" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-2xl">Descubre. Sueña. Viaja.</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-lg">Creamos experiencias inolvidables en los destinos más fascinantes del mundo.</p>
          <div className="mt-8 mx-auto max-w-md bg-white/20 backdrop-blur-md p-4 rounded-xl">
            <form className="flex gap-2">
              <Input type="text" placeholder="¿A dónde quieres ir?" className="bg-white/90 text-gray-800 border-0 focus-visible:ring-blue-500" />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white"><Search className="h-5 w-5" /></Button>
            </form>
          </div>
        </div>
      </section>

      <section id="ofertas" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Ofertas que no podrás resistir</h2>
             <Carousel className="w-full" opts={{ align: "start", loop: true, }}>
                <CarouselContent className="-ml-4">
                    {offers.map((offer, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <Card className="overflow-hidden group">
                        <div className="relative h-64">
                            <img src={offer.img} alt={offer.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-xl font-bold">{offer.title}</h3>
                            <p className="text-lg font-semibold">{offer.price}</p>
                            </div>
                        </div>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 ml-4 bg-white/80 hover:bg-white text-gray-800 border-gray-300" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 mr-4 bg-white/80 hover:bg-white text-gray-800 border-gray-300" />
             </Carousel>
        </div>
      </section>

      <section id="nosotros" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Lo que dicen nuestros viajeros</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">La confianza de quienes ya han viajado con nosotros es nuestra mejor carta de presentación.</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <Card key={t.name} className="text-left">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full" />
                    <p className="font-semibold">{t.name}</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">"{t.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-bold">Un mundo de posibilidades a tu alcance</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Desde nuestras oficinas, planificamos aventuras a los rincones más increíbles del planeta. Tu próximo destino está más cerca de lo que imaginas.</p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    {destinations.map(d => (
                         <div key={d.name} className="relative aspect-video rounded-lg overflow-hidden group">
                             <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <p className="text-white font-bold text-xl drop-shadow-md">{d.name}</p>
                            </div>
                         </div>
                    ))}
                </div>
            </div>
            <div>
                <img src="/world-map.svg" alt="Mapa del mundo" className="w-full h-auto" />
            </div>
        </div>
      </section>

      <section id="form" className="py-16 lg:py-24 bg-blue-50 dark:bg-blue-950/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600">¿Listo para la Aventura?</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Déjanos tu mensaje y un experto en viajes se pondrá en contacto contigo.</p>
          </div>
          <Card className="mt-10 max-w-xl mx-auto">
            <CardContent className="pt-6">
                 <form onSubmit={onSubmit} className="space-y-4" noValidate>
                    <div>
                        <Label htmlFor="name" className="font-medium">Nombre</Label>
                        <Input id="name" name="name" type="text" placeholder="Tu nombre completo" className="mt-1"/>
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email" className="font-medium">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="tu@email.com" className="mt-1"/>
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <Label htmlFor="message" className="font-medium">Mensaje</Label>
                        <Textarea id="message" name="message" rows={4} placeholder="Cuéntanos sobre el viaje de tus sueños..." className="mt-1" />
                        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                    </div>
                    <Button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {sending ? "Enviando…" : "Enviar Consulta"}
                    </Button>
                    {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Mensaje recibido! Nos pondremos en contacto pronto.</p>}
                 </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
            <div>
                <h3 className="font-bold text-lg">MundoAventura</h3>
                <p className="text-sm text-gray-400 mt-2">Tu pasaporte a experiencias que recordarás toda la vida.</p>
            </div>
            <div>
                <h3 className="font-bold text-lg">Contacto</h3>
                <ul className="text-sm text-gray-400 mt-2 space-y-2">
                    <li className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Calle de la Aventura, 123, Madrid</li>
                    <li className="flex items-center gap-2"><Phone className="h-4 w-4"/> +34 912 345 678</li>
                    <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> info@mundoaventura.es</li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg">Síguenos</h3>
                <div className="flex gap-4 mt-2">
                    {/* Social links */}
                </div>
            </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} MundoAventura. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
