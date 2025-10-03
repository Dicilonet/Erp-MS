'use client';

export function TeamSection() {
    return (
         <section id="about-us" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-cyan-700 dark:text-cyan-400">Comprometidos con tu Bienestar</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Nuestra praxis fue fundada con la misión de proporcionar un cuidado médico accesible, transparente y de la más alta calidad. Creemos en la medicina preventiva y en construir una relación de confianza a largo plazo con cada uno de nuestros pacientes.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                       Nuestro equipo de especialistas se mantiene en constante formación para aplicar los tratamientos más avanzados y efectivos, siempre con un enfoque centrado en la persona.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1770&auto=format&fit=crop" alt="Equipo médico colaborando" className="rounded-2xl shadow-xl aspect-video object-cover"/>
                </div>
            </div>
        </section>
    );
}
