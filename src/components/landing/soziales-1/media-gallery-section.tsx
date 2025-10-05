'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const mediaItems = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1770&auto=format&fit=crop', alt: 'Voluntarios repartiendo comida' },
  { type: 'video', videoId: 'yv441P7-I-I', thumbnail: 'https://img.youtube.com/vi/yv441P7-I-I/hqdefault.jpg', alt: 'Testimonio de un beneficiario' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1618428809939-a09c3c1e3037?q=80&w=1770&auto=format&fit=crop', alt: 'Niños en una escuela construida por la ONG' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1770&auto=format&fit=crop', alt: 'Manos sosteniendo un brote de planta' },
  { type: 'video', videoId: '4y33h81Ie9I', thumbnail: 'https://img.youtube.com/vi/4y33h81Ie9I/hqdefault.jpg', alt: 'Resumen de nuestro último proyecto' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1614&auto=format&fit=crop', alt: 'Clase de arte para la comunidad' },
];


export function MediaGallerySection() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

    const openVideo = (videoId: string) => {
        setCurrentVideoId(videoId);
        setDialogOpen(true);
    };

    return (
        <section id="gallery" className="py-16 lg:py-24 bg-gray-100 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Nuestro Impacto en Acción</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Imágenes y videos que cuentan la historia de nuestro trabajo.</p>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItems.map((item, index) => (
                    <Card key={index} className="overflow-hidden group relative bg-gray-800 cursor-pointer" onClick={() => item.type === 'video' && openVideo(item.videoId)}>
                        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/50 transition-all duration-300" />
                        
                        <div className="aspect-video relative">
                             <Image
                                src={item.type === 'image' ? item.src : item.thumbnail}
                                alt={item.alt}
                                layout="fill"
                                objectFit="cover"
                                className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                            {item.type === 'video' ? (
                                <PlayCircle className="h-16 w-16 text-white/70 group-hover:text-white group-hover:scale-110 transition-all" />
                            ) : (
                                <ImageIcon className="h-12 w-12 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </div>
                        <div className="absolute bottom-0 left-0 z-20 p-4">
                             <h3 className="text-md font-semibold text-white drop-shadow-md">{item.alt}</h3>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-4xl p-0 bg-black border-gray-700">
                <DialogHeader className='sr-only'>
                    <DialogTitle>Reproductor de Video</DialogTitle>
                </DialogHeader>
                <AspectRatio ratio={16 / 9}>
                {currentVideoId && (
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
                </AspectRatio>
            </DialogContent>
        </Dialog>
        </section>
    );
}
