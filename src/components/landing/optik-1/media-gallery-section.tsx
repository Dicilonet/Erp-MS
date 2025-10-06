'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const mediaItems = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480&auto=format&fit=crop', alt: 'Colección de gafas de sol' },
  { type: 'video', videoId: 'VIDEO_ID_1', thumbnail: 'https://img.youtube.com/vi/VIDEO_ID_1/hqdefault.jpg', alt: 'Cómo elegir tus gafas perfectas' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1614716244232-6756641806e5?q=80&w=1770&auto=format&fit=crop', alt: 'Persona probándose gafas' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1780&auto=format&fit=crop', alt: 'Gafas de sol con estilo' },
  { type: 'video', videoId: 'VIDEO_ID_2', thumbnail: 'https://img.youtube.com/vi/VIDEO_ID_2/hqdefault.jpg', alt: 'Nueva tecnología en lentes progresivas' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1621276097435-01523c024524?q=80&w=1772&auto=format&fit=crop', alt: 'Taller de la óptica' },
];


export function MediaGallerySection() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

    const openVideo = (videoId: string) => {
        // Reemplaza los IDs de video de ejemplo por IDs reales de YouTube
        const realVideoIds: {[key: string]: string} = {
            'VIDEO_ID_1': 'u5a4-34M-3I',
            'VIDEO_ID_2': 'N-u4p33T5sQ',
        };
        const realId = realVideoIds[videoId] || 'dQw4w9WgXcQ'; // Fallback to a classic
        setCurrentVideoId(realId);
        setDialogOpen(true);
    };

    return (
        <section id="gallery" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Nuestra Galería</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Un vistazo a nuestras colecciones y consejos de expertos.</p>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItems.map((item, index) => (
                    <Card key={index} className="overflow-hidden group relative bg-gray-800 cursor-pointer border-gray-200 dark:border-gray-700" onClick={() => item.type === 'video' && openVideo(item.videoId)}>
                        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/50 transition-all duration-300" />
                        
                        <AspectRatio ratio={16 / 9} className="relative">
                             <Image
                                src={item.src}
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
