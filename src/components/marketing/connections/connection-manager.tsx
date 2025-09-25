'use client';

// Este componente es una maqueta funcional de la interfaz.
// La lógica para llamar a `startFacebookAuth` y manejar los datos reales debe implementarse.

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Linkedin, Send, MessageSquare, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- SVG Icons para redes que no están en Lucide ---
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16.1 7.4a4.5 4.5 0 0 0-5.7-5.7l-.4.3c-2.4 1.5-4.3 4-4.7 6.8"/>
        <path d="M12 10.5v8.5a4 4 0 1 0 4-4H12"/>
    </svg>
);


export function ConnectionManager() {
  const { t } = useTranslation('marketing');
  
  // Estado de ejemplo para las conexiones
  const [connections, setConnections] = useState({
    facebook: { connected: false, accountName: '' },
    instagram: { connected: false, accountName: '' },
    whatsapp: { connected: false, accountName: '' },
    telegram: { connected: false, accountName: '' },
    tiktok: { connected: false, accountName: '' },
    linkedin: { connected: false, accountName: '' },
    xing: { connected: false, accountName: '' },
  });

  const handleConnectFacebook = () => {
    // Aquí se llamaría a la Cloud Function `startFacebookAuth`.
    // La función devolvería una URL a la que redirigir al usuario.
    // window.location.href = result.data.authUrl;
    alert('Simulando inicio de conexión con Facebook...');
    
    // Para demostración, simulamos que la conexión fue exitosa después de un tiempo
    setTimeout(() => {
        setConnections(prev => ({...prev, facebook: { connected: true, accountName: 'Mi Página de Facebook' }}));
    }, 2000);
  };
  
    const handleConnectInstagram = () => {
    alert('La conexión con Instagram se gestiona a través de la conexión de la página de Facebook vinculada.');
  };
  
    const handleConnect = (platform: keyof typeof connections) => {
        alert(`Simulando conexión con ${platform}...`);
        setTimeout(() => {
            setConnections(prev => ({ ...prev, [platform]: { connected: true, accountName: `Cuenta de ${platform}` } }));
        }, 1500);
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('marketingSuite.connections.manageTitle')}</CardTitle>
        <CardDescription>{t('marketingSuite.connections.manageDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTitle>{t('marketingSuite.connections.infoTitle')}</AlertTitle>
          <AlertDescription>{t('marketingSuite.connections.infoDescription')}</AlertDescription>
        </Alert>
        
        {/* --- CONEXIONES EXISTENTES --- */}
        <div className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Facebook className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-semibold">Facebook</p>
              <p className="text-sm text-muted-foreground">{connections.facebook.connected ? connections.facebook.accountName : t('marketingSuite.connections.notConnected')}</p>
            </div>
          </div>
          {connections.facebook.connected ? (
             <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t('marketingSuite.connections.connected')}</Badge>
          ) : (
            <Button onClick={handleConnectFacebook}>
              {t('marketingSuite.connections.connectFacebook')}
            </Button>
          )}
        </div>

         <div className="p-4 border rounded-lg flex items-center justify-between bg-muted/50">
          <div className="flex items-center gap-4">
            <Instagram className="h-8 w-8 text-pink-600" />
            <div>
              <p className="font-semibold">Instagram</p>
              <p className="text-sm text-muted-foreground">{connections.instagram.connected ? connections.instagram.accountName : t('marketingSuite.connections.notConnected')}</p>
            </div>
          </div>
          {connections.instagram.connected ? (
             <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t('marketingSuite.connections.connected')}</Badge>
          ) : (
            <Button onClick={handleConnectInstagram} disabled>
              {t('marketingSuite.connections.connectInstagram')}
            </Button>
          )}
        </div>

        {/* --- NUEVAS CONEXIONES --- */}
        <div className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-semibold">WhatsApp</p>
              <p className="text-sm text-muted-foreground">{connections.whatsapp.connected ? connections.whatsapp.accountName : t('marketingSuite.connections.notConnected')}</p>
            </div>
          </div>
          {connections.whatsapp.connected ? (
             <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t('marketingSuite.connections.connected')}</Badge>
          ) : (
            <Button onClick={() => handleConnect('whatsapp')}>Conectar</Button>
          )}
        </div>
        
        <div className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Send className="h-8 w-8 text-sky-500" />
            <div>
              <p className="font-semibold">Telegram</p>
              <p className="text-sm text-muted-foreground">{connections.telegram.connected ? connections.telegram.accountName : t('marketingSuite.connections.notConnected')}</p>
            </div>
          </div>
          {connections.telegram.connected ? (
             <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t('marketingSuite.connections.connected')}</Badge>
          ) : (
            <Button onClick={() => handleConnect('telegram')}>Conectar</Button>
          )}
        </div>
        
        <div className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TikTokIcon className="h-8 w-8 text-foreground" />
            <div>
              <p className="font-semibold">TikTok</p>
              <p className="text-sm text-muted-foreground">{connections.tiktok.connected ? connections.tiktok.accountName : t('marketingSuite.connections.notConnected')}</p>
            </div>
          </div>
          {connections.tiktok.connected ? (
             <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t('marketingSuite.connections.connected')}</Badge>
          ) : (
            <Button onClick={() => handleConnect('tiktok')}>Conectar</Button>
          )}
        </div>
        
        <div className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Linkedin className="h-8 w-8 text-blue-700" />
            <div>
              <p className="font-semibold">LinkedIn</p>
              <p className="text-sm text-muted-foreground">{connections.linkedin.connected ? connections.linkedin.accountName : t('marketingSuite.connections.notConnected')}</p>
            </div>
          </div>
          {connections.linkedin.connected ? (
             <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t('marketingSuite.connections.connected')}</Badge>
          ) : (
            <Button onClick={() => handleConnect('linkedin')}>Conectar</Button>
          )}
        </div>
        
        <div className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Briefcase className="h-8 w-8 text-teal-600" />
            <div>
              <p className="font-semibold">XING</p>
              <p className="text-sm text-muted-foreground">{connections.xing.connected ? connections.xing.accountName : t('marketingSuite.connections.notConnected')}</p>
            </div>
          </div>
          {connections.xing.connected ? (
             <Badge variant="default" className="bg-green-600 hover:bg-green-700">{t('marketingSuite.connections.connected')}</Badge>
          ) : (
            <Button onClick={() => handleConnect('xing')}>Conectar</Button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
