'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BookingForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const service = String(data.get('service') || '').trim();
    const errs: { [k: string]: string } = {};
    if (!name) errs.name = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido.';
    if (!service) errs.service = 'Debes seleccionar un servicio.';
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
        <h2 className="text-3xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">Da el Primer Paso</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Solicita una primera sesión de valoración sin compromiso. Estamos aquí para escucharte.
        </p>
        <form onSubmit={onSubmit} className="mt-10 text-left space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Tu nombre" className="mt-1" />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" className="mt-1" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="service">Tipo de Consulta</Label>
            <Select name="service">
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un área de interés..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="terapia">Terapia</SelectItem>
                    <SelectItem value="legal">Asuntos Legales</SelectItem>
                    <SelectItem value="familia">Asuntos Familiares</SelectItem>
                    <SelectItem value="finanzas">Finanzas</SelectItem>
                    <SelectItem value="personal">Coaching Personal</SelectItem>
                </SelectContent>
            </Select>
            {errors.service && <p className="mt-1 text-xs text-red-600">{errors.service}</p>}
          </div>
          <div>
            <Label htmlFor="message">Tu Mensaje (Opcional)</Label>
            <Textarea id="message" name="message" placeholder="Cuéntanos brevemente tu situación..." className="mt-1" />
          </div>
          <Button type="submit" disabled={sending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            {sending ? 'Enviando...' : 'Solicitar Sesión'}
          </Button>
          {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Tu solicitud ha sido enviada.</p>}
        </form>
      </div>
    </section>
  );
}
