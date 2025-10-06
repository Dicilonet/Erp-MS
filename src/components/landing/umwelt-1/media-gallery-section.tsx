'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const mediaItems = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1516285623068-9b8e8f8c4a03?q=80&w=1770&auto=format&fit=crop', alt: 'Voluntarios plantando árboles' },
  { type: 'video', videoId: 'e64p-D35V5M', thumbnail: 'https://img.youtube.com/vi/e64p-D35V5M/hqdefault.jpg', alt: 'Limpieza de una playa' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1597053531252-475961b1836a?q=80&w=1770&auto=format&fit=crop', alt: 'Taller de educación ambiental en una escuela' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1473992243898-fa7525e652a5?q=80&w=1770&auto=format&fit=crop', alt: 'Rescate de fauna silvestre' },
  { type: 'video', videoId: 'RK1K2bCg4J8', thumbnail: 'https://img.youtube.com/vi/RK1K2bCg4J8/hqdefault.jpg', alt: 'Nuestra misión: Un planeta para todos' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1611273735133-7a9357a0300a?q=80&w=1770&auto=format&fit=crop', alt: 'Instalación de paneles solares en una comunidad' },
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
            <h2 className="text-3xl font-bold tracking-tight">Nuestro Trabajo en Imágenes</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Fotos y videos que muestran el impacto real de nuestras acciones.</p>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItems.map((item, index) => (
                    <Card key={index} className="overflow-hidden group relative bg-gray-800 cursor-pointer border-gray-200 dark:border-gray-700" onClick={() => item.type === 'video' && openVideo(item.videoId)}>
                        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/50 transition-all duration-300" />
                        
                        <AspectRatio ratio={16 / 9} className="relative">
                             <Image
                                src={item.type === 'image' ? item.src : item.thumbnail}
                                alt={item.alt}
                                fill
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </AspectRatio>

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
