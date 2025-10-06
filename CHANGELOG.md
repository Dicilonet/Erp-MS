# Bitácora de Cambios del ERP Dicilo

Este documento sirve como un registro manual de los cambios significativos realizados en el proyecto. El objetivo es mantener un historial claro para facilitar la depuración, la planificación y el seguimiento del desarrollo.

---
## 05 de Septiembre de 2024

### 1. [ID de Cambio: 05s2e1g0] Creación de Plantilla Avanzada para Audiología (Gesundheit)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad y muy especializada, diseñada para el sector de la audiología (centros auditivos, audioprotesistas), dentro de la categoría "Gesundheit & Wellness".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/gesundheit-2` y se creó una arquitectura de componentes dedicados en `src/components/landing/gesundheit-2/` para cada sección clave.
    2.  **Diseño Profesional y Centrado en el Paciente:** La plantilla está diseñada para inspirar confianza, profesionalismo y empatía. Incluye:
        *   **Hero Section Inspirador:** Una imagen que transmite la alegría de volver a oír bien.
        *   **Sección de Servicios:** Detalla los servicios esenciales como pruebas auditivas, adaptación de audífonos y mantenimiento.
        *   **Galería de Videos con Consejos:** Un apartado para incrustar **videos de YouTube** que ofrecen consejos prácticos sobre el cuidado y limpieza de los audífonos.
        *   **Galería de Productos:** Un carrusel visual para mostrar los modelos de audífonos más modernos y discretos.
        *   **Sección de Reservas con Calendario Incrustado:** Una de las características más potentes. Se ha integrado una sección que permite **incrustar un widget de Calendly o Google Calendar**, facilitando a los pacientes la reserva de citas de forma directa y sin fricción.
        *   **Formulario de Recomendación:** Integrado para que los pacientes satisfechos puedan referir a familiares y amigos.
    3.  **Actualización de la Biblioteca y Traducciones:** Se actualizó la página principal de "Landing Pages" para incluir el enlace a esta nueva plantilla especializada y se añadieron las claves de traducción correspondientes.

*   **¿Por qué se hizo?** Para dotar al catálogo de una solución de nicho muy demandada y de alto valor, proporcionando a los centros auditivos una herramienta de marketing digital completa que no solo educa y genera confianza, sino que también optimiza la captación de pacientes a través de un sistema de reservas online directo y un programa de referidos.

---
## 04 de Septiembre de 2024

### 1. [ID de Cambio: 04s3e1f9] Creación de Plantilla Avanzada para ONGs y Causas Sociales (Soziales)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada para ser altamente adaptable al sector "Social y ONGs", dentro de la categoría "Soziales".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/soziales-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/soziales-1/` para cada sección (Hero, Misión y Prioridades, Galería de Medios Mixtos, Cómo Ayudar, Formulario de Contacto y Formulario de Recomendación).
    2.  **Diseño Enfocado en la Misión:** La plantilla está diseñada para inspirar confianza y motivar a la acción. Incluye:
        *   **Hero Section Inspirador:** Una imagen o video potente que comunica la misión de la organización.
        *   **Galería de Medios Mixtos:** Al igual que en la plantilla de música, esta sección permite mostrar tanto **imágenes** como **videos de YouTube incrustados**, ideal para mostrar el impacto de los proyectos, testimonios y reportajes.
        *   **Sección de "Cómo Ayudar":** Un apartado claro con llamados a la acción para donar, hacerse voluntario o difundir la causa.
        *   **Formulario de Recomendación Integrado:** El formulario se presenta como una herramienta clave para que los simpatizantes inviten a otros a unirse, amplificando el alcance de la organización.
        *   **Doble Formulario:** Se integra un formulario de contacto para consultas generales y el de recomendación para la captación de nuevos miembros.
    3.  **Actualización de la Biblioteca y Traducciones:** Se actualizó la página principal de "Landing Pages" para incluir el enlace a esta nueva plantilla y se añadieron las claves de traducción para la nueva categoría "Soziales & NGOs" en español, inglés y alemán.

*   **¿Por qué se hizo?** Para dotar a la biblioteca de una solución profesional y muy necesaria para el tercer sector, proporcionando una herramienta de marketing que no solo comunica eficazmente la misión de una ONG, sino que también facilita la captación de donaciones, voluntarios y el crecimiento orgánico a través de un sistema de referidos.

---
## 03 de Septiembre de 2024

### 1. [ID de Cambio: 03s4e9f8] Creación de Plantilla Avanzada para Música y Eventos (Musik)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada para ser altamente adaptable al sector de "Música" (artistas, bandas, festivales), dentro de la categoría "Musik".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/musik-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/musik-1/` para cada sección (Hero con video de fondo, Sobre Nosotros, Galería de Medios, Eventos, Testimonios y Formulario de Recomendación).
    2.  **Diseño Inmersivo y Funcional:** La plantilla está diseñada para ser visualmente impactante y muy funcional, integrando herramientas de marketing clave. Incluye:
        *   **Hero Section con Video:** Un potente video de fondo para crear una experiencia inmersiva desde el primer momento.
        *   **Galería de Medios Mixtos:** Una sección que permite mostrar tanto **imágenes** como **videos de YouTube incrustados**, perfecta para galerías de fotos, videoclips y making-ofs.
        *   **Sección de Eventos con Mapa Interactivo:** Un listado de los próximos conciertos, donde al seleccionar uno, se muestra su ubicación en un mapa dinámico de Leaflet.
        *   **Integración Conceptual de Cupones:** Se añadió una referencia visual en la sección de eventos para recordar a los usuarios que pueden usar cupones de descuento, conectando la landing con el módulo de marketing de cupones.
        *   **Formulario de Recomendación Integrado:** La plantilla incluye el formulario de recomendación, convirtiéndola en una herramienta para que los fans inviten a sus amigos y expandan la comunidad.
    3.  **Actualización de la Biblioteca y Traducciones:** Se actualizó la página principal de "Landing Pages" para incluir el enlace a esta nueva plantilla y se añadieron las claves de traducción para la nueva categoría "Música" en español, inglés y alemán.

*   **¿Por qué se hizo?** Para enriquecer la biblioteca con una solución profesional y muy demandada por el sector musical, proporcionando una herramienta de marketing que no solo promociona al artista, sino que también facilita la venta de entradas, la interacción con los fans y el crecimiento orgánico a través de un sistema de referidos.

---
## 02 de Septiembre de 2024

### 1. [ID de Cambio: 02s5e8f7] Creación de Plantilla Avanzada para Servicios Financieros (Finanzdienstleistungen)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada para ser altamente adaptable al sector de "Servicios Financieros" (asesores, coaches, fintechs), dentro de la categoría "Finanzdienstleistungen".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/finanz-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/finanz-1/` para cada sección (Hero, Servicios, Sobre Mí, Filosofía, Testimonios, Formulario de Contacto y Formulario de Recomendación).
    2.  **Diseño Profesional y Confiable:** La plantilla está diseñada para inspirar confianza, seriedad y profesionalismo, elementos clave en el sector financiero. Incluye:
        *   **Hero Section:** Una imagen potente con un titular claro ("Construye tu Futuro Financiero") y llamados a la acción.
        *   **Cuadrícula de Servicios:** Una sección visual para destacar las áreas de especialización (Planificación de Jubilación, Asesoría de Inversiones, Gestión de Patrimonio, etc.).
        *   **Perfil del Asesor (Sobre Mí):** Un espacio dedicado para que el profesional conecte con el cliente, mostrando su experiencia y enfoque.
        *   **Formulario de Recomendación Integrado:** La plantilla incluye el formulario de recomendación, convirtiéndola en una herramienta de marketing y crecimiento orgánico.
        *   **Doble Formulario:** Se integra tanto un formulario de contacto para solicitar consultas como el de recomendación.
        *   **Galería de Imágenes:** Se añadió una galería visual para reforzar la imagen de profesionalismo y éxito.
    3.  **Actualización de la Biblioteca y Traducciones:** Se actualizó la página principal de "Landing Pages" para incluir el enlace a esta nueva plantilla y se añadieron las claves de traducción para la nueva categoría "Servicios Financieros" en español, inglés y alemán.

*   **¿Por qué se hizo?** Para enriquecer la biblioteca con una solución profesional y muy demandada para el sector financiero, proporcionando una herramienta de marketing que no solo genera confianza, sino que también integra activamente la captación de leads y la viralización a través de un sistema de referidos.

---
## 01 de Septiembre de 2024

### 1. [ID de Cambio: 01s9e8f7] Creación de Plantilla Avanzada para Educación (Bildung)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada para ser altamente adaptable al sector de "Educación" (academias, escuelas de arte, música, idiomas, etc.), dentro de la categoría de "Bildung".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/bildung-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/bildung-1/` para cada sección (Hero, Cursos, Metodología, Galería, Testimonios, Formulario de Información y Formulario de Recomendación).
    2.  **Diseño Adaptable y Profesional:** La plantilla está diseñada para inspirar confianza y ser fácilmente personalizable para diferentes tipos de centros educativos. Incluye:
        *   **Hero Section:** Una imagen inspiradora con un titular claro ("El Futuro Comienza Aquí") y llamados a la acción.
        *   **Cuadrícula de Cursos:** Una sección visual para destacar los principales programas formativos (Arte, Música, Idiomas, Tecnología, etc.).
        *   **Metodología y Galería:** Espacios para explicar el enfoque pedagógico y mostrar la vida en el centro a través de un carrusel de imágenes.
        *   **Doble Formulario:** Se han integrado dos formularios clave:
            *   Un **Formulario de Información** para que los interesados puedan solicitar detalles sobre los cursos.
            *   El **Formulario de Recomendación**, permitiendo a la comunidad educativa invitar a nuevos alumnos y obtener recompensas.
    3.  **Actualización de la Biblioteca y Traducciones:** Se actualizó la página principal de "Landing Pages" para incluir el enlace a esta nueva plantilla y se añadieron las claves de traducción para la nueva categoría "Educación" en español, inglés y alemán.

