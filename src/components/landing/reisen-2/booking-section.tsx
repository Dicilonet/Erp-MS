'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BookingSection() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const tour = String(data.get('tour') || '').trim();
    const errs: { [k: string]: string } = {};
    if (!name) errs.name = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido.';
    if (!tour) errs.tour = 'Debes seleccionar un tour.';
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
    <section id="booking" className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-sky-700 dark:text-sky-400">Reserva tu Aventura Urbana</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Rellena el formulario y te enviaremos toda la información para tu próximo tour.
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
            <Label htmlFor="tour">Tour de Interés</Label>
            <Select name="tour">
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un tour..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="bus">Tour Panorámico en Bus</SelectItem>
                    <SelectItem value="barco">Paseo por el Puerto</SelectItem>
                    <SelectItem value="pie">Ruta Histórica a Pie</SelectItem>
                    <SelectItem value="noche">Tour Nocturno</SelectItem>
                </SelectContent>
            </Select>
            {errors.tour && <p className="mt-1 text-xs text-red-600">{errors.tour}</p>}
          </div>
          <div>
            <Label htmlFor="message">Comentarios</Label>
            <Textarea id="message" name="message" placeholder="¿Necesitas algo especial? Fechas, número de personas, etc." className="mt-1" />
          </div>
          <Button type="submit" disabled={sending} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
            {sending ? 'Enviando...' : 'Solicitar Información'}
          </Button>
          {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Hemos recibido tu solicitud.</p>}
        </form>
      </div>
    </section>
  );
}
