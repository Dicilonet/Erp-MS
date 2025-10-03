'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const errs: { [k: string]: string } = {};
    if (!name) errs.name = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido.';
    if (!/^[+\d ()-]{6,}$/.test(phone)) errs.phone = 'Teléfono inválido.';
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
      await new Promise(r => setTimeout(r, 900));
      setSent(true);
      form.reset();
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-teal-700 dark:text-teal-400">Reserva tu Momento</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Déjanos tus datos y nos pondremos en contacto para agendar tu cita y resolver cualquier duda.
        </p>
        <form onSubmit={onSubmit} className="mt-10 text-left space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" name="name" placeholder="Tu nombre y apellido" className="mt-1" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" type="tel" placeholder="Tu teléfono de contacto" className="mt-1" />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="tu@email.com" className="mt-1" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="message">¿Qué tratamiento te interesa? (Opcional)</Label>
            <Textarea id="message" name="message" placeholder="Ej: Masaje relajante, tarjeta de regalo..." className="mt-1" />
          </div>
          <Button type="submit" disabled={sending} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            {sending ? 'Enviando...' : 'Solicitar Información'}
          </Button>
          {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Hemos recibido tu solicitud.</p>}
        </form>
      </div>
    </section>
  );
}
