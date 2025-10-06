'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Inbox, Send, FileEdit, Trash2, Mail, Users, Archive, AlertOctagon, Bot, CornerUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- DATOS DE EJEMPLO (se reemplazarán con datos reales de la API de Gmail) ---
const sampleEmails = [
  { id: '1', from: 'info@dicilo.com', subject: 'Bienvenido a nuestro servicio', body: 'Hola, te damos la bienvenida...', date: 'hace 2h', unread: true },
  { id: '2', from: 'soporte@proveedor.com', subject: 'RE: Consulta sobre API', body: 'Estimado cliente, hemos recibido su consulta...', date: 'ayer', unread: false },
  { id: '3', from: 'marketing@evento.com', subject: 'Última oportunidad para registrarte', body: 'No te pierdas el evento del año...', date: 'hace 3d', unread: false },
];
type Email = typeof sampleEmails[0];

const sampleAccounts = [
  { email: 'usuario@gmail.com', type: 'gmail', connected: true }
];

export default function EmailHubPage() {
  const { t } = useTranslation('communications');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(sampleEmails[0]);

  const handleConnectGmail = () => {
    // Esto llamaría a la función `gmail_auth_start` y redirigiría al usuario
    alert('INICIANDO CONEXIÓN CON GMAIL (SIMULACIÓN). Se redirigiría al usuario a la pantalla de consentimiento de Google.');
  };
  
  const handleAiReply = () => {
     alert('ACCIÓN DE IA (SIMULACIÓN). Se analizaría el correo y se generaría una propuesta de respuesta.');
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
      <div className="flex items-center gap-4 mb-4">
        <Mail className="h-8 w-8" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('hub.title')}</h1>
          <p className="text-muted-foreground">{t('hub.description')}</p>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
        
        {/* Panel de Cuentas y Carpetas */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">{t('hub.accounts.title')}</h2>
            {sampleAccounts.map(acc => (
              <div key={acc.email} className="flex items-center gap-3">
                 <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://www.google.com/s2/favicons?domain=gmail.com&sz=32`} />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <div className="truncate">
                    <p className="text-sm font-medium">{acc.email}</p>
                    <p className="text-xs text-green-500">{t('hub.accounts.connected')}</p>
                </div>
              </div>
            ))}
             <Button onClick={handleConnectGmail} className="w-full">{t('hub.accounts.connect')}</Button>
          </div>
          <Separator />
           <div className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">{t('hub.folders.title')}</h2>
            <Button variant="secondary" className="w-full justify-start gap-2"><Inbox /> {t('hub.folders.inbox')} <span className="ml-auto text-xs">1</span></Button>
            <Button variant="ghost" className="w-full justify-start gap-2"><Send /> {t('hub.folders.sent')}</Button>
            <Button variant="ghost" className="w-full justify-start gap-2"><FileEdit /> {t('hub.folders.drafts')}</Button>
            <Button variant="ghost" className="w-full justify-start gap-2"><Trash2 /> {t('hub.folders.trash')}</Button>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />

        {/* Panel de Lista de Correos */}
        <ResizablePanel defaultSize={30} minSize={20}>
            <div className="p-4">
                <Input placeholder={t('hub.searchPlaceholder')} />
            </div>
            <Separator />
             <div className="flex flex-col">
                {sampleEmails.map(email => (
                    <div 
                        key={email.id} 
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${selectedEmail?.id === email.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedEmail(email)}
                    >
                        <div className="flex justify-between items-center">
                            <p className={`font-semibold text-sm ${email.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{email.from}</p>
                            <p className="text-xs text-muted-foreground">{email.date}</p>
                        </div>
                        <p className="text-sm truncate">{email.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">{email.body}</p>
                    </div>
                ))}
            </div>
        </ResizablePanel>

        <ResizableHandle withHandle />
        
        {/* Panel de Visor de Correo */}
        <ResizablePanel defaultSize={50} minSize={30}>
            {selectedEmail ? (
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold">{selectedEmail.subject}</h2>
                        <p className="text-sm text-muted-foreground">De: {selectedEmail.from}</p>
                    </div>
                     <div className="flex-grow p-4 overflow-y-auto">
                        <p>{selectedEmail.body}</p>
                        <br/><p>...</p>
                    </div>
                    <Separator/>
                     <div className="p-4 space-y-3">
                         <Textarea placeholder={t('hub.reply.placeholder')} rows={5}/>
                         <div className="flex justify-between">
                            <Button><Send className="mr-2 h-4 w-4"/> {t('hub.reply.send')}</Button>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" onClick={handleAiReply}><Bot className="mr-2 h-4 w-4"/> {t('hub.reply.aiAssist')}</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('hub.reply.aiTooltip')}</p>
                                    </TooltipContent>
                                </Tooltip>
                             </TooltipProvider>
                         </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">{t('hub.noEmailSelected')}</p>
                </div>
            )}
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}