*   **¿Por qué se hizo?** Para enriquecer la biblioteca con una solución profesional y muy versátil para el amplio sector educativo, proporcionando una herramienta de marketing digital que no solo informa, sino que también integra activamente la captación de leads y la viralización a través de un sistema de referidos.

---
## 31 de Agosto de 2024

### 1. [ID de Cambio: 31a2b3c4] Creación de Plantilla Avanzada para Moda y Ropa (Kleidung)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada específicamente para el sector de "Moda y Ropa", dentro de la categoría de "Kleidung".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/kleidung-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/kleidung-1/` para cada sección (Hero, Colección, Sobre Nosotros, Testimonios, Formulario de Recomendación y Ubicación).
    2.  **Diseño Visual y Moderno:** La plantilla está diseñada para ser elegante, visualmente atractiva y centrada en el producto. Incluye:
        *   **Hero Section:** Una imagen de moda potente con un titular claro ("Viste tu Estilo, Define tu Momento") y llamados a la acción.
        *   **Galería de Colección:** Un carrusel dinámico para destacar las últimas prendas y looks.
        *   **Formulario de Recomendación Integrado:** Se ha añadido una sección completa que contiene el formulario de recomendación, permitiendo a los clientes invitar a sus amigos y ganar recompensas, convirtiendo la landing en una herramienta de marketing viral.
        *   **Testimonios de Clientes:** Prueba social para reforzar la credibilidad de la marca.
        *   **Ubicación y Contacto:** Un mapa interactivo para la tienda física y un formulario de contacto para consultas.
    .  **Actualización de la Biblioteca y Traducciones:** Se actualizó la página principal de "Landing Pages" para incluir el enlace a esta nueva plantilla y se añadieron las claves de traducción para la nueva categoría "Moda y Ropa" en español, inglés y alemán.

*   **¿Por qué se hizo?** Para enriquecer la biblioteca con una solución profesional y específica para el competitivo sector de la moda, proporcionando una herramienta de marketing digital que no solo exhibe productos de manera atractiva, sino que también integra activamente la captación de nuevos clientes a través de un sistema de referidos.

---
## 30 de Agosto de 2024

### 1. [ID de Cambio: 30g3e4b7] Implementación del Dashboard y Formulario de Recomendaciones

*   **¿Qué se hizo?** Se implementó un nuevo módulo completo de "Formularios de Recomendación", diseñado para ser el núcleo de las campañas de marketing de las landing pages de los clientes, permitiendo la viralización y seguimiento de referidos.
    1.  **Nuevo Dashboard de Formularios:** Se creó la ruta `/admin/forms-dashboard` para centralizar la gestión y visualización de todos los formularios de recomendación, con pestañas para "Resumen", "Recomendadores", "Recomendados", "Reportes" y "Ajustes".
    2.  **Formulario de Recomendación Avanzado:** Se desarrolló un componente de formulario reutilizable que incluye:
        *   Campos para los datos del recomendador (nombre, email).
        *   Opción para recomendar a múltiples amigos, con validación de email o WhatsApp.
        *   Selección de productos/servicios a recomendar.
        *   Campos de consentimiento de privacidad y términos legales.
        *   Lógica de validación con `zod` y gestión de estado con `react-hook-form`.
    3.  **Integración en la Ficha del Cliente:** Se preparó la estructura para que este formulario sea visible y gestionable desde una nueva pestaña en la página de edición de cada cliente (próximo paso).
    4.  **Formulario Incrustable:** Se creó la ruta `src/app/forms/embed/[clientId]/page.tsx` que servirá como la versión pública del formulario para ser insertada mediante un `<iframe>` en las landing pages.
    5.  **Backend para Envíos:** Se creó la Cloud Function `submitRecommendation` para recibir y procesar los datos de los formularios de forma segura.
    6.  **Traducciones Completas:** Se añadieron los archivos `forms.json` y `legal.json` con todas las claves de texto necesarias en español, inglés y alemán.
    7.  **Acceso desde el Menú de Marketing:** Se añadió un enlace directo al nuevo "Dashboard de Formularios" en el menú de navegación del módulo de Marketing para un acceso fácil y rápido.

*   **¿Por qué se hizo?** Para transformar las landing pages de simples páginas informativas a potentes herramientas de marketing viral. Este sistema no solo captura nuevos leads a través de recomendaciones, sino que también establece la infraestructura necesaria para un futuro sistema de comisiones y análisis de rendimiento de campañas, aportando un valor incalculable a los clientes del ERP.

---
## 29 de Agosto de 2024

### 1. [ID de Cambio: 29f2d3a6] Creación del Módulo de Campañas de Marketing

*   **¿Qué se hizo?** Se implementó un nuevo módulo de "Campañas" dentro de la sección de Marketing, sentando las bases para un sistema de seguimiento y gestión de las landing pages de los clientes.
    1.  **Nueva Página y Componentes:** Se desarrolló la ruta `/marketing/campaigns` y se crearon los componentes `CampaignDashboard` y `CampaignDetailView` para construir la interfaz.
    2.  **Dashboard Interactivo:** La página principal del módulo permite seleccionar un cliente de una lista con buscador. Una vez seleccionado, se muestra un panel con los detalles de su "campaña" (actualmente simulado).
    3.  **Vista de Detalle de Campaña:** Este panel centraliza la información relevante para el cliente, incluyendo:
        *   Listas de tareas (Hecho, Por Hacer, Próximos Pasos) para organizar el trabajo.
        *   Una sección de "Herramientas de Marketing" con accesos directos a otros módulos como Cupones, Diseñador, etc., para facilitar la ejecución de acciones específicas para ese cliente.
    4.  **Navegación y Traducciones:** Se añadió una nueva pestaña "Campañas" a la barra de navegación del módulo de Marketing y se incluyeron todas las claves de texto necesarias en los archivos de internacionalización (`es`, `en`, `de`).

*   **¿Por qué se hizo?** Para crear un centro de control que permita a los administradores del ERP gestionar las landing pages de sus clientes como campañas de marketing activas. Esto no solo organiza el flujo de trabajo, sino que también establece la infraestructura necesaria para futuras integraciones de analíticas de rendimiento (visitas, clics, conversiones del formulario de recomendación).

---
## 28 de Agosto de 2024

### 1. [ID de Cambio: 28e2f9c5] Creación de Plantilla Avanzada para Servicios de Mascotas (Haustiere)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada específicamente para el sector de "Mascotas" (peluquerías caninas, guarderías, adiestradores), dentro de la categoría de "Haustiere".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/haustiere-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/haustiere-1/` para cada sección (Hero, Servicios, Sobre Nosotros, Galería, Testimonios, Contacto, Ubicación y Footer). Este enfoque modular mejora la mantenibilidad y reutilización del código.
    2.  **Diseño Amigable y Profesional:** La plantilla está diseñada para inspirar confianza y amor por los animales. Incluye:
        *   **Hero Section:** Una imagen emotiva con un titular claro ("El Mejor Cuidado para tu Mejor Amigo") y llamados a la acción.
        *   **Sección de Servicios:** Una cuadrícula visual para destacar los principales servicios (Peluquería, Guardería, Adiestramiento).
        *   **Sobre Nosotros:** Un espacio para contar la historia del negocio y su pasión por los animales.
        *   **Galería de Clientes Felices:** Un carrusel de imágenes para mostrar a las mascotas disfrutando de las instalaciones y servicios.
        *   **Testimonios de Dueños:** Prueba social para reforzar la credibilidad y la calidad del cuidado.
        *   **Ubicación y Contacto:** Un mapa interactivo para localizar el centro, junto con un formulario de contacto para citas o consultas.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir un enlace a esta nueva plantilla en la categoría de "Mascotas".

*   **¿Por qué se hizo?** Para enriquecer la biblioteca con una solución profesional y específica para el creciente sector de servicios para mascotas, proporcionando una herramienta de marketing digital que facilita la captación de clientes y la presentación de sus servicios de manera efectiva y emotiva.

---
## 27 de Agosto de 2024

### 1. [ID de Cambio: 27d1e8b4] Creación de Plantilla Avanzada para Tiendas de Alimentación (Lebensmittel)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada específicamente para el sector de "Alimentación" (tiendas de productos locales, fruterías, quioscos, pequeños supermercados), dentro de la categoría de "Lebensmittel".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/lebensmittel-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/lebensmittel-1/` para cada sección (Hero, Filosofía, Productos, Galería, Ofertas, Testimonios, Ubicación y Footer). Este enfoque modular mejora la mantenibilidad y reutilización del código.
    2.  **Diseño Fresco y Funcional:** La plantilla está diseñada para transmitir calidad, frescura y confianza. Incluye:
        *   **Hero Section:** Una imagen atractiva de productos frescos con un titular claro ("Del Campo a tu Mesa") y llamados a la acción.
        *   **Sección de Filosofía:** Un espacio para contar la historia del negocio y su compromiso con los productos locales.
        *   **Productos Destacados:** Una cuadrícula visual para resaltar los tipos de productos ofrecidos (Verduras, Frutas, Pan, etc.).
        *   **Galería Deslizable:** Un carrusel de imágenes para mostrar la tienda, el ambiente y la variedad de productos.
        *   **Ofertas Semanales:** Una sección para anunciar promociones y atraer clientes.
        *   **Testimonios de Clientes:** Prueba social para reforzar la credibilidad y la conexión con la comunidad.
        *   **Ubicación y Contacto:** Un mapa interactivo para localizar la tienda, junto con un formulario de contacto para pedidos o consultas.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir un enlace a esta nueva plantilla en la categoría de "Alimentación".

