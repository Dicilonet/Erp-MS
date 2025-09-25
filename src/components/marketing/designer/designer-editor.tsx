
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DesignerData } from './social-media-designer';
import type { TFunction } from 'i18next';
import { Slider } from '@/components/ui/slider';
import { ImageSourceSelector } from './image-source-selector';
import i18next from 'i18next';

interface DesignerEditorProps {
  data: DesignerData;
  setData: React.Dispatch<React.SetStateAction<DesignerData>>;
  t: TFunction<'marketing'>;
  i18n: typeof i18next;
}

export function DesignerEditor({ data, setData, t, i18n }: DesignerEditorProps) {

  const layouts = [
    t('designer.layouts.layout1'),
    t('designer.layouts.layout2'),
    t('designer.layouts.layout3'),
    t('designer.layouts.layout4'),
    t('designer.layouts.layout5'),
  ];
  const iconsW = ['🌐', '📘', '📷'];
  const iconsC = ['📱', '✉️', '💬'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('designer.editor.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t('designer.editor.layout')}</Label>
          <Select value={String(data.layout)} onValueChange={(value) => setData({ ...data, layout: Number(value) })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {layouts.map((l, i) => <SelectItem key={i} value={String(i)}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <ImageSourceSelector
          label={t('designer.editor.image')}
          onImageSelect={(image) => setData(d => ({ ...d, image }))}
          t={t}
          i18n={i18n}
        />

        <div className="space-y-2">
            <Label>Zoom ({data.zoom}%)</Label>
            <Slider
                value={[data.zoom]}
                onValueChange={(value) => setData(d => ({ ...d, zoom: value[0] }))}
                min={100}
                max={300}
                step={1}
            />
        </div>

        <div className="space-y-2">
            <Label>Posición Vertical ({data.imagePosition.y}%)</Label>
             <Slider
                value={[data.imagePosition.y]}
                onValueChange={(value) => setData(d => ({ ...d, imagePosition: { ...d.imagePosition, y: value[0] } }))}
                min={0}
                max={100}
                step={1}
            />
        </div>
        
        <ImageSourceSelector
          label={t('designer.editor.logo')}
          onImageSelect={(logo) => setData(d => ({ ...d, logo }))}
          t={t}
          i18n={i18n}
        />
        
        <div className="space-y-2">
          <Label>{t('designer.editor.titleLabel')}</Label>
          <Input placeholder={t('designer.editor.titleLabel')} value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </div>

        <div className="flex gap-2 items-end">
          <div className="w-20">
            <Label>{t('designer.editor.icon')}</Label>
            <Select value={data.iconWeb} onValueChange={(value) => setData({ ...data, iconWeb: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {iconsW.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
             <Label>{t('designer.editor.web')}</Label>
            <Input placeholder={t('designer.editor.web')} value={data.web} onChange={(e) => setData({ ...data, web: e.target.value })} />
          </div>
        </div>
        
        <div className="flex gap-2 items-end">
           <div className="w-20">
            <Label>{t('designer.editor.icon')}</Label>
            <Select value={data.iconContact} onValueChange={(value) => setData({ ...data, iconContact: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {iconsC.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>{t('designer.editor.contact')}</Label>
            <Input placeholder={t('designer.editor.contact')} value={data.contact} onChange={(e) => setData({ ...data, contact: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('designer.editor.bgColor')}</Label>
          <Input type="color" value={data.colorBg} onChange={(e) => setData({ ...data, colorBg: e.target.value })} className="p-1 h-10" />
        </div>
      </CardContent>
    </Card>
  );
}
