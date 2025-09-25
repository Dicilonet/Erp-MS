
import type { CustomerPlanId, CustomerService } from './types';

// NOTE: This file is now unused on the client-side for service creation,
// as this logic is handled by the `onCustomerCreate` Cloud Function.
// It is kept here for reference or for potential future use cases where
// displaying plan details on the client might be necessary.
const planTemplates: Record<CustomerPlanId, Omit<CustomerService, 'nextDueDate'>[]> = {
  plan_privatkunde: [
    {
      serviceId: 'newsletter_ofertas',
      serviceName: 'Newsletter con ofertas actuales',
      status: 'Activo',
      frequency: 'recurrente',
      details: {
        notes: 'Cliente suscrito a la lista de correo general de ofertas.',
      },
    },
    {
      serviceId: 'soporte_tecnico',
      serviceName: 'Soporte Técnico',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {
        notes: 'Soporte técnico disponible a través del canal de contacto general.',
      },
    },
  ],
  plan_spender: [
    {
      serviceId: 'newsletter_ofertas',
      serviceName: 'Newsletter con ofertas actuales',
      status: 'Activo',
      frequency: 'recurrente',
      details: {},
    },
    {
      serviceId: 'registro_productos',
      serviceName: 'Registro de Productos',
      status: 'Activo',
      frequency: 'anual',
      details: {
        limit: 24,
        registeredCount: 0,
        notes: 'El cliente puede registrar hasta 24 productos al año.',
      },
    },
    {
      serviceId: 'newsletter_recomendacion',
      serviceName: 'Newsletter de Recomendación',
      status: 'Pendiente',
      frequency: 'único',
      details: {
        notes: 'Coordinar con el cliente el contenido para el newsletter de recomendación.',
      },
    },
    {
      serviceId: 'posts_redes_sociales',
      serviceName: 'Publicaciones en Redes Sociales',
      status: 'Pendiente',
      frequency: 'anual',
      details: {
        limit: 16,
        postsCount: 0,
        notes: 'El cliente tiene derecho a 16 posts en total durante el año.',
      },
    },
    {
      serviceId: 'formulario_registro',
      serviceName: 'Formulario de Registro',
      status: 'Activo',
      frequency: 'único',
      details: {
        type: 'General',
        url: '',
      },
    },
    {
      serviceId: 'soporte_email',
      serviceName: 'Soporte por Email (Lunes - Viernes)',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {},
    },
  ],
  plan_einzelhandler: [
    {
      serviceId: 'newsletter_ofertas',
      serviceName: 'Newsletter con ofertas actuales',
      status: 'Activo',
      frequency: 'recurrente',
      details: {},
    },
    {
      serviceId: 'registro_productos',
      serviceName: 'Registro de Productos o Servicios',
      status: 'Activo',
      frequency: 'anual',
      details: {
        limit: 300,
        registeredCount: 0,
        categoryLimit: 4,
        categoriesUsed: 0,
        notes: 'Límite de 300 productos en hasta 4 categorías.',
      },
    },
    {
      serviceId: 'newsletter_recomendacion',
      serviceName: 'Newsletter de Recomendación (Prospectos)',
      status: 'Pendiente',
      frequency: '2 por mes',
      details: {
        notes: 'Agendar los 2 envíos mensuales.',
      },
    },
    {
      serviceId: 'herramientas_graficas',
      serviceName: 'Herramientas de Gráficos Online',
      status: 'Activo',
      frequency: 'constante',
      details: {
        notes: 'El cliente tiene acceso a las herramientas de diseño.',
      },
    },
    {
      serviceId: 'cursos_ki',
      serviceName: 'Cursos de K.I.',
      status: 'Pendiente',
      frequency: '4 por año',
      details: {
        notes: 'Agendar la participación del cliente en 4 cursos durante el año.',
      },
    },
    {
      serviceId: 'estadistica_landing',
      serviceName: 'Estadística de Landing Page',
      status: 'Pendiente',
      frequency: '1 por mes',
      details: {
        notes: 'Preparar y enviar el informe estadístico mensual.',
      },
    },
    {
      serviceId: 'posts_redes_sociales',
      serviceName: 'Publicaciones en Redes Sociales',
      status: 'Pendiente',
      frequency: 'mensual',
      details: {
        limit: 60,
        postsThisMonth: 0,
        channelLimit: 3,
        channels: [],
      },
    },
    {
      serviceId: 'asistente_ki_chatbot',
      serviceName: 'Asistente K.I. (Chatbot)',
      status: 'Pendiente',
      frequency: 'único',
      details: {
        notes: 'Configurar e implementar el chatbot general.',
        url: '',
      },
    },
    {
      serviceId: 'soporte_tecnico',
      serviceName: 'Soporte Técnico',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {},
    },
    {
      serviceId: 'soporte_email',
      serviceName: 'Soporte por Email (Lunes - Viernes)',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {},
    },
  ],
  plan_premium: [
    {
      serviceId: 'newsletter_ofertas',
      serviceName: 'Newsletter con ofertas actuales',
      status: 'Activo',
      frequency: 'recurrente',
      details: {},
    },
    {
      serviceId: 'registro_productos',
      serviceName: 'Registro de Productos o Servicios',
      status: 'Activo',
      frequency: 'anual',
      details: {
        limit: 600,
        registeredCount: 0,
        categoryLimit: 14,
        categoriesUsed: 0,
        notes: 'Límite de 600 productos en hasta 14 categorías.',
      },
    },
    {
      serviceId: 'newsletter_recomendacion',
      serviceName: 'Newsletter de Recomendación (Comunidad Dicilo)',
      status: 'Pendiente',
      frequency: '2 por mes',
      details: {
        notes: 'Agendar los 2 envíos mensuales a la comunidad general.',
      },
    },
    {
      serviceId: 'edicion_graficos',
      serviceName: 'Edición de Gráficos',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {
        notes: 'Servicio de edición de gráficos disponible para el cliente.',
      },
    },
    {
      serviceId: 'edicion_textos',
      serviceName: 'Edición de Textos',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {
        notes: 'Servicio de edición de textos disponible para el cliente.',
      },
    },
    {
      serviceId: 'cursos_ki_individuales',
      serviceName: 'Cursos de K.I. Individuales',
      status: 'Pendiente',
      frequency: '1 por mes',
      details: {
        notes: 'Agendar el curso individual mensual con el cliente.',
      },
    },
    {
      serviceId: 'estadistica_landing',
      serviceName: 'Estadística de Landing Page',
      status: 'Pendiente',
      frequency: '2 por mes',
      details: {
        notes: 'Preparar y enviar los 2 informes estadísticos mensuales.',
      },
    },
    {
      serviceId: 'presentacion_online',
      serviceName: 'Presentación Online',
      status: 'Pendiente',
      frequency: '6 por año',
      details: {
        notes: 'Agendar las 6 presentaciones online durante el año.',
      },
    },
    {
      serviceId: 'posts_redes_sociales',
      serviceName: 'Publicaciones en Redes Sociales',
      status: 'Pendiente',
      frequency: 'mensual',
      details: {
        limit: 120,
        postsThisMonth: 0,
        channelLimit: 6,
        channels: [],
      },
    },
    {
      serviceId: 'formulario_registro',
      serviceName: 'Formulario de Registro Individual',
      status: 'Pendiente',
      frequency: 'único',
      details: {
        type: 'Individual',
        url: '',
        notes: 'Desarrollar y entregar el formulario personalizado.',
      },
    },
    {
      serviceId: 'asistente_ki_individual',
      serviceName: 'Asistente K.I. Individual en Landing Page',
      status: 'Pendiente',
      frequency: 'único',
      details: {
        notes: 'Configurar e implementar el chatbot personalizado en la web del cliente.',
        url: '',
      },
    },
    {
      serviceId: 'soporte_premium',
      serviceName: 'Soporte Premium (Individual)',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {
        notes: 'Acceso a soporte premium, no artificial.',
      },
    },
    {
      serviceId: 'soporte_whatsapp',
      serviceName: 'Soporte por WhatsApp (Lunes - Sábado)',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {},
    },
    {
      serviceId: 'soporte_email',
      serviceName: 'Soporte por Email (Lunes - Sábado)',
      status: 'Activo',
      frequency: 'bajo demanda',
      details: {},
    },
  ],
};