*   **¿Por qué se hizo?** Para enriquecer la biblioteca con una solución específica y profesional para el sector de la alimentación local, proporcionando una herramienta robusta que facilita la captación de clientes y la presentación de productos frescos de manera efectiva.

---
## 26 de Agosto de 2024

### 1. [ID de Cambio: 26c9d4a3] Creación de Plantilla Avanzada para Consultoría (Beratung)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada específicamente para el sector de "Consultoría" (coaches, asesores, terapeutas), dentro de la categoría de "Beratung".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/beratung-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/beratung-1/` para cada sección (Hero, Servicios, Sobre mí, Galería, Testimonios, Formulario de Reserva y Footer). Este enfoque modular mejora la mantenibilidad y reutilización del código.
    2.  **Diseño Profesional y Funcional:** La plantilla está diseñada para inspirar confianza y profesionalismo. Incluye:
        *   **Hero Section:** Una imagen potente con un titular claro ("Alcanza tu Máximo Potencial") y botones de llamado a la acción.
        *   **Áreas de Especialización:** Una sección visual para destacar los principales servicios ofrecidos (Coaching Personal, Asesoría Profesional, Terapia Familiar, etc.).
        *   **Galería Deslizable:** Un carrusel de imágenes para mostrar la consulta, retratos o momentos de sesiones.
        *   **Testimonios de Clientes:** Prueba social para reforzar la credibilidad.
        *   **Formulario de Reserva con Selector:** Un formulario optimizado para que los clientes soliciten una sesión, permitiéndoles seleccionar el área de interés (Terapia, Legal, Finanzas, etc.) desde un menú desplegable.
        *   **Mapa de Ubicación:** Un mapa interactivo para mostrar la ubicación de la consulta.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir un enlace a esta nueva plantilla en la categoría de "Consultoría".

*   **¿Por qué se hizo?** Para enriquecer la biblioteca con una solución específica y profesional para el sector de la consultoría y el coaching, proporcionando una herramienta robusta que facilita la captación de clientes y la presentación de servicios especializados de manera efectiva.

---
## 25 de Agosto de 2024

### 1. [ID de Cambio: 25b8d3a2] Creación de Plantilla Avanzada para Tours Urbanos (Reisen)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada específicamente para el sector de "Tours Urbanos" (autobuses turísticos, paseos en barco, etc.), dentro de la categoría de "Reisen".
    1.  **Nueva Página y Arquitectura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/reisen-2` y se creó una arquitectura de componentes dedicados en `src/components/landing/reisen-2/` para cada sección (Hero, Tipos de Tours, Galería, Testimonios, Formulario de Reserva, Mapa y Footer). Este enfoque modular mejora la mantenibilidad y reutilización del código.
    2.  **Diseño Dinámico y Funcional:** La plantilla está diseñada para inspirar aventura y confianza. Incluye:
        *   **Hero Section:** Una imagen evocadora de un tour con un titular claro y botones de llamado a la acción.
        *   **Cuadrícula de Tipos de Tours:** Una sección visual para destacar los principales tipos de tours ofrecidos (Bus, Barco, A Pie, Nocturno).
        *   **Galería Deslizable:** Un carrusel de imágenes para mostrar la experiencia de los tours.
        *   **Testimonios de Viajeros:** Prueba social para reforzar la credibilidad.
        *   **Formulario de Reserva:** Optimizado para que los clientes soliciten información sobre un tour específico.
        *   **Mapa de Ubicación:** Un mapa interactivo para mostrar el punto de encuentro de los tours.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir un enlace a esta nueva plantilla en la categoría de "Viajes", ofreciendo ahora dos opciones distintas.

*   **¿Por qué se hizo?** Para diversificar la oferta de plantillas dentro de la categoría "Viajes", proporcionando una solución específica y profesional para operadores de tours urbanos, que tienen necesidades de presentación distintas a las de una agencia de viajes general.

---
## 24 de Agosto de 2024

### 1. [ID de Cambio: 24a7b8c9] Mejora de Plantilla de Cafetería: Galería de Imágenes

*   **¿Qué se hizo?** Se añadió una nueva sección de "Galería" a la plantilla de landing page de "Cafeterías" para mejorar su atractivo visual y mostrar el ambiente del local.
    1.  **Nuevo Componente de Galería:** Se desarrolló un componente `GallerySection` que implementa un carrusel de imágenes deslizable y responsivo.
    2.  **Integración en la Página:** Se actualizó la página principal de la plantilla (`gastronomia-2/page.tsx`) para incluir esta nueva sección, ubicándola estratégicamente para enriquecer la experiencia del usuario.

*   **¿Por qué se hizo?** Para corregir la omisión de la galería en la versión inicial y para enriquecer la plantilla, proporcionando un espacio visual clave para que los negocios de cafetería muestren su ambiente, un factor decisivo para los clientes.

---
## 23 de Agosto de 2024

### 1. [ID de Cambio: 23d6f8a9] Creación de Plantilla Avanzada para Cafeterías

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, diseñada específicamente para el sector de "Cafeterías, Panaderías y Pastelerías", dentro de la categoría de "Gastronomía".
    1.  **Nueva Página y Estructura Modular:** Se desarrolló la ruta `/articulos/landing-pages/gastronomia-2` y se creó un componente de página completo que incluye secciones clave para este tipo de negocio.
    2.  **Diseño Acogedor y Funcional:** La plantilla está diseñada para transmitir calidez y apetito. Incluye:
        *   **Hero Section:** Una imagen evocadora con un titular claro ("El Arte de un Buen Café") y llamados a la acción.
        *   **Nuestra Pasión:** Una sección para contar la historia y la filosofía del café.
        *   **Galería de Productos Estrella:** Una cuadrícula visual para destacar los productos más populares como croissants, lattes, tartas y pan artesanal.
        *   **Testimonios de Clientes:** Prueba social para reforzar la conexión con la comunidad.
        *   **Formulario de Contacto:** Un formulario sencillo para consultas generales o pedidos.
        *   **Mapa de Ubicación:** Un mapa interactivo para facilitar la localización del establecimiento.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir un enlace a esta nueva plantilla, mostrando dos opciones dentro de la categoría "Gastronomía".

*   **¿Por qué se hizo?** Para diversificar la oferta de plantillas dentro de la categoría "Gastronomía", proporcionando una solución específica y profesional para cafeterías y negocios similares, que tienen necesidades de presentación distintas a las de un restaurante tradicional.

---
## 22 de Agosto de 2024

### 1. [ID de Cambio: 22c5e6f7] Mejora de Plantilla Wellness: Galería de Imágenes

*   **¿Qué se hizo?** Se añadió una nueva sección de "Galería" a la plantilla de landing page de "Wellness y Masajes" para mejorar su atractivo visual y mostrar las instalaciones.
    1.  **Nuevo Componente de Galería:** Se desarrolló un componente `GallerySection` que implementa un carrusel de imágenes deslizable y responsivo.
    2.  **Integración en la Página:** Se actualizó la página principal de la plantilla (`wellness-1/page.tsx`) para incluir esta nueva sección, ubicándola estratégicamente para enriquecer la experiencia del usuario.

*   **¿Por qué se hizo?** Para responder a la necesidad de mostrar de manera más efectiva el ambiente y las instalaciones del centro de bienestar, un factor clave en la decisión de los clientes para este tipo de servicio.

---
## 21 de Agosto de 2024

### 1. [ID de Cambio: 21a4e5f6] Creación de Plantilla Avanzada para Wellness y Masajes

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada específicamente para el sector de "Wellness" (Bienestar y Masajes), dentro de la categoría de "Gesundheit".
    1.  **Nueva Página y Estructura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/wellness-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/wellness-1/` para cada sección (Hero, Tratamientos, Filosofía, Productos, Testimonios, Formulario de Contacto, Mapa y Footer). Este enfoque modular mejora la mantenibilidad y reutilización del código.
    2.  **Diseño Relajante y Profesional:** La plantilla está diseñada para transmitir calma, confianza y profesionalismo. Incluye:
        *   **Hero Section:** Una imagen evocadora con un titular claro y un llamado a la acción ("Reservar Masaje").
        *   **Cuadrícula de Tratamientos:** Una sección visual para destacar los principales tipos de masajes ofrecidos.
        *   **Filosofía del Centro:** Un espacio para contar la historia y el enfoque del centro de bienestar.
        *   **Escaparate de Productos:** Una sección para mostrar productos relacionados como aceites esenciales o tarjetas de regalo.
        *   **Testimonios de Clientes:** Prueba social para reforzar la credibilidad.
        *   **Formulario de Contacto:** Optimizado para que los clientes soliciten información o citas.
        *   **Mapa de Ubicación:** Un mapa interactivo para facilitar la localización del centro.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir un enlace a esta nueva plantilla en la categoría de "Salud y Bienestar".

*   **¿Por qué se hizo?** Para enriquecer la biblioteca de plantillas con una solución profesional y específica para el creciente sector del bienestar, proporcionando a los clientes una herramienta de marketing digital robusta y lista para ser desplegada, capaz de atraer clientes y presentar sus servicios de manera efectiva y relajante.

---
## 20 de Agosto de 2024

