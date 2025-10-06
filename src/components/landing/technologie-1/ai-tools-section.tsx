'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

const aiTools = {
    "Modelos de Lenguaje": [
        { name: "Claude 3", url: "https://www.anthropic.com/claude" },
        { name: "Gemini 1.5", url: "https://deepmind.google/technologies/gemini/" },
        { name: "Grok", url: "https://x.ai/" },
        { name: "Perplexity", url: "https://www.perplexity.ai/" },
    ],
    "Automatización": [
        { name: "n8n", url: "https://n8n.io/" },
        { name: "Make (Integromat)", url: "https://www.make.com/en" },
        { name: "Zapier", url: "https://zapier.com/" },
    ],
};

export function AiToolsSection() {
    return (
        <section id="ai-tools" className="py-16 lg:py-24 bg-gray-800">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Conoce las Mejores Herramientas de IA y Automatización
                </h2>
                <p className="mt-2 text-lg text-gray-400">
                    Nos integramos con las plataformas líderes del mercado para potenciar tu flujo de trabajo.
                </p>
                <div className="mt-8 flex justify-center">
                    <Menubar className="bg-gray-900 border-gray-700 text-white">
                         {Object.entries(aiTools).map(([category, tools], index) => (
                            <MenubarMenu key={category}>
                                <MenubarTrigger>{category}</MenubarTrigger>
                                <MenubarContent>
                                    {tools.map(tool => (
                                        <MenubarItem key={tool.name} asChild>
                                            <a href={tool.url} target="_blank" rel="noopener noreferrer">{tool.name}</a>
                                        </MenubarItem>
                                    ))}
                                    {index < Object.keys(aiTools).length - 1 && <MenubarSeparator />}
                                </MenubarContent>
                            </MenubarMenu>
                         ))}
                    </Menubar>
                </div>
            </div>
        </section>
    );
}
