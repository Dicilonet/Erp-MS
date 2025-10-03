
'use client';

import React, { useState } from "react";

export default function LandingModernEcommerce() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const consent = data.get("consent");

    const errs: { [k: string]: string } = {};
    if (!name) errs.name = "Ingresa tu nombre";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email inválido";
    if (!/^[+\d ()-]{6,}$/.test(phone)) errs.phone = "Teléfono inválido";
    if (!interest) errs.interest = "Selecciona un interés";
    if (!consent) errs.consent = "Debes aceptar la política";
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
      // En producción puedes enviar a tu endpoint (n8n, Make, Airtable, Supabase, etc.)
      // await fetch("/api/lead", { method: "POST", body: new FormData(form) });
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
      form.reset();
    } finally {
      setSending(false);
    }
  }

  const gallery = [
    { src: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop", alt: "Plato gourmet colorido", },
    { src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop", alt: "Mesa elegante con velas", },
    { src: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop", alt: "Chef emplatando con estilo", },
    { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop", alt: "Ambiente minimalista moderno", },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500"></div>
            <span className="font-semibold tracking-tight text-lg">TuMarca</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#beneficios" className="hover:text-emerald-600">Beneficios</a>
            <a href="#galeria" className="hover:text-emerald-600">Galería</a>
            <a href="#plan" className="hover:text-emerald-600">Plan</a>
            <a href="#faq" className="hover:text-emerald-600">FAQ</a>
          </nav>
          <a href="#form" className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white font-medium shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">Empezar</a>
        </div>
      </header>

      {/* Hero + Formulario destacado */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 text-xs font-medium mb-4 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
              <span>Nueva experiencia</span>
              <span className="h-1 w-1 rounded-full bg-emerald-500"/>
              <span>Compra sin fricción</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Eleva tus ventas con una landing hiper‑moderna y lista para móvil
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              Presenta tus productos o servicios, captura leads en segundos y muestra credibilidad con una galería 2×2 elegante. Integrable con n8n, Airtable, Supabase o el backend que uses.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                "Responsive total (móvil + desktop)",
                "Optimizada para conversión",
                "Formulario con validación",
                "Lista para SEO y performance",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold dark:bg-emerald-900/50 dark:text-emerald-300">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card de formulario */}
          <div id="form" className="lg:justify-self-end">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-xl font-semibold">Recibe tu demo personalizada</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Déjanos tus datos y te contactamos en minutos.</p>

              <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
                {/* honeypot */}
                <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
                    <input id="name" name="name" type="text" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800" placeholder="Tu nombre" />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium">Teléfono</label>
                    <input id="phone" name="phone" type="tel" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800" placeholder="+49 170 000000" />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input id="email" name="email" type="email" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800" placeholder="tu@email.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium">Interés</label>
                    <select id="interest" name="interest" className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800">
                      <option value="">Selecciona…</option>
                      <option value="producto">Vender producto</option>
                      <option value="servicio">Ofertar servicio</option>
                      <option value="suscripcion">Página de suscripción</option>
                    </select>
                    {errors.interest && <p className="mt-1 text-xs text-red-600">{errors.interest}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium">Cuéntanos brevemente</label>
                  <textarea id="message" name="message" rows={3} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800" placeholder="¿Qué quieres lograr con tu landing?" />
                </div>

                <label className="flex items-start gap-3 text-sm">
                  <input name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span>
                    Acepto la <a className="underline hover:text-emerald-700" href="#" onClick={(e)=>e.preventDefault()}>política de privacidad</a> y el tratamiento de mis datos.
                  </span>
                </label>
                {errors.consent && <p className="-mt-2 text-xs text-red-600">{errors.consent}</p>}

                <button type="submit" disabled={sending} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-white font-semibold shadow hover:bg-emerald-700 disabled:opacity-60">
                  {sending ? "Enviando…" : "Solicitar demo"}
                </button>
                {sent && (
                  <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Te contactaremos muy pronto.</p>
                )}
              </form>

              <p className="mt-4 text-xs text-slate-500">Protegido por validación local. Integra tu endpoint preferido en la función onSubmit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Velocidad real",
                desc: "Carga ultrarrápida y puntajes Lighthouse listos para SEO y Ads.",
              },
              {
                title: "Integración flexible",
                desc: "Conecta con n8n, Airtable, Supabase, Brevo, LexOffice o tu CRM.",
              },
              {
                title: "Conversión primero",
                desc: "Diseño centrado en el formulario para captar leads sin distracciones.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería 2×2 */}
      <section id="galeria" className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">Galería</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Cuatro imágenes, dos columnas en desktop y una en móvil.</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gallery.map((g, i) => (
              <figure key={i} className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                <img src={g.src} alt={g.alt} className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Plan / Oferta */}
      <section id="plan" className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-6 dark:from-slate-900 dark:to-emerald-950/20 dark:border-slate-700">
              <h3 className="text-xl font-bold">Pack Landing Pro</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Implementación completa en tu dominio</li>
                <li>Integración del formulario con tu stack</li>
                <li>Optimización SEO on‑page</li>
                <li>Soporte y ajustes iniciales</li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#form" className="rounded-xl bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700">Quiero cotizar</a>
                <span className="text-sm text-slate-500">Sin compromiso. Respuesta en el mismo día.</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-medium text-emerald-700">Desde</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight">€ 720</p>
              <p className="text-xs text-slate-500">Impuestos no incluidos</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>Entrega en 7–10 días</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>Dominio y hosting opcionales</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>Actualizable a tienda completa</li>
              </ul>
              <a href="#form" className="mt-6 block text-center rounded-xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-800 dark:bg-white dark:text-slate-900">Solicitar propuesta</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 lg:py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
          <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
            {[
              {
                q: "¿Puedo usar esto como una sección dentro de mi web?",
                a: "Sí. Es un componente independiente. Puedes montarlo en cualquier ruta o incrustarlo como sección de tu página existente.",
              },
              {
                q: "¿Cómo conecto el formulario a mi backend?",
                a: "Reemplaza el setTimeout del onSubmit por un fetch a tu endpoint (n8n, Make, Supabase, Airtable, Google Sheets, etc.).",
              },
              {
                q: "¿Se puede convertir en tienda completa?",
                a: "Totalmente. La arquitectura está pensada para escalar a catálogo, carrito y checkout con mínima fricción.",
              },
            ].map((item, i) => (
              <details key={i} className="group py-4">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  {item.q}
                  <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-600 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} TuMarca. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:text-emerald-700">Privacidad</a>
            <a href="#" className="hover:text-emerald-700">Términos</a>
            <a href="#form" className="rounded-lg border border-slate-300 px-3 py-1.5 hover:border-emerald-500">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