### 1. [ID de Cambio: 20a1b2c3] Creación de Plantilla Avanzada para Sector Salud (Gesundheit)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad, modular y profesional, diseñada específicamente para el sector de la salud (clínicas, consultorios médicos, dentistas, etc.), bajo la categoría "Gesundheit".
    1.  **Nueva Página y Estructura de Componentes:** Se desarrolló la ruta `/articulos/landing-pages/gesundheit-1` y se creó una arquitectura de componentes dedicados en `src/components/landing/gesundheit-1/` para cada sección (Hero, Servicios, Equipo, Productos, Testimonios, Formulario de Contacto, Mapa y Footer). Este enfoque modular mejora la mantenibilidad y reutilización del código.
    2.  **Diseño Profesional y Funcional:** La plantilla está diseñada para transmitir confianza y profesionalismo. Incluye:
        *   **Hero Section:** Una imagen de bienvenida con un titular claro y botones de llamado a la acción ("Pedir Cita").
        *   **Cuadrícula de Servicios:** Una sección visual para destacar los principales tratamientos o servicios ofrecidos.
        *   **Presentación del Equipo:** Un espacio para introducir al equipo médico, generando confianza.
        *   **Escaparate de Productos:** Una sección para mostrar productos específicos como gafas, audífonos, etc.
        *   **Testimonios de Pacientes:** Prueba social para reforzar la credibilidad.
        *   **Formulario de Contacto:** Optimizado para que los pacientes soliciten citas o información.
        *   **Mapa de Ubicación:** Un mapa interactivo para facilitar la localización de la clínica.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir un enlace a esta nueva plantilla en la categoría de "Salud".

*   **¿Por qué se hizo?** Para enriquecer la biblioteca de plantillas con una solución profesional y específica para el sector salud, proporcionando a los clientes una herramienta de marketing digital robusta y lista para ser desplegada, capaz de captar pacientes y presentar sus servicios de manera efectiva.

---
## 19 de Agosto de 2024

### 1. [ID de Cambio: 19d0a4b4] Creación de Plantilla Avanzada para Hotelería (Hotellerie)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad y modular para la categoría "Hotellerie" (Hotelería), utilizando un enfoque de componentes reutilizables para mejorar la mantenibilidad del código.
    1.  **Nueva Página y Componentes:** Se desarrolló la ruta `/articulos/landing-pages/hotellerie-1` y se creó una estructura de componentes dedicados en `src/components/landing/hotellerie-1/` para cada sección de la página (Hero, Escaparate de Habitaciones, Servicios, Pestañas de Reserva, Testimonios, Mapa y Pie de página).
    2.  **Diseño Sofisticado y Funcional:** La plantilla incluye:
        *   **Hero Section:** Una imagen de bienvenida con un titular elegante y un llamado a la acción principal.
        *   **Escaparate de Habitaciones:** Un carrusel dinámico para mostrar los diferentes tipos de habitaciones disponibles.
        *   **Servicios del Hotel:** Una cuadrícula visual que muestra los servicios (Wi-Fi, Piscina, Spa, etc.) y está diseñada para que se puedan activar o desactivar fácilmente desde el código.
        *   **Pestañas de Reserva:** Un sistema de pestañas que separa una "Solicitud de Pre-Reserva" (con selector de fechas y número de huéspedes) de un "Formulario de Contacto General".
        *   **Testimonios y Ubicación:** Secciones para prueba social y un mapa interactivo.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir un enlace a esta nueva plantilla en la categoría de "Hotelería".
    4.  **Instalación de Dependencia:** Se añadió `react-day-picker` al `package.json` para el selector de fechas avanzado en el formulario de reserva.

*   **¿Por qué se hizo?** Para enriquecer la biblioteca de plantillas con una solución profesional y específica para el sector hotelero, y para introducir un patrón de desarrollo más modular y escalable mediante componentes de React, facilitando futuras adaptaciones y mejoras.

---
## 18 de Agosto de 2024

### 1. [ID de Cambio: 18c9e4a3] Creación de Plantilla Avanzada para Inmobiliarias (Immobilien)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page altamente funcional y específica para el sector inmobiliario, añadiéndola a la categoría "Immobilien" de la biblioteca.
    1.  **Nueva Página y Ruta:** Se desarrolló el componente en `/articulos/landing-pages/immobilien-1` con un diseño sofisticado y profesional.
    2.  **Estructura de Pestañas (Tabs):** El núcleo de la página es un sistema de pestañas que divide la experiencia del usuario en dos flujos principales:
        *   **"Estoy Buscando":** Un formulario de búsqueda avanzada para que los interesados encuentren propiedades, con filtros por tipo, presupuesto, ciudad y radio en kilómetros.
        *   **"Quiero Ofrecer":** Un formulario para que los propietarios registren sus inmuebles, con un selector de categorías detallado (casa, apartamento, local, etc.).
    3.  **Componentes Visuales y de Confianza:**
        *   **Hero Section:** Una imagen de portada potente con el título principal.
        *   **Galería de Inmuebles Top:** Una cuadrícula visual para mostrar las propiedades más destacadas.
        *   **Sección de Testimonios:** Un apartado para "Lo que dicen nuestros clientes" para generar prueba social.
        *   **Mapa de Ubicación:** Un mapa interactivo de Leaflet mostrando la ubicación de la oficina.
        *   **Formulario de Contacto General:** El formulario estándar para consultas directas.
    4.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir el enlace a esta nueva y potente plantilla.
    5.  **Internacionalización:** Se añadieron las traducciones necesarias para la nueva categoría "Inmobiliaria".

*   **¿Por qué se hizo?** Para enriquecer la biblioteca de plantillas con una solución de nivel profesional para el sector inmobiliario, ofreciendo una herramienta de marketing y captación de leads de doble propósito (propietarios e inquilinos) que agrega un valor inmenso al catálogo del ERP.

---
## 17 de Agosto de 2024

### 1. [ID de Cambio: 17b8d3a2] Creación de Plantilla de Landing Page para Viajes (Reisen)

*   **¿Qué se hizo?** Se implementó una nueva plantilla de landing page de alta calidad para la categoría "Viajes" (Reisen), siguiendo la misma estructura modular que las plantillas anteriores.
    1.  **Nuevo Componente de Página:** Se desarrolló la ruta `/articulos/landing-pages/reisen-1` y su componente `LandingReisen`, enfocado en agencias de viajes y turismo.
    2.  **Diseño Moderno y Funcional:** La plantilla incluye:
        *   **Hero Section con Buscador:** Una imagen principal inspiradora con un buscador de ofertas integrado.
        *   **Carrusel de Ofertas:** Se implementó un carrusel dinámico y deslizable (usando `embla-carousel-react`) para mostrar paquetes de viaje destacados de forma atractiva.
        *   **Sección de Testimonios:** Un apartado para "Lo que dicen nuestros viajeros" para añadir prueba social.
        *   **Mapa Mundial y Oficinas:** Un mapa visual para mostrar el alcance global y la ubicación de las oficinas.
        *   **Galería de Destinos:** Una selección visual de países que se pueden visitar.
        *   **Formulario de Contacto:** El formulario estándar para la captura de leads.
    3.  **Actualización de la Biblioteca:** Se actualizó la página principal de "Landing Pages" para incluir el enlace a esta nueva plantilla en la categoría "Viajes".
    4.  **Instalación de Dependencia:** Se añadió `embla-carousel-react` al `package.json` para soportar la funcionalidad del carrusel.

*   **¿Por qué se hizo?** Para expandir la biblioteca de plantillas del ERP con una solución profesional y específica para el sector turístico, proporcionando a los clientes una herramienta de marketing potente y lista para usar.

---
## 16 de Agosto de 2024

### 1. [ID de Cambio: 16a7c5b1] Creación del Módulo de Plantillas de Landing Pages (Gastronomía)

*   **¿Qué se hizo?** Se implementó una nueva sección de "Landing Pages" dentro del módulo de "Artículos", sentando las bases para un catálogo de plantillas web reutilizables.
    1.  **Estructura de Módulo:** Se creó la ruta `/articulos/landing-pages` y se añadió una pestaña en el layout de "Artículos" para navegar fácilmente entre los productos/servicios y las nuevas plantillas de landing pages.
    2.  **Primera Categoría y Plantilla:** Se añadió la categoría "Gastronomía" y se implementó la primera plantilla (`gastronomia-1`), un diseño elegante y completo para restaurantes.
    3.  **Componente de Landing Page:** Se desarrolló un componente de página completo (`LandingGastronomia`) que incluye:
        *   Header con logo y navegación.
        *   Sección Hero con imagen de fondo y llamados a la acción ("Ver Platos", "Descargar Menú").
        *   Sección "Nuestra Historia" para el storytelling del restaurante.
        *   Galería de "Platos Estrella".
        *   Formulario de contacto para reservas o sugerencias.
        *   Sección de ubicación con mapa interactivo (Leaflet) y datos de contacto.
    4.  **Internacionalización:** Se actualizaron los archivos de traducción (`es`, `en`, `de`) para incluir los textos de la nueva sección y categoría.

*   **¿Por qué se hizo?** Para dotar al ERP de una potente herramienta de marketing que permita a los usuarios generar rápidamente páginas de destino de alta calidad y específicas para diferentes sectores, comenzando con la industria gastronómica. Esto permite ofrecer un nuevo tipo de producto (plantillas web) directamente desde el catálogo del ERP.

---
## 15 de Agosto de 2024

### 1. [ID de Cambio: 15e8f1d3] Corrección de Responsividad en Gestión de Clientes

*   **¿Qué se hizo?** Se corrigió un problema de diseño en la cabecera de la lista de clientes (`customer-list.tsx`) que provocaba que los botones se desbordaran en pantallas pequeñas.
    1.  **Diagnóstico:** Se observó que el contenedor de los botones de acción ("Limpiar", "Sincronizar", "Añadir") no se adaptaba correctamente en vistas móviles.
    2.  **Solución:** Se ajustaron las clases de Tailwind CSS en el `CardHeader` para que los elementos se apilen verticalmente (`flex-col`) en la vista por defecto (móvil) y cambien a una fila (`sm:flex-row`) en pantallas más grandes.
    3.  **Resultado:** El layout ahora es completamente responsivo, asegurando una buena experiencia de usuario tanto en escritorio como en dispositivos móviles.

*   **¿Por qué se hizo?** Para solucionar un error de diseño que afectaba la usabilidad y la apariencia profesional del módulo de clientes en dispositivos móviles.

---
## 14 de Agosto de 2024

### 1. [ID de Cambio: 14c6a9b1] Corrección Definitiva de Rutas Paralelas en Módulo de Clientes

