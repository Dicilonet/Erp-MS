'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const mediaItems = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1546628312-b3556f805a44?q=80&w=1770&auto=format&fit=crop', alt: 'La banda en el escenario' },
  { type: 'video', videoId: 'dQw4w9WgXcQ', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', alt: 'Videoclip Oficial - "Ecos de Silicio"' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1770&auto=format&fit=crop', alt: 'Público en un concierto' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1770&auto=format&fit=crop', alt: 'DJ en un festival' },
  { type: 'video', videoId: '3tmd-ClpJxA', thumbnail: 'https://img.youtube.com/vi/3tmd-ClpJxA/hqdefault.jpg', alt: 'Making Of del nuevo álbum' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1770&auto=format&fit=crop', alt: 'Guitarrista en solitario' },
];


export function MediaGallerySection() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

    const openVideo = (videoId: string) => {
        setCurrentVideoId(videoId);
        setDialogOpen(true);
    };

    return (
        <section id="gallery" className="py-16 lg:py-24 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Galería Multimedia</h2>
            <p className="mt-2 text-lg text-gray-400">Fotos, videoclips y making-ofs. Sumérgete en nuestro universo.</p>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItems.map((item, index) => (
                    <Card key={index} className="overflow-hidden group relative border-gray-700 bg-gray-800 cursor-pointer" onClick={() => item.type === 'video' && openVideo(item.videoId)}>
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
                <DialogHeader>
                    <DialogTitle className="sr-only">Reproductor de Video</DialogTitle>
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