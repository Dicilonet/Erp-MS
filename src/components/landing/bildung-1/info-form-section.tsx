'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function InfoFormSection() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const program = String(data.get('program') || '').trim();
    const errs: { [k: string]: string } = {};
    if (!name) errs.name = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email inválido.';
    if (!program) errs.program = 'Debes seleccionar un programa.';
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
    <section id="info" className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400">Solicita Información</h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Rellena el formulario y uno de nuestros asesores académicos se pondrá en contacto contigo.
        </p>
        <form onSubmit={onSubmit} className="mt-10 text-left space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Alumno/Tutor</Label>
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
            <Label htmlFor="program">Programa de Interés</Label>
            <Select name="program">
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un programa..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="arte">Escuela de Arte</SelectItem>
                    <SelectItem value="musica">Conservatorio de Música</SelectItem>
                    <SelectItem value="idiomas">Academia de Idiomas</SelectItem>
                    <SelectItem value="tech">Bootcamps de Tecnología</SelectItem>
                    <SelectItem value="gastronomia">Escuela de Gastronomía</SelectItem>
                    <SelectItem value="apoyo">Clases de Apoyo Escolar</SelectItem>
                </SelectContent>
            </Select>
            {errors.program && <p className="mt-1 text-xs text-red-600">{errors.program}</p>}
          </div>
          <div>
            <Label htmlFor="message">Tu Mensaje (Opcional)</Label>
            <Textarea id="message" name="message" placeholder="¿Tienes alguna pregunta específica?" className="mt-1" />
          </div>
          <Button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {sending ? 'Enviando...' : 'Pedir Información'}
          </Button>
          {sent && <p role="status" className="text-center text-sm text-emerald-700 font-medium">¡Gracias! Hemos recibido tu solicitud de información.</p>}
        </form>
      </div>
    </section>
  );
}