*   **¿Qué se hizo?** Se solucionó de manera definitiva el error `You cannot have two parallel pages that resolve to the same path` que impedía la compilación de la aplicación.
    1.  **Diagnóstico:** Se detectó la existencia de archivos de ruta duplicados en los directorios `src/app/customers` y `src/app/(protected)/customers`. Esto creaba una ambigüedad para el enrutador de Next.js.
    2.  **Solución:** Se centralizó toda la lógica del módulo de clientes dentro de `src/app/(protected)/customers/`. Se eliminó el directorio conflictivo `src/app/customers` y se recreó la página de detalle `[id]/page.tsx` en la ubicación correcta. Se aseguró que la estructura de `layout.tsx`, `page.tsx` y `metrics/page.tsx` funcionara de forma cohesionada.
    3.  **Resultado:** Se eliminó el conflicto de rutas, restaurando la compilación y el funcionamiento del módulo de clientes con su navegación por pestañas.

*   **¿Por qué se hizo?** Para corregir un error estructural crítico que rompía el enrutamiento de la aplicación y para aplicar la estructura de archivos correcta recomendada por Next.js para layouts anidados.

---
## 13 de Agosto de 2024

### 1. [ID de Cambio: 13f4a9b2] Corrección Integral de Traducciones del Módulo de Marketing

*   **¿Qué se hizo?** Se solucionaron de manera definitiva todos los errores de texto sin traducir en el módulo de Marketing gracias a una auditoría exhaustiva proporcionada por el usuario.
    1.  **Diagnóstico:** Se confirmó que varios componentes clave, como la página de "Conexiones" y el "Calendario de Automatización", mostraban claves de traducción (`marketingSuite.connections.title`, `marketingSuite.calendar.title`, etc.) en lugar del texto real. La causa raíz fue la ausencia de estas claves en los archivos de internacionalización (`locales/{es,en,de}/marketing.json`).
    2.  **Solución:** Siguiendo la detallada guía del usuario, se revisaron y completaron los tres archivos `marketing.json`. Se añadió la estructura completa para `marketingSuite`, incluyendo las secciones anidadas para `connections`, `calendar` y `composer`, asegurando que todas las claves requeridas existieran y estuvieran correctamente traducidas.
    3.  **Resultado:** Con esta corrección, toda la interfaz del módulo de Marketing, incluyendo las nuevas secciones de la "Suite Conectada", ahora se muestra correctamente traducida en español, inglés y alemán, eliminando por completo los errores de texto.

*   **¿Por qué se hizo?** Para eliminar un error persistente y evidente que afectaba la usabilidad y la apariencia profesional de todo el módulo de Marketing, y para alinear la implementación con la arquitectura de internacionalización definida.

---
## 12 de Agosto de 2024

### 1. [ID de Cambio: 12e0b5f1] Refactorización Definitiva de Componentes de Cupón y Corrección de Datos

*   **¿Qué se hizo?** Se solucionó el error persistente de traducción en los cupones individuales mediante una refactorización completa de la lógica, siguiendo un contrato de datos estricto para asegurar la consistencia.
    1.  **Diagnóstico:** Se identificó que el error no era de traducción, sino de **datos y responsabilidades**. El componente padre (`IndividualCouponCreator`) pre-procesaba parte de la información, mientras que el componente hijo (`CouponCard`) intentaba adivinar cómo mostrarla. La causa raíz fue la ausencia de la bandera `isIndividual: true` en los datos de la vista previa, lo que impedía que `CouponCard` aplicara la lógica de renderizado correcta.
    2.  **Solución de Contrato de Datos:**
        *   **`CouponCard.tsx`** se convirtió en el único responsable de su presentación. Ahora siempre recibe datos brutos (`recipientName`, `senderName`) y es quien aplica las traducciones (`t('coupons.individual.for')`, `t('coupons.individual.from')`), eliminando cualquier ambigüedad.
        *   **`IndividualCouponCreator.tsx`** fue modificado para enviar solo datos brutos a la vista previa, incluyendo la bandera `isIndividual: true` que faltaba. Se eliminó cualquier lógica de pre-traducción.
    3.  **Corrección de Backend:** Se ajustó la Cloud Function `createSingleCoupon` para que guarde `recipientName` y `senderName` como campos separados en la base de datos, en lugar de usar el campo `subtitle`, alineando el backend con la nueva lógica del frontend.
    4.  **Mejora de Usabilidad:** Atendiendo a una solicitud anterior, se aumentó el tamaño del campo de texto para los "Términos y Condiciones" en el formulario de creación, duplicando su altura para facilitar la edición.

*   **¿Por qué se hizo?** Para eliminar un error fundamental en la arquitectura de componentes que causaba inconsistencias visuales y funcionales, aplicando un patrón de diseño más robusto y predecible. Esta corrección asegura que el módulo de cupones sea fiable y fácil de mantener.

---
## 11 de Agosto de 2024

### 1. [ID de Cambio: 0a9b3c1d] Corrección Final de Traducciones en Pestañas del Módulo de Cupones

*   **¿Qué se hizo?** Se solucionó el error persistente donde las pestañas del módulo de cupones ("Crear Lote", "Cupón Individual") mostraban sus claves de traducción en lugar del texto real.
    1.  **Diagnóstico:** Se identificó que, a pesar de que las traducciones existían en los archivos `.json`, el componente `CouponDashboard.tsx` no estaba cargando el *namespace* de traducción `marketing`, por lo que no podía acceder a dichas claves.
    2.  **Solución:** Se modificó el archivo `src/components/marketing/coupons/coupon-dashboard.tsx` para que utilice el hook `useTranslation('marketing')`. Esto conecta el componente con el archivo de traducciones correcto.
    3.  **Verificación:** Se confirmó que todas las claves (`coupons.tabs.batch`, `coupons.tabs.individual`, `coupons.tabs.list`) existen y están correctamente escritas en los archivos `locales/{en,es,de}/marketing.json`.
    4.  **Resultado:** Las pestañas del módulo de cupones ahora se muestran correctamente traducidas en todos los idiomas, solucionando el último problema de internacionalización en esta sección.

*   **¿Por qué se hizo?** Para eliminar un error visual evidente que afectaba la usabilidad y la apariencia profesional del módulo de cupones, aplicando la solución correcta que ya se había documentado en cambios anteriores pero que no se había implementado en este componente específico.

---
## 10 de Agosto de 2024

### 1. [ID de Cambio: 02b789c5] Corrección de Traducciones en Módulo de Cupón Individual

*   **¿Qué se hizo?** Se solucionó un error visual donde la nueva funcionalidad para crear cupones individuales mostraba las claves de traducción (ej. `coupons.individual.title`) en lugar del texto real.
    1.  **Diagnóstico:** Se confirmó que el problema era la ausencia de las claves de traducción específicas para el formulario de cupón individual en los archivos de internacionalización.
    2.  **Solución:** Se añadieron todas las claves y textos necesarios para esta nueva sección a los archivos `locales/es/marketing.json`, `locales/en/marketing.json` y `locales/de/marketing.json`, incluyendo títulos, etiquetas de campos de formulario y botones.
    3.  **Resultado:** La interfaz del módulo de "Cupón Individual" ahora se muestra correctamente traducida en todos los idiomas soportados (español, inglés y alemán), garantizando una experiencia de usuario coherente.

*   **¿Por qué se hizo?** Para corregir un error evidente que hacía que la nueva funcionalidad pareciera rota y fuera difícil de usar, y para mantener la consistencia en la internacionalización de la aplicación.

---
## 09 de Agosto de 2024

### 1. [ID de Cambio: 9c2d5e8] Corrección Definitiva de Renderizado en Servidor para Escáner de Cupones

*   **¿Qué se hizo?** Se solucionó de manera definitiva el error crítico `BarcodeDetector is not defined` que impedía el funcionamiento de la página del escáner de cupones, aplicando una solución que ya estaba documentada en la bitácora pero que no se había implementado correctamente.
    1.  **Diagnóstico:** Se confirmó, gracias a la insistencia del usuario, que el problema no era de traducciones, sino un error de renderizado del lado del servidor (SSR). El componente `CouponScanner` intentaba acceder a la API `BarcodeDetector` del navegador, la cual no existe en el entorno de ejecución de Node.js en el servidor, causando el fallo.
    2.  **Solución:** Se implementó la **carga dinámica** del componente `CouponScanner` en la página `scanner/page.tsx` utilizando la función `dynamic` de Next.js con la opción `ssr: false`, asegurando que este componente solo se renderice en el navegador del cliente. Adicionalmente, se pasó la función de traducción `t` como una prop para garantizar que el componente cargado dinámicamente tuviera acceso a los textos correctos.
    3.  **Resultado:** Esta corrección elimina el error de renderizado, restaura completamente la funcionalidad del escáner de QR y soluciona los problemas de texto sin traducir, alineando la implementación con las mejores prácticas documentadas previamente para componentes que dependen de APIs del navegador.

*   **¿Por qué se hizo?** Para eliminar un error crítico que bloqueaba una funcionalidad clave del módulo de marketing y para aplicar la solución correcta que ya se había demostrado funcional en el pasado, aprendiendo de los errores de documentación y diagnóstico previos.

---
## 08 de Agosto de 2024

### 1. [ID de Cambio: 8b1f4c7] Corrección de Renderizado en Servidor para Escáner de Cupones

*   **¿Qué se hizo?** Se solucionó un error crítico `BarcodeDetector is not defined` que impedía el funcionamiento de la página del escáner de cupones.
    1.  **Diagnóstico:** Se identificó que el componente `CouponScanner` intentaba acceder a la API `BarcodeDetector` del navegador. Esta API no existe en el entorno del servidor, por lo que el renderizado del lado del servidor (SSR) de Next.js fallaba y rompía la página.
    2.  **Solución:** Se implementó la **carga dinámica** del componente `CouponScanner` en la página `scanner/page.tsx` utilizando la función `dynamic` de Next.js con la opción `ssr: false`.
    3.  **Resultado:** Esta corrección asegura que el componente del escáner solo se renderice en el navegador del cliente, donde la API del `BarcodeDetector` está disponible. Esto elimina el error de renderizado, restaura completamente la funcionalidad del escáner de QR y mejora la robustez de la aplicación.

