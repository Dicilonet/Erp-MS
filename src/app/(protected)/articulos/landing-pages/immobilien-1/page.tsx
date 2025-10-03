'use client';

import React, { useState } from "react";
import { MapPin, Phone, Mail, Building, Home, LandPlot, Ship, Car, Utensils, Stethoscope, Search, ChevronDown, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Cargando mapa...</p></div>,
});


export default function LandingImmobilien() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [budget, setBudget] = useState(1200);
  const [radius, setRadius] = useState(10);


  function validateContactForm(form: HTMLFormElement) {
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

  async function onContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = validateContactForm(form);
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
  
  const topProperties = [
      { src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600", alt: "Lujosa villa con piscina" },
      { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600", alt: "Moderno apartamento en el centro" },
      { src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600", alt: "Casa familiar con jardín" },
      { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600", alt: "Ático con vistas panorámicas" },
  ];
  
    const testimonials = [
      { name: 'Familia Schmidt', text: 'Encontramos la casa de nuestros sueños en menos de un mes. El proceso fue transparente y muy profesional. ¡Gracias!', avatar: 'https://i.pravatar.cc/150?img=11' },
      { name: 'Dr. Lena Vogel', text: 'Alquilar mi antigua consulta fue increíblemente fácil. Se encargaron de todo, desde las fotos hasta encontrar al inquilino perfecto.', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Start-up TechFlow', text: 'Nos encontraron la oficina ideal para nuestra expansión. Entendieron nuestras necesidades a la perfección. ¡Un servicio de 10!', avatar: 'https://i.pravatar.cc/150?img=33' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-200">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <a href="#" className="flex items-center gap-2 font-bold text-xl text-gray-800 dark:text-white">
                <Building className="h-6 w-6 text-sky-600"/>
                <span>ImmoWelt</span>
            </a>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                <a href="#propiedades" className="hover:text-sky-600">Propiedades Destacadas</a>
                <a href="#nosotros" className="hover:text-sky-600">Sobre Nosotros</a>
                <a href="#contacto" className="hover:text-sky-600">Contacto</a>
            </nav>
            <a href="#principal" className="hidden sm:inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-white font-semibold shadow-lg hover:bg-sky-700">Empezar ahora</a>
            </div>
        </header>

        <main>
            {/* --- HERO SECTION --- */}
            <section id="principal" className="relative bg-gray-900 py-20 sm:py-28">
                <div className="absolute inset-0">
                    <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1770" alt="Fachada de una casa moderna"/>
                    <div className="absolute inset-0 bg-gray-800/60 mix-blend-multiply" aria-hidden="true" />
                </div>
                <div className="relative mx-auto max-w-5xl text-center px-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Tu Próximo Hogar o Inversión, a un Clic</h1>
                    <p className="mt-4 text-xl text-gray-200">Descubre propiedades exclusivas o encuentra al inquilino perfecto con nuestra plataforma líder en el sector.</p>
                </div>
            </section>
            
            {/* --- TABS SECTION --- */}
            <div className="transform -translate-y-12 z-10 relative px-4">
                <Tabs defaultValue="buscar" className="mx-auto max-w-4xl">
                    <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-auto p-2 rounded-xl border">
                        <TabsTrigger value="buscar" className="py-3 text-base">Estoy Buscando</TabsTrigger>
                        <TabsTrigger value="ofrecer" className="py-3 text-base">Quiero Ofrecer</TabsTrigger>
                    </TabsList>
                    
                    {/* --- TAB: ESTOY BUSCANDO --- */}
                    <TabsContent value="buscar">
                        <Card className="shadow-2xl">
                            <CardHeader><CardTitle>Encuentra tu espacio ideal</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                     <div>
                                        <Label htmlFor="buscar-tipo">Tipo de Propiedad</Label>
                                        <Select><SelectTrigger><SelectValue placeholder="Selecciona..."/></SelectTrigger><SelectContent><SelectItem value="casa">Casa</SelectItem><SelectItem value="apartamento">Apartamento</SelectItem><SelectItem value="oficina">Oficina</SelectItem><SelectItem value="local">Local Comercial</SelectItem><SelectItem value="terreno">Terreno</SelectItem></SelectContent></Select>
                                    </div>
                                    <div>
                                        <Label>Precio del Alquiler</Label>
                                        <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Kaltmiete</span><span className="text-muted-foreground">Warmmiete</span></div>
                                        <Checkbox id="precio-tipo"/> <Label htmlFor="precio-tipo" className="text-sm ml-2">Incluir gastos (Warmmiete)</Label>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                     <div>
                                        <Label htmlFor="ciudad">Ciudad o Código Postal</Label>
                                        <Input id="ciudad" placeholder="Ej: Düsseldorf o 40210"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Presupuesto ({budget}€/mes)</Label>
                                            <Slider defaultValue={[1200]} max={5000} step={100} onValueChange={(v) => setBudget(v[0])} />
                                        </div>
                                         <div>
                                            <Label>Radio ({radius} km)</Label>
                                            <Slider defaultValue={[10]} max={100} step={5} onValueChange={(v) => setRadius(v[0])} />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white"><Search className="mr-2"/>Buscar propiedades</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    {/* --- TAB: QUIERO OFRECER --- */}
                    <TabsContent value="ofrecer">
                        <Card className="shadow-2xl">
                            <CardHeader><CardTitle>Ofrece tu propiedad</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><Label htmlFor="nombre-prop">Nombre</Label><Input id="nombre-prop" placeholder="Tu nombre"/></div>
                                        <div><Label htmlFor="apellido-prop">Apellido</Label><Input id="apellido-prop" placeholder="Tu apellido"/></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><Label htmlFor="email-prop">Email</Label><Input id="email-prop" type="email" placeholder="tu@email.com"/></div>
                                        <div><Label htmlFor="telefono-prop">Teléfono</Label><Input id="telefono-prop" type="tel" placeholder="+49..."/></div>
                                    </div>
                                </div>
                                 <div className="space-y-4">
                                    <Label>Tipo de Inmueble</Label>
                                    <Select><SelectTrigger><SelectValue placeholder="Selecciona..."/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="casa"><Home className="inline-block mr-2 h-4 w-4"/>Casa</SelectItem>
                                            <SelectItem value="apartamento"><Building className="inline-block mr-2 h-4 w-4"/>Apartamento</SelectItem>
                                            <SelectItem value="oficina"><Building className="inline-block mr-2 h-4 w-4"/>Oficina / Praxis</SelectItem>
                                            <SelectItem value="local"><Utensils className="inline-block mr-2 h-4 w-4"/>Local Comercial</SelectItem>
                                            <SelectItem value="terreno"><LandPlot className="inline-block mr-2 h-4 w-4"/>Terreno</SelectItem>
                                            <SelectItem value="playa"><Ship className="inline-block mr-2 h-4 w-4"/>Casa de Playa</SelectItem>
                                            <SelectItem value="rodante"><Car className="inline-block mr-2 h-4 w-4"/>Casa Rodante</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="md:col-span-2">
                                    <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">Enviar Oferta</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            
            {/* --- PROPIEDADES DESTACADAS --- */}
            <section id="propiedades" className="py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">Nuestros Inmuebles Top</h2>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Una selección de las mejores propiedades disponibles.</p>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topProperties.map((prop, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-xl shadow-lg">
                                <img src={prop.src} alt={prop.alt} className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                    <h3 className="font-bold text-lg">{prop.alt}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* --- TESTIMONIOS --- */}
            <section id="nosotros" className="py-16 lg:py-24 bg-gray-100 dark:bg-gray-900">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">La Confianza de Nuestros Clientes</h2>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Descubre por qué somos la inmobiliaria de referencia.</p>
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

            {/* --- MAPA Y CONTACTO --- */}
            <section id="contacto" className="py-16 lg:py-24">
                 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-sky-700">Contáctanos</h2>
                        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Nuestras oficinas están abiertas para ti. Ven a visitarnos o rellena el formulario.</p>
                        <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
                            <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-sky-600 mt-1"/><span>Königsallee 1, 40212 Düsseldorf, Alemania</span></p>
                            <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-sky-600"/><span>+49 211 1234567</span></p>
                            <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-sky-600"/><span>info@immowelt.de</span></p>
                        </div>
                    </div>
                    <form onSubmit={onContactSubmit} className="mt-10 lg:mt-0 space-y-4" noValidate>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="contact-name">Nombre</Label><Input id="contact-name" name="name" placeholder="Tu nombre"/>{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}</div>
                            <div><Label htmlFor="contact-email">Email</Label><Input id="contact-email" name="email" type="email" placeholder="tu@email.com"/>{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}</div>
                        </div>
                        <div><Label htmlFor="contact-message">Mensaje</Label><Textarea id="contact-message" name="message" rows={4} placeholder="¿En qué podemos ayudarte?" />{errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}</div>
                        <Button type="submit" disabled={sending} className="w-full bg-sky-600 hover:bg-sky-700 text-white">{sending ? "Enviando…" : "Enviar Mensaje"}</Button>
                        {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Hemos recibido tu mensaje.</p>}
                    </form>
                 </div>
                 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 h-96 rounded-2xl overflow-hidden shadow-xl border">
                    <MapWithNoSSR businesses={[]} zoneGeoJson={null} selectedBusinessId={null} mapView={{ center: [51.2249, 6.7761], zoom: 15 }} />
                </div>
            </section>
        </main>
        
        <footer className="bg-gray-800 text-white mt-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <a href="#" className="font-bold text-xl">ImmoWelt</a>
                    <p className="text-sm text-gray-400">Tu socio de confianza en el sector inmobiliario.</p>
                </div>
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} ImmoWelt. Todos los derechos reservados.</p>
            </div>
        </footer>
    </div>
  );
}
