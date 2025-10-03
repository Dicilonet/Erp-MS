
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Users, BedDouble } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

export function BookingTabs() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1)),
  });

  return (
    <section id="booking" className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="pre-booking">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pre-booking">Pre-Reserva</TabsTrigger>
            <TabsTrigger value="contact">Contacto General</TabsTrigger>
          </TabsList>
          <TabsContent value="pre-booking">
            <Card>
              <CardHeader>
                <CardTitle>Solicitud de Pre-Reserva</CardTitle>
                <CardDescription>Indíquenos sus fechas y le contactaremos para confirmar disponibilidad y finalizar la reserva.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Fechas de Estancia</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(date.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Seleccione sus fechas</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guests">Huéspedes</Label>
                    <Input id="guests" type="number" placeholder="2" defaultValue="2" />
                  </div>
                  <div>
                    <Label htmlFor="room-type">Tipo de Habitación</Label>
                     <Input id="room-type" placeholder="Ej: Doble Deluxe" />
                  </div>
                </div>
                 <div>
                    <Label htmlFor="contact-name">Nombre de Contacto</Label>
                    <Input id="contact-name" placeholder="Tu nombre y apellido"/>
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" placeholder="tu@email.com"/>
                  </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Enviar Solicitud</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contact">
             <Card>
              <CardHeader>
                <CardTitle>Contacto General</CardTitle>
                <CardDescription>¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form>
                  <div>
                    <Label htmlFor="general-name">Nombre</Label>
                    <Input id="general-name" placeholder="Tu nombre" />
                  </div>
                   <div>
                    <Label htmlFor="general-email">Email</Label>
                    <Input id="general-email" type="email" placeholder="tu@email.com" />
                  </div>
                   <div>
                    <Label htmlFor="general-message">Mensaje</Label>
                    <Textarea id="general-message" placeholder="Escribe aquí tu consulta..." />
                  </div>
                   <Button className="w-full bg-blue-600 hover:bg-blue-700">Enviar Mensaje</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