*   **¿Por qué se hizo?** Para eliminar un error de ejecución que bloqueaba una funcionalidad clave del módulo de marketing y para aplicar las mejores prácticas de Next.js al manejar componentes que dependen exclusivamente de APIs del navegador.

---
## 07 de Agosto de 2024

### 1. [ID de Cambio: 7d0a3b5] Corrección Definitiva del Módulo de Cupones: Impresión 3x3 y QR Funcional

*   **¿Qué se hizo?** Se reemplazó la función de impresión de cupones por una solución completamente nueva, robusta y sin dependencias externas, que soluciona los problemas críticos de layout y generación de QR.
    1.  **Layout de Impresión 3x3:** Se corrigió el diseño de la página de impresión para que muestre una cuadrícula de 3x3, resultando en **9 cupones por página A4**. Se ajustó el tamaño de cada cupón a 55mm y se optimizó el espaciado para un aprovechamiento perfecto del papel.
    2.  **Generación de QR Confiable:** Se reemplazó la librería `qrcode.react` por `qrcode-generator`, una solución más ligera y confiable que se ejecuta directamente en el script de impresión. Esto garantiza que todos los QR se generen correctamente como imágenes DataURL, apuntando a la URL de canje completa (`/redeem?code=...`).
    3.  **Manejo de Errores y Debug:** Se añadió un manejo de errores robusto. Si la generación de un QR falla, se mostrará "QR ERROR" en lugar de romper la impresión. Además, se añadieron logs en la consola del navegador para facilitar la depuración del proceso de impresión.
    4.  **Optimización del Tiempo de Ejecución:** Se ajustó el script de impresión para dar más tiempo a la generación de los QR antes de lanzar el diálogo de impresión, evitando hojas en blanco o QR incompletos.
    5.  **Eliminación de Dependencia:** Se eliminó la dependencia `react-to-print` del `package.json`, ya que la nueva solución es autocontenida.

*   **¿Por qué se hizo?** Para solucionar de manera definitiva los problemas que impedían una impresión funcional y profesional de los cupones. La versión anterior fallaba en la generación de QR y tenía un layout de impresión incorrecto (2x3). Esta nueva versión cumple con el requisito de negocio de poder generar lotes de cupones listos para su distribución física o digital en formato PDF.

---
## 06 de Agosto de 2024

### 1. [ID de Cambio: 6a9c2e4] Corrección Funcional Crítica del Código QR, Rediseño de Layout e Implementación de Impresión Profesional de Cupones

*   **¿Qué se hizo?** Se solucionaron múltiples errores fundamentales en el módulo de cupones, incluyendo un rediseño de layout, la corrección de la lógica del código QR y la implementación de una función de impresión profesional.
    1.  **Rediseño del Layout del Cupón:** Se reorganizó la estructura del componente `CouponCard.tsx` para optimizar el espacio y la jerarquía visual. El código del cupón se movió a la esquina superior derecha, y el valor junto con el código QR se anclaron a la esquina inferior derecha, liberando todo el espacio inferior para los términos y condiciones, garantizando que el texto no desplace otros elementos.
    2.  **Corrección de Lógica del QR:** Se diagnosticó y corrigió un error crítico donde el código QR codificaba incorrectamente solo el texto del cupón en lugar de la URL de canje completa. Ahora, el QR genera la URL funcional (`/redeem?code=...`), permitiendo que el escaneo inicie el proceso de canje como se esperaba.
    3.  **Implementación de Impresión Profesional:** Se reemplazó la función de impresión defectuosa en `AdminList.tsx` por una solución robusta utilizando la librería `react-to-print`. Al hacer clic en "Imprimir Lote", se genera una vista de impresión limpia y optimizada que permite guardar los cupones como un archivo PDF perfecto para su distribución física o digital.
    4.  **Optimización de Índices de Firestore:** Se actualizó `firestore.indexes.json` para incluir índices compuestos que optimizan las consultas por código y estado del cupón, mejorando el rendimiento del canje y la administración.
    5.  **Instalación de Dependencia:** Se añadió `react-to-print` al `package.json` para soportar la nueva funcionalidad de impresión.
    6.  **Documentación:** Se documentó este cambio integral en el `CHANGELOG.md`.

*   **¿Por qué se hizo?** Para restaurar la funcionalidad principal de canje de cupones, que estaba rota; para alinear el diseño final del cupón con los requisitos de negocio, asegurando visibilidad para la información legal; y para proporcionar una solución de impresión funcional y profesional que era una carencia crítica del módulo.

---
## 05 de Agosto de 2024

### 1. [ID de Cambio: 5e8f1d3] Corrección Funcional Crítica del Código QR y Rediseño de Layout de Cupones

*   **¿Qué se hizo?** Se solucionó un error fundamental en la funcionalidad de los códigos QR y se rediseñó la tarjeta de cupones para optimizar el espacio y la jerarquía visual.
    1.  **Corrección de Lógica del QR:** Se diagnosticó que el código QR estaba codificando incorrectamente solo el texto del código del cupón (ej. `DI-202509-0001`) en lugar de la URL completa necesaria para el canje. Se corrigió el componente `CouponCard.tsx` para que el QR ahora genere la URL completa y funcional (`/redeem?code=...`), permitiendo que el escaneo inicie el proceso de canje como se esperaba.
    2.  **Rediseño del Layout:** Se reorganizó completamente la estructura del cupón para priorizar el espacio para los términos y condiciones. El título, subtítulo, valor y código QR se movieron a la parte superior de la tarjeta, liberando toda la sección inferior para el texto legal, tal como se solicitó.
    3.  **Implementación de Impresión Profesional:** Se reemplazó la función de impresión defectuosa por una solución robusta en `AdminList.tsx`. Ahora, al hacer clic en "Imprimir Lote", se genera una vista de impresión limpia y optimizada que permite guardar los cupones como un archivo PDF perfecto para su distribución.
    4.  **Documentación:** Se documentó este cambio crítico en el `CHANGELOG.md`.

*   **¿Por qué se hizo?** Para restaurar la funcionalidad principal de canje de cupones, que estaba rota debido a la codificación incorrecta del QR, y para alinear el diseño final del cupón con los requisitos de negocio, asegurando que la información más importante (términos y condiciones) tenga el espacio y la visibilidad adecuados.

---
## 04 de Agosto de 2024

### 1. [ID de Cambio: 4c6a9b1] Corrección Funcional Crítica del Código QR y Rediseño de Layout de Cupones

*   **¿Qué se hizo?** Se solucionó un error fundamental en la funcionalidad de los códigos QR y se rediseñó la tarjeta de cupones para optimizar el espacio y la jerarquía visual.
    1.  **Corrección de Lógica del QR:** Se diagnosticó que el código QR estaba codificando incorrectamente solo el texto del código del cupón (ej. `DI-202509-0001`) en lugar de la URL completa necesaria para el canje. Se corrigió el componente `CouponCard.tsx` para que el QR ahora genere la URL completa y funcional (`/redeem?code=...`), permitiendo que el escaneo inicie el proceso de canje como se esperaba.
    2.  **Rediseño del Layout:** Se reorganizó completamente la estructura del cupón para priorizar el espacio para los términos y condiciones. El título, subtítulo, valor y código QR se movieron a la parte superior de la tarjeta, liberando toda la sección inferior para el texto legal, tal como se solicitó.
    3.  **Documentación:** Se documentó este cambio crítico en el `CHANGELOG.md`.

*   **¿Por qué se hizo?** Para restaurar la funcionalidad principal de canje de cupones, que estaba rota debido a la codificación incorrecta del QR, y para alinear el diseño final del cupón con los requisitos de negocio, asegurando que la información más importante (términos y condiciones) tenga el espacio y la visibilidad adecuados.

---
## 03 de Agosto de 2024

### 1. [ID de Cambio: 3b5d7e9] Corrección Visual y Funcional del Módulo de Cupones

*   **¿Qué se hizo?** Se solucionaron varios problemas en el módulo de cupones para mejorar tanto su funcionalidad como su apariencia.
    1.  **Corrección de Vista Previa:** Se solucionó un error que impedía que la "Vista Previa en Vivo" se mostrara en el formulario de creación de lotes. Ahora, la vista previa es siempre visible en pantallas de escritorio.
    2.  **Rediseño de Tarjeta de Cupón:** Se reestructuró el layout del componente `CouponCard.tsx` para optimizar el espacio y la legibilidad. El código del cupón (`DI-XXXX-XXXX`) se movió a la parte superior, y se limitó la longitud del título para evitar desbordamientos. Esto proporciona más espacio vertical para los términos y condiciones.
    3.  **Límite de Caracteres en el Título:** Se añadió una validación en el formulario (`BatchCreator.tsx`) para limitar el título a un máximo de 14 caracteres, evitando que nombres largos rompan el diseño del cupón.
    4.  **Documentación:** Se documentó este cambio en el `CHANGELOG.md`.

*   **¿Por qué se hizo?** Para mejorar la experiencia del usuario al crear cupones, proporcionando feedback visual inmediato (vista previa) y asegurando que los cupones generados tengan un diseño limpio, profesional y legible, especialmente de cara a la impresión.


---
## 02 de Agosto de 2024

### 1. [ID de Cambio: 2a4b6c8] Ajuste Visual en Tarjetas de Cupón

