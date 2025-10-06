'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const videos = [
    { title: "Cómo Limpiar tu Audífono en 5 Pasos", videoId: "your-video-id-1" },
    { title: "Consejos para Adaptarte a tus Nuevos Audífonos", videoId: "your-video-id-2" },
    { title: "Mitos y Realidades sobre la Pérdida Auditiva", videoId: "your-video-id-3" },
];

export function TipsVideoSection() {
    return (
        <section id="tips" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Consejos de Nuestros Expertos</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Videos cortos y prácticos para cuidar tu audición y tus dispositivos.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {videos.map(video => (
                        <Card key={video.videoId} className="overflow-hidden">
                             <CardContent className="p-0">
                                <AspectRatio ratio={16 / 9}>
                                    <iframe 
                                        src={`https://www.youtube.com/embed/${video.videoId}`}
                                        title={video.title}
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </AspectRatio>
                                <div className="p-4">
                                     <h3 className="font-semibold">{video.title}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
