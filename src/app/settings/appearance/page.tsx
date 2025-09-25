'use client';

import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Laptop, Moon, Sun } from 'lucide-react';

export default function AppearancePage() {
  const { t } = useTranslation('settings');
  const { setTheme, theme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('appearance.title')}</CardTitle>
        <CardDescription>{t('appearance.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup 
            onValueChange={setTheme} 
            defaultValue={theme}
            className="grid max-w-md grid-cols-1 sm:grid-cols-3 gap-4"
        >
            <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                <Sun className="mb-3 h-6 w-6" />
                {t('appearance.light')}
                </Label>
            </div>
            <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                <Moon className="mb-3 h-6 w-6" />
                {t('appearance.dark')}
                </Label>
            </div>
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                <Laptop className="mb-3 h-6 w-6" />
                {t('appearance.system')}
                </Label>
            </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