*   **¿Qué se hizo?** Se redujo el tamaño de la fuente de los textos (código, título y subtítulo) y se ajustó el contenedor del código QR en el componente `CouponCard.tsx`.
    1.  **Análisis:** Se observó que los textos dentro de la tarjeta del cupón eran demasiado grandes, causando que se superpusieran y afectando negativamente la legibilidad y la estética, especialmente al momento de imprimir. Además, el código QR se desbordaba de su contenedor.
    2.  **Corrección:** Se modificaron las clases de Tailwind CSS en `src/components/marketing/coupons/coupon-card.tsx` para disminuir el tamaño del texto del título, subtítulo y valor. Se ajustó dinámicamente el tamaño del QR y su contenedor para asegurar que encaje perfectamente dentro de la tarjeta sin desbordarse.
    3.  **Resultado:** Los cupones ahora tienen un diseño más limpio y profesional, con textos que se ajustan adecuadamente a su contenedor y un código QR que se visualiza correctamente, mejorando la experiencia visual y la funcionalidad de impresión.

*   **¿Por qué se hizo?** Para corregir un problema de diseño que hacía que los cupones generados parecieran desordenados y poco profesionales, garantizando que la información sea clara y legible para el cliente final.


---
## 01 de Agosto de 2024

### 1. [ID de Cambio: 1c3b5a7] Corrección Crítica de Backend: Índice de Firestore para Cupones

*   **¿Qué se hizo?** Se solucionó un error persistente `FirebaseError: The query requires an index` que impedía la carga de cupones en el panel de administración del módulo de Marketing.
    1.  **Análisis:** Se diagnosticó que la consulta para obtener los cupones de un mes específico y ordenarlos por fecha (`query(collection(db, 'coupons'), where('month_key', '==', ...), orderBy('created_at', 'desc'))`) requería un **índice compuesto** que no estaba correctamente definido en el archivo `firestore.indexes.json`. Los intentos anteriores de solucionar este problema fallaron debido a una configuración incorrecta o incompleta del archivo.
    2.  **Corrección:** Se reemplazó por completo el contenido del archivo `firestore.indexes.json` con la definición de índice correcta y necesaria. Esta definición especifica un índice de `queryScope: COLLECTION` para el `collectionGroup: "coupons"` con los campos `month_key` (ascendente) y `created_at` (descendente), que es exactamente lo que la consulta de la aplicación necesita para ejecutarse de manera eficiente.
    3.  **Resultado:** Con la definición de índice correcta, la consulta ahora se puede ejecutar sin errores de permisos, permitiendo que la lista de cupones se cargue y se muestre correctamente en el panel de administración.

*   **¿Por qué se hizo?** Para eliminar un error crítico de base de datos que bloqueaba una funcionalidad clave del módulo de cupones. Esta corrección asegura la infraestructura de datos necesaria para que el panel de administración de cupones sea funcional.


---
## 31 de Julio de 2024

### 1. [ID de Cambio: 4b1a8c3] Corrección Crítica de Backend: Sintaxis en Cloud Functions de Gestión de Clientes

*   **¿Qué se hizo?** Se refactorizaron las Cloud Functions `syncNewCustomersFromWebsite` y `cleanupDuplicateCustomers` para solucionar un error de ejecución que impedía su funcionamiento.
    1.  **Análisis:** Se diagnosticó que las funciones mezclaban sintaxis del SDK de cliente de Firebase v9 (como `getDocs(collection(...))`) con el SDK de Admin, que utiliza una sintaxis diferente (`db.collection(...).get()`). Esta incompatibilidad provocaba un fallo interno en el servidor cada vez que se intentaba ejecutar la sincronización o limpieza de clientes, lo que resultaba en un "Internal Server Error" en la aplicación.
    2.  **Corrección:** Se reescribieron ambas funciones utilizando exclusivamente la sintaxis del SDK de Admin de Firebase. Esto incluye cambiar la forma en que se obtienen y se iteran los documentos para que sean compatibles con el entorno de backend de las Cloud Functions.
    3.  **Resultado:** Las funciones ahora se ejecutan correctamente, permitiendo la sincronización de nuevos clientes desde la colección `businesses` y la limpieza de duplicados sin errores.

*   **¿Por qué se hizo?** Para eliminar un error crítico de backend que impedía el funcionamiento de características clave del módulo de clientes. Esta corrección estabiliza la lógica de negocio del servidor y restaura la capacidad de gestionar la base de datos de clientes de forma automatizada.


---
## 30 de Julio de 2024

### 1. [ID de Cambio: 5d6e7f8] Corrección Crítica de Permisos: Consulta de Tareas en Dashboard

*   **¿Qué se hizo?** Se solucionó un error recurrente de `FirebaseError: Missing or insufficient permissions` que afectaba a los usuarios no administradores al cargar el dashboard principal.
    1.  **Análisis:** Se diagnosticó que el componente `DashboardTaskList` intentaba ejecutar una consulta `collectionGroup` sobre todas las tareas del sistema. Esta operación no está permitida por las reglas de seguridad de Firestore para usuarios que no son `superadmin`, ya que no tienen permiso para ver tareas de proyectos en los que no participan.
    2.  **Corrección:** Se implementó un **renderizado condicional** en la página principal (`src/app/page.tsx`). Ahora, el componente `DashboardTaskList` solo se monta y ejecuta la consulta si el usuario autenticado tiene el rol de `superadmin`. Para el resto de usuarios, el componente no se renderiza, evitando así la consulta no autorizada y eliminando el error de permisos.
    3.  **Documentación Adicional:** Se añadió un caso de estudio técnico en el `README-ERP.md` para documentar este problema y la solución, explicando la interacción entre las `collectionGroup queries` y las reglas de seguridad de Firestore.

*   **¿Por qué se hizo?** Para eliminar un error crítico que impedía que los usuarios con roles estándar (`colaborador`, `teamoffice`) pudieran usar el dashboard, restaurando la funcionalidad completa de la página de inicio para todos los miembros del equipo.


---
## 29 de Julio de 2024

### 1. [ID de Cambio: 0a1b2c3] Corrección de Error Crítico: Sintaxis en Cloud Function

*   **¿Qué se hizo?** Se solucionó un error de despliegue `Unexpected end of input` que impedía la actualización de todas las Cloud Functions.
    1.  **Análisis:** Se identificó que el error era causado por una llave de cierre (`}`) faltante al final de la función `redeemCoupon` en el archivo `functions/index.js`. Este simple error de sintaxis impedía que el archivo se pudiera interpretar correctamente, bloqueando cualquier despliegue.
    2.  **Corrección:** Se añadió la llave `}` faltante en la línea final de la función, restaurando la sintaxis correcta del archivo.
    3.  **Mejora Adicional:** Se aprovechó para actualizar la dependencia `firebase-functions` a su última versión en `functions/package.json` para mejorar la compatibilidad y seguridad, siguiendo las buenas prácticas.

*   **¿Por qué se hizo?** Para eliminar un error de sintaxis crítico que bloqueaba completamente el ciclo de desarrollo y despliegue del backend. Esta corrección es fundamental para poder continuar añadiendo y actualizando funcionalidades en el sistema.

---
## 28 de Julio de 2024

### 1. [ID de Cambio: 9e1b3c8] Corrección de Permisos en Módulo de Cupones

*   **¿Qué se hizo?** Se solucionó un error crítico de `Missing or insufficient permissions` que impedía el funcionamiento de la página pública de canje de cupones (`/redeem`).
    1.  **Análisis:** Se identificó que las reglas de seguridad de Firestore para la colección `coupons` eran demasiado restrictivas y no permitían la lectura pública de los datos de un cupón. Esto es necesario para que un cliente final (no autenticado en el ERP) pueda ver los detalles del cupón antes de canjearlo.
    2.  **Corrección:** Se modificó el archivo `firestore.rules` para cambiar la regla de lectura de `match /coupons/{couponId}` a `allow read: if true;`. La regla de escritura se mantuvo restringida a superadministradores, asegurando la integridad del sistema.

*   **¿Por qué se hizo?** Para restaurar la funcionalidad principal del módulo de cupones, permitiendo que la página de canje funcione correctamente para los clientes finales y eliminando un error crítico de permisos que bloqueaba todo el flujo.

### 2. [ID de Cambio: 9e1b3c8] Implementación del Módulo de Cupones

*   **¿Qué se hizo?** Se añadió un nuevo módulo completo para la gestión de cupones dentro de la sección de Marketing, adaptando la lógica proporcionada para que funcione con Firebase.
    1.  **Nueva Página de Cupones:** Se creó la ruta `/marketing/coupons` con una interfaz que incluye un formulario para crear lotes de cupones y un dashboard para visualizar, buscar y exportar los cupones generados.
    2.  **Página Pública de Canje:** Se creó la ruta `/redeem` para que los clientes finales puedan canjear cupones escaneando un código QR. La página verifica el estado del cupón y recoge los datos del cliente.
    3.  **Componentes de Frontend:** Se desarrollaron los componentes `CouponDashboard`, `CouponCard`, `BatchCreator`, `AdminList` y `RedeemForm` para encapsular la lógica de la interfaz.
    4.  **Lógica de Backend (Cloud Functions):** Se crearon dos nuevas funciones:
        *   `createCouponBatch`: Genera un lote de cupones con códigos únicos, respetando un límite mensual configurable (ej. 600 cupones/mes).
        *   `redeemCoupon`: Gestiona el canje de un cupón de forma atómica para prevenir el doble uso.
    5.  **Base de Datos y Seguridad:** Se actualizó `firestore.rules` para añadir permisos a la nueva colección `coupons` (lectura pública para canje, escritura restringida a superadmins) y a la colección `counters`.
    6.  **Navegación y Traducciones:** Se actualizó el menú de Marketing para incluir el nuevo módulo y se añadieron todas las traducciones necesarias en español, inglés y alemán.

