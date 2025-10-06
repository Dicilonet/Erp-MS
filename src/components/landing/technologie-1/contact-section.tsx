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
    const errs: { [k: string]: string } = {};
    if (!name) errs.name = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido.';
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
        <h2 className="text-3xl font-bold tracking-tight text-white">Solicita una Demo</h2>
        <p className="mt-2 text-lg text-gray-400">
          Descubre cómo nuestra plataforma puede transformar tu negocio.
        </p>
        <form onSubmit={onSubmit} className="mt-10 text-left space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Nombre</Label>
              <Input id="name" name="name" placeholder="Tu nombre" className="mt-1 bg-gray-800 border-gray-700 text-white" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email Corporativo</Label>
              <Input id="email" name="email" type="email" placeholder="tu@empresa.com" className="mt-1 bg-gray-800 border-gray-700 text-white" />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="message" className="text-gray-300">¿Qué problema quieres resolver? (Opcional)</Label>
            <Textarea id="message" name="message" placeholder="Ej: Automatizar nuestro marketing, mejorar el CRM..." className="mt-1 bg-gray-800 border-gray-700 text-white" />
          </div>
          <Button type="submit" disabled={sending} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold">
            {sending ? 'Enviando...' : 'Pedir Demo'}
          </Button>
          {sent && <p role="status" className="text-center text-sm text-green-400 font-medium">¡Solicitud recibida! Te contactaremos pronto.</p>}
        </form>
      </div>
    </section>
  );
}
