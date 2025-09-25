
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DesignerData } from './social-media-designer';
import type { TFunction } from 'i18next';

interface DesignerPreviewProps {
  data: DesignerData;
  previewRef: React.RefObject<HTMLDivElement>;
  t: TFunction<'marketing'>;
}

export function DesignerPreview({ data, previewRef, t }: DesignerPreviewProps) {
    
    const layouts = [
        'grid grid-rows-[auto_1fr_auto] aspect-square', // 0: Cuadrado IG
        'grid grid-rows-[1fr_auto] aspect-square',     // 1: Cuadrado IG sin Título
        'grid grid-cols-[2fr_1fr] aspect-[1.91/1]',    // 2: Foto + Lateral (Facebook)
        'grid grid-rows-[auto_1fr_auto] aspect-[4/5]', // 3: Vertical (Instagram Post)
        'grid grid-rows-[auto_1fr_auto] aspect-[9/16]',// 4: Story 9:16
    ];

    const layout = layouts[data.layout] || layouts[0];

    const getContrastColor = (hexcolor: string) => {
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(char => char + char).join('');
        }
        const r = parseInt(hexcolor.substr(0,2),16);
        const g = parseInt(hexcolor.substr(2,2),16);
        const b = parseInt(hexcolor.substr(4,2),16);
        const yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? '#000000' : '#ffffff';
    };

    const textColor = getContrastColor(data.colorBg);

    const renderFooter = () => (
        <div 
            className="grid grid-cols-2 gap-4 p-4" 
            style={{ 
                backgroundColor: data.colorBg, 
                color: textColor 
            }}
        >
            <div className="flex items-center justify-center gap-3 rounded-md border border-white/30 p-2">
                <span className="text-xl">{data.iconWeb}</span>
                <span className="truncate text-sm">{data.web}</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-md border border-white/30 p-2">
                 <span className="text-xl">{data.iconContact}</span>
                <span className="truncate text-sm">{data.contact}</span>
            </div>
        </div>
    );
    
    const renderHeader = () => (
        <div 
            className="flex items-center justify-between p-4" 
            style={{ 
                backgroundColor: data.colorBg, 
                color: textColor 
            }}
        >
            {data.logo && <img src={data.logo} alt="logo" className="h-10 md:h-12 object-contain" />}
            <div className="border border-white/30 p-2 px-4 rounded-md">
                 <span className="font-semibold text-right truncate">{data.title}</span>
            </div>
        </div>
    );

    const imageStyle: React.CSSProperties = {
        transform: `scale(${data.zoom / 100})`,
        objectPosition: `${data.imagePosition.x}% ${data.imagePosition.y}%`,
        transition: 'transform 0.2s ease-out, object-position 0.2s ease-out',
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    };

    const imageContainerStyle: React.CSSProperties = {
      overflow: 'hidden',
      width: '100%',
      height: '100%',
    };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardContent className="pt-6 flex items-center justify-center bg-muted/30 rounded-lg">
        <div id="preview-container" ref={previewRef} className={cn("bg-white text-black w-full max-w-lg rounded shadow-lg overflow-hidden", layout)}>
            
            { data.layout !== 1 && renderHeader() }

            <div style={imageContainerStyle}>
                {data.image ? <img src={data.image} alt="content" style={imageStyle} /> : <div className="bg-gray-200 h-full w-full"></div>}
            </div>

            { renderFooter() }

        </div>
      </CardContent>
    </Card>
  );
}
