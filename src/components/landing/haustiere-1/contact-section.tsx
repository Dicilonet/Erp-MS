'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function ContactSection() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const errs: { [k: string]: string } = {};
    if (!name) errs.name = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido.';
    if (!message) errs.message = 'El mensaje no puede estar vacío.';
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
    <section id="contact" className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-amber-700 dark:text-amber-500">Contacta con Nosotros</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          ¿Tienes alguna pregunta o quieres reservar un servicio? Escríbenos.
        </p>
        <form onSubmit={onSubmit} className="mt-10 text-left space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tu Nombre</Label>
              <Input id="name" name="name" placeholder="Tu nombre" className="mt-1" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="pet-name">Nombre de tu Mascota</Label>
              <Input id="pet-name" name="pet-name" placeholder="Ej: Rocky" className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="tu@email.com" className="mt-1" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="message">Tu Mensaje</Label>
            <Textarea id="message" name="message" placeholder="¿En qué podemos ayudarte?" className="mt-1" />
            {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
          </div>
          <Button type="submit" disabled={sending} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
            {sending ? 'Enviando...' : 'Enviar Mensaje'}
          </Button>
          {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Hemos recibido tu mensaje.</p>}
        </form>
      </div>
    </section>
  );
}