*   **¿Por qué se hizo?** Para dotar al ERP de una herramienta de marketing promocional potente y autónoma, permitiendo a los administradores crear campañas de cupones físicas o digitales y controlar su ciclo de vida desde la creación hasta el canje, todo dentro de la misma plataforma.


---
## 27 de Julio de 2024

### 1. [ID de Cambio: 8a2d4e6] Corrección de Error Crítico: Dependencia Faltante en Backend

*   **¿Qué se hizo?** Se solucionó un `Internal Server Error` recurrente en el módulo de Geomarketing.
    1.  **Análisis:** Se identificó que el error era causado por la ausencia de la librería `axios` en el `package.json` de las Cloud Functions. La función `getBusinessesInArea` intentaba usar `axios` para comunicarse con APIs externas (Nominatim, Overpass), pero al no estar declarada, la función fallaba en el entorno de Firebase.
    2.  **Corrección:** Se añadió `axios` a la lista de `dependencies` en `functions/package.json`. Esto asegura que la librería esté disponible en el entorno de ejecución de Firebase.

*   **¿Por qué se hizo?** Para eliminar un error de ejecución crítico que impedía el funcionamiento de todo el módulo de Geomarketing. Esta corrección estabiliza el backend y permite que la búsqueda de negocios funcione de manera fiable.


---
## 26 de Julio de 2024

### 1. [ID de Cambio: 7c5f8d1] Creación del Módulo de Geomarketing (Fase 1 - MVP)

*   **¿Qué se hizo?** Se implementó la primera versión funcional del módulo de Geomarketing, una herramienta para la prospección de clientes basada en la ubicación geográfica.
    1.  **Nueva Página de Geomarketing:** Se creó la sección `/marketing/geomarketing` con una interfaz que incluye un mapa interactivo (Leaflet) y un panel lateral para búsqueda y resultados.
    2.  **Búsqueda Geográfica por Zona:** Se añadió una función de búsqueda que permite al usuario introducir el nombre de una zona (ciudad, código postal).
    3.  **Visualización de Polígonos:** La herramienta se conecta con la API de Nominatim (OpenStreetMap) para obtener el contorno geográfico (polígono) de la zona buscada y lo dibuja en el mapa.
    4.  **Prospección de Negocios:** Se implementó una segunda función de backend que utiliza la API de Overpass para encontrar y listar todos los negocios registrados dentro del polígono seleccionado, mostrándolos en un panel lateral con popups interactivos.
    5.  **Instalación de Dependencias:** Se añadieron las librerías `leaflet`, `react-leaflet` y `axios` para soportar la nueva funcionalidad.

*   **¿Por qué se hizo?** Para dotar al ERP de una herramienta potente de inteligencia de negocio y prospección, permitiendo a los usuarios identificar y visualizar clientes potenciales en áreas geográficas específicas, sentando las bases para futuras fases de análisis demográfico y gestión de campañas.

### 2. [ID de Cambio: 7c5f8d1] Corrección de Error Crítico de Renderizado de Mapa

*   **¿Qué se hizo?** Se solucionó un error recurrente de `Map container is already initialized` en el módulo de Geomarketing que impedía el correcto funcionamiento del mapa.
    1.  **Análisis:** Se identificó que el problema era causado por re-renderizados del componente padre que provocaban que `react-leaflet` intentara inicializar el mapa múltiples veces en el mismo contenedor del DOM.
    2.  **Corrección:** Se refactorizó la estructura del componente. El estado y la lógica de negocio se centralizaron en el panel lateral (`BusinessesPanel.tsx`). El componente del mapa (`GeomarketingMap.tsx`) ahora es un componente "tonto" que solo recibe props. Se implementó un componente `MapViewUpdater` que utiliza el hook `useMap` de `react-leaflet` para cambiar programáticamente la vista del mapa (centro y zoom) sin necesidad de volver a renderizar todo el contenedor, solucionando el conflicto de inicialización.
    
*   **¿Por qué se hizo?** Para estabilizar el módulo de Geomarketing y eliminar un error de ejecución crítico que hacía que la herramienta fuera inutilizable. Esta corrección asegura que el mapa se renderice de manera predecible y eficiente dentro del ciclo de vida de React y Next.js.


---

## 25 de Julio de 2024

### 1. [ID de Cambio: 9f5a59e] Mejora Funcional del Catálogo de Servicios

*   **¿Qué se hizo?** Se extendió la funcionalidad del módulo de "Conexiones" (Catálogo de Servicios) para incluir herramientas de filtrado y ordenación.
    1.  **Búsqueda en Vivo:** Se añadió un campo de búsqueda que permite a los usuarios filtrar las herramientas por nombre en tiempo real dentro de la categoría seleccionada.
    2.  **Opciones de Ordenación:** Se implementó un menú desplegable que permite ordenar las tarjetas de herramientas por "Orden Alfabético (A-Z)", "Más Buscado" (simulado), y "Último Abierto" (simulado).
    3.  **Reorganización de UI:** Se reestructuró la cabecera del componente para alojar el selector de categorías, el nuevo campo de búsqueda y el selector de orden, manteniendo un diseño limpio y funcional.

*   **¿Por qué se hizo?** Para mejorar la usabilidad del catálogo. A medida que la lista de herramientas crece, se vuelve indispensable contar con mecanismos para encontrar y organizar la información de manera rápida y eficiente, evitando que el usuario tenga que desplazarse por toda la lista.

### 2. [ID de Cambio: 9f5a59e] Internacionalización (i18n) del Catálogo de Servicios

*   **¿Qué se hizo?** Se internacionalizaron todos los textos estáticos del componente del Catálogo de Servicios (`ServiceCatalog.tsx`), incluyendo el título principal, la descripción, los textos de los botones y los marcadores de posición de los campos de búsqueda y ordenación.
    1.  Se añadieron las claves de traducción correspondientes a los archivos de internacionalización (`es/connections.json`, `en/connections.json`, `de/connections.json`).
    2.  Se reemplazaron los textos fijos en el componente para que utilicen el sistema de traducción `i18next`.

*   **¿Por qué se hizo?** Para asegurar que el módulo de "Conexiones" sea completamente multilingüe y ofrezca una experiencia de usuario consistente en español, inglés y alemán, eliminando cualquier texto codificado.


---

## 24 de Julio de 2024

### 1. [ID de Cambio: 51c26d2] Refactorización y Restauración del Módulo de Conexiones (Catálogo de Servicios)

*   **¿Qué se hizo?**
    1.  Se restauró el componente `ServiceCatalog` después de haber sido eliminado por error.
    2.  Se implementó una lógica de "siembra" (seeding) que carga automáticamente una lista de más de 140 herramientas de IA en la base de datos (`programs` en Firestore) la primera vez que se carga el componente, si la base de datos está vacía.
    3.  Se conectó el catálogo para que lea, muestre y guarde los cambios directamente en la base de datos, convirtiéndolo en una lista totalmente dinámica y persistente.
    4.  Se añadió funcionalidad completa de **CRUD** (Crear, Leer, Actualizar, Eliminar) a cada tarjeta de herramienta, permitiendo al usuario añadir, editar y borrar cualquier servicio del catálogo.
    5.  Se corrigió la interfaz para que las categorías se muestren en un menú desplegable en dispositivos móviles, solucionando el problema de visualización.
    6.  Se corrigió la configuración de `next.config.js` y el código del componente para permitir la carga de favicons desde `google.com` y asegurar que las imágenes se muestren correctamente.

*   **¿Por qué se hizo?** La versión anterior era estática, no editable y presentaba graves problemas de diseño en vistas móviles y tablet. Después de varios intentos fallidos que eliminaron la funcionalidad o no la implementaron correctamente, esta versión final cumple con el requisito de tener un catálogo completo, dinámico, personalizable y responsivo, dándole al usuario control total sobre las herramientas listadas.

---

## 23 de Julio de 2024

### 1. [ID de Cambio: XXXXXXX] Creación del Documento de Especificaciones Técnicas (`README-ERP.md`)

*   **¿Qué se hizo?** Se generó un documento exhaustivo en formato Markdown que detalla la arquitectura completa del ERP, el desglose de cada módulo del frontend, y la descripción de cada Cloud Function del backend.
*   **¿Por qué se hizo?** Para crear una "fotografía" completa y detallada del estado actual del software. Esto sirve como base para la planificación de futuras fases de desarrollo, la creación de tutoriales y para que el equipo tenga una referencia técnica unificada, reduciendo la incertidumbre.

### 2. [ID de Cambio: XXXXXXX] Implementación de Eliminación Manual de Clientes

*   **¿Qué se hizo?**
    1.  Se creó una nueva Cloud Function (`deleteCustomer`) que permite a un superadministrador eliminar un cliente y todos sus datos asociados (interacciones, ofertas, etc.) de forma segura.
    2.  Se añadió un botón de "Eliminar" (con icono de papelera) en la interfaz de la página de "Gestión de Clientes". Este botón solo es visible para los superadministradores y muestra un diálogo de confirmación para prevenir borrados accidentales.
*   **¿Por qué se hizo?** La función automática para limpiar clientes duplicados no estaba funcionando de manera fiable. Para desbloquear la situación y dar control directo al usuario, se proporcionó una herramienta manual y segura para la gestión de registros.

### 3. [ID de Cambio: XXXXXXX] Refactorización de la Lógica de Sincronización y Limpieza de Clientes

*   **¿Qué se hizo?** Se reescribieron las Cloud Functions `syncNewCustomersFromWebsite` y `cleanupDuplicateCustomers` utilizando la sintaxis correcta del SDK de Admin de Firebase para solucionar errores de despliegue (`getDocs is not defined`).
*   **¿Por qué se hizo?** Las versiones anteriores mezclaban incorrectamente sintaxis del SDK de cliente y de admin, lo que impedía su ejecución y el despliegue de las funciones. La corrección era necesaria para que ambas características (sincronizar nuevos clientes y limpiar duplicados) pudieran funcionar.
