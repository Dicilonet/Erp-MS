# Resumen Técnico y Funcional del ERP Dicilo

Este documento proporciona un análisis detallado de la arquitectura, módulos, componentes y lógica de negocio del sistema ERP Dicilo. Está diseñado para servir como guía técnica para desarrolladores, para la creación de tutoriales y para la planificación de futuras fases de desarrollo.

## 1. Arquitectura General

El sistema está construido como una **aplicación web moderna (SPA)** con las siguientes tecnologías:

- **Frontend:** [Next.js](https://nextjs.org/) con [React](https://reactjs.org/) y [TypeScript](https://www.typescriptlang.org/). Se utiliza el App Router para la gestión de rutas.
- **UI (Interfaz de Usuario):** Componentes de [ShadCN/UI](https://ui.shadcn.com/) sobre [Tailwind CSS](https://tailwindcss.com/) para un diseño responsivo y moderno. Incluye temas claro y oscuro.
- **Backend (Lógica de Servidor):** [Firebase Cloud Functions](https://firebase.google.com/docs/functions) escritas en JavaScript (Node.js), que gestionan la lógica de negocio, la autenticación y las operaciones complejas de la base de datos.
- **Base de Datos:** [Cloud Firestore](https://firebase.google.com/docs/firestore), una base de datos NoSQL, para almacenar todos los datos de la aplicación (clientes, proyectos, usuarios, etc.).
- **Autenticación:** [Firebase Authentication](https://firebase.google.com/docs/auth) para gestionar el registro y el inicio de sesión de usuarios.
- **Traducción (i18n):** `i18next` y `react-i18next` para soportar múltiples idiomas (Español, Inglés, Alemán).
- **Lógica de IA:** Integración con [Genkit](https://firebase.google.com/docs/genkit) para funcionalidades de inteligencia artificial, como el procesamiento de facturas y la generación de resúmenes.

## 2. Desglose de Módulos del Frontend

La aplicación se estructura en varios módulos principales, cada uno con su propia interfaz y lógica de cliente.

---

### Módulo 1: Dashboard Principal (`/`)

- **Propósito:** Ofrecer una vista general y un centro de operaciones para el usuario.
- **Componentes Clave:**
  - `TeamMemberTable`: (Visible solo para Superadmins) Muestra una tabla de colaboradores y miembros de "TeamOffice", permitiendo ver sus perfiles.
  - `CreateTeamMemberForm`: (Superadmins) Formulario para añadir nuevos usuarios internos.
  - `DashboardTaskList`: (Visible solo para Superadmins) Muestra una lista de tareas prioritarias de todos los proyectos, obtenidas mediante una consulta de `collectionGroup`.
  - `UnifiedSearchView`: Buscador global que permite encontrar clientes e interacciones.
  - `DashboardTodoList`: Vista rápida de las tareas personales del usuario.
  - `Calculator`, `CalendarView`, `ServiceCatalog` (en lugar de `ConnectedAccounts`), `InterestingPrograms`, `AiSummary`.
- **Funcionalidad:** Es el punto de entrada tras el login. Permite un acceso rápido a las tareas más importantes y a la gestión de equipos (si se tienen los permisos).

---

### Módulo 2: Gestión de Clientes (`/customers` y `/customers/[id]`)

- **Propósito:** Gestionar la base de datos de clientes del ERP.
- **Componentes Clave:**
  - `customers/page.tsx`: Vista principal que muestra una tabla/lista de todos los clientes.
    - **Sincronización:** Botón para llamar a la Cloud Function `syncNewCustomersFromWebsite` e importar clientes desde la colección `businesses`.
    - **Limpieza:** Botón (Superadmins) para llamar a la función `cleanupDuplicateCustomers`.
    - **Eliminación:** Botón (Superadmins) para eliminar un cliente y todos sus datos asociados.
  - `customers/[id]/page.tsx`: Panel de detalles de un cliente específico.
    - `InteractionLog`: Muestra y permite registrar nuevas interacciones (llamadas, emails, etc.) con un cliente. Usa IA para sugerir resúmenes.
    - Muestra los servicios y entregables asociados al plan del cliente.
- **Lógica de Backend Asociada:** `syncNewCustomersFromWebsite`, `cleanupDuplicateCustomers`, `deleteCustomer`, `onCustomerCreate`.

---

### Módulo 3: Gestión de Proyectos (`/admin/projects` y `/admin/projects/[id]`)

- **Propósito:** Crear, visualizar y gestionar proyectos, fases y tareas.
- **Componentes Clave:**
  - `projects/page.tsx`: Listado de todos los proyectos con un buscador.
  - `projects/[id]/page.tsx`: Vista de detalle de un proyecto.
    - **Kanban Board:** Tablero visual para arrastrar y soltar tareas entre estados (`Pendiente`, `En Progreso`, `Hecho`, `Bloqueado`).
    - **Formularios:** `CreateTaskForm` y `EditTaskForm` para gestionar las tareas del proyecto.
    - `ProjectMarketingCalendar`: Calendario de marketing específico para el proyecto.
- **Lógica de Backend Asociada:** `createProject`, `updateProject`, `deleteProject`, `createTask`, `updateTask`, `updateTaskStatus`.

---

### Módulo 4: Artículos (Productos y Servicios) (`/articulos`)

- **Propósito:** Administrar el catálogo de productos y servicios que se pueden incluir en las ofertas.
- **Componentes Clave:**
  - `ArticleForm`: Formulario para crear o editar artículos, calculando el precio bruto automáticamente.
  - Vista de tabla con pestañas para filtrar por "Todos", "Productos" y "Servicios".
- **Lógica de Backend Asociada:** `createArticle`, `updateArticle`, `getArticles`.

---

### Módulo 5: Gestión de Ofertas (`/offers`)

- **Propósito:** Crear, editar y enviar ofertas (presupuestos) a los clientes.
- **Componentes Clave:**
  - `OfferList`: Muestra un historial de todas las ofertas con su estado (Borrador, Enviada, Aceptada, etc.).
  - `CreateOfferForm`: Un formulario complejo para crear/editar ofertas. Permite añadir ítems dinámicamente, calcular totales (subtotal, IVA, total) y guardar como borrador o enviar directamente por email.
- **Lógica de Backend Asociada:** `createOffer`, `updateOffer`, `updateOfferStatus`.

---

### Módulo 6: Gestión de Gastos (`/expenses`)

- **Propósito:** Registrar los gastos de la empresa, con la capacidad de usar IA para extraer datos de facturas.
- **Componentes Clave:**
  - `ExpenseList`: Muestra un historial de todos los gastos registrados.
  - `CreateExpenseForm`: Formulario para registrar un gasto.
    - **Procesamiento con IA:** Permite subir una imagen de una factura. Llama a la función `processReceipt` de Genkit para analizar la imagen y autocompletar los campos del formulario (descripción, subtotal, IVA, total, fecha, categoría).
- **Lógica de Backend Asociada (IA):** `processReceipt`.

---

### Módulo 7: Comunicaciones (`/communications/email`)

- **Propósito:** Enviar correos electrónicos transaccionales directamente desde el ERP.
- **Componentes Clave:**
  - `EmailComposer`: Un editor de correo completo que permite seleccionar un cliente para autocompletar el destinatario, añadir CC, CCO y adjuntar archivos.
- **Lógica de Backend Asociada:** `sendEmail` (utiliza Nodemailer para el envío SMTP).

---

### Módulo 8: Marketing (`/admin/marketing-plan` y `/marketing/content-pool`)

- **Propósito:** Planificar campañas de marketing y gestionar contenido reutilizable.
- **Componentes Clave:**
  - `content-pool/page.tsx`: "Arsenal de Contenido". Una galería para crear y gestionar plantillas de marketing (posts para redes sociales, etc.).
  - `marketing-plan/page.tsx`: Un calendario donde se pueden planificar eventos de marketing, asociando un activo de contenido a un cliente y una fecha.
  - `ScheduleAssetModal`: Modal para programar la publicación de un post.
- **Lógica de Backend Asociada:** `createMarketingEvent`.

---

### Módulo 9: Gestión de Equipo y Permisos (`/teams` y `/teams/[uid]`)

- **Propósito:** (Solo Superadmins) Administrar usuarios internos y sus permisos de acceso.
- **Componentes Clave:**
  - `teams/page.tsx`: Página principal que lista a los usuarios por rol.
  - `teams/[uid]/page.tsx`: Vista detallada del perfil de un miembro del equipo.
    - Permite asignar permisos de acceso a los diferentes módulos del ERP.
- **Lógica de Backend Asociada:** `createInternalUser`, `updateUserPermissions`, `getDashboardData`.

---

### Módulo 10: Lista de Tareas Personales (`/admin/todo-list`)

- **Propósito:** Un espacio personal para que cada usuario gestione sus propias tareas, ideas y recordatorios.
- **Componentes Clave:**
  - `TodoListPage`: Interfaz con pestañas para organizar tareas por "Todas", "Importantes", "Normales", "Ideas" y "Completadas".
  - `TodoFormModal`: Modal para crear o editar tareas personales.
- **Estructura de Datos:** Los datos se guardan en una subcolección dentro del documento de cada usuario (`/users/{userId}/todos`), asegurando la privacidad.

---

### Módulo 11: Chat Interno (`/chat`)

- **Propósito:** Facilitar la comunicación en tiempo real entre los miembros del equipo.
- **Componentes Clave:**
  - `ConversationList`: Panel izquierdo que muestra las conversaciones existentes y permite iniciar nuevas.
  - `ChatWindow`: Panel principal donde se visualizan y envían los mensajes de la conversación seleccionada.
- **Lógica de Backend Asociada:** `getOrCreateConversation`, `sendMessage`.
- **Estructura de Datos:** Utiliza una colección `conversations` donde cada documento representa una conversación entre dos usuarios. Los mensajes se guardan en una subcolección `messages`.

---

### Módulo 12: Soporte (`/support`)

- **Propósito:** Gestionar tickets de soporte de clientes.
- **Componentes Clave:**
  - `SupportTicketList`: Muestra una tabla con todos los tickets, su estado, prioridad y cliente.
  - `CreateTicketForm`: Formulario para crear un nuevo ticket. Incluye una funcionalidad para **grabar un mensaje de voz** y adjuntarlo al ticket.
- **Estructura de Datos:** Los tickets se guardan en una colección `tickets`. Los audios se suben a Firebase Storage.

---

### Módulo 13: Conexiones (`/connections`)

- **Propósito:** Gestionar un catálogo centralizado de herramientas, servicios y sus correspondientes claves de API o tokens.
- **Componentes Clave:**
  - `ServiceCatalog.tsx`: El componente principal que renderiza el catálogo.
    - **Visualización por Categorías:** Utiliza un sistema de pestañas en escritorio y un menú desplegable en móvil para organizar las herramientas por categorías (Diseño, Marketing, Programación, etc.), mejorando la navegación.
    - **Siembra de Datos (Seeding):** La primera vez que se carga, si la colección `programs` en Firestore está vacía, siembra automáticamente una lista de más de 140 herramientas predefinidas.
    - **Gestión Dinámica (CRUD):** Lee y escribe directamente en la colección `programs`.
    - **Tarjeta de Herramienta:** Cada herramienta se muestra en una tarjeta individual que incluye su logo, nombre y descripción.
    - **Funcionalidad de Edición:** Al pasar el ratón, aparecen botones para "Editar" y "Eliminar". El botón de edición abre un formulario (`ProgramForm.tsx`) que permite modificar todos los datos de la herramienta, incluyendo el nombre, la URL y la API key.
    - **Añadir Nueva Herramienta:** Un botón permite al usuario añadir nuevas herramientas al catálogo, que se guardan en la categoría seleccionada.
- **Estructura de Datos:** Utiliza una colección `programs` en Firestore, donde cada documento representa una herramienta con su nombre, categoría, URL, descripción y API key opcional.


## 3. Desglose de Lógica de Backend (Firebase Cloud Functions)

El archivo `functions/index.js` contiene la lógica de negocio principal. A continuación se detallan las funciones más importantes:

- **Triggers de Firestore:**
  - `onCustomerCreate`: Se activa automáticamente cuando se crea un nuevo cliente. Lee el `planId` del cliente y le asigna la plantilla de servicios correspondiente desde `planTemplates.js`.

- **Funciones Invocables (Llamadas desde el Frontend):**
  - **Autenticación y Usuarios:**
    - `createInternalUser`: (Superadmin) Crea un nuevo usuario en Firebase Auth, le asigna un rol (`colaborador` o `teamoffice`) y crea su perfil en Firestore.
    - `updateUserPermissions`: (Superadmin) Actualiza el array `accessibleModules` en el perfil de un usuario para controlar a qué partes del ERP puede acceder.
    - `updateUserProfile`: Permite a un usuario autenticado actualizar su propio nombre y preferencia de idioma.
    - `getDashboardData`: (Superadmin) Obtiene las listas de usuarios para el dashboard principal.
  - **Clientes:**
    - `syncNewCustomersFromWebsite`: Importa nuevos negocios desde la colección `businesses` a `customers`, con lógica para evitar duplicados por email y nombre.
    - `cleanupDuplicateCustomers`: (Superadmin) Barre la colección `customers` y elimina registros duplicados.
    - `deleteCustomer`: (Superadmin) Elimina un cliente y todas sus subcolecciones (ofertas, interacciones, etc.).
  - **Ofertas:**
    - `createOffer`, `updateOffer`: Gestionan la creación y actualización de ofertas. Calculan totales, numeran las ofertas automáticamente y, si se indica, las envían por email.
    - `updateOfferStatus`: Cambia el estado de una oferta (ej. a "Aceptada").
  - **Email y Comunicaciones:**
    - `sendEmail`: Envía correos usando Nodemailer. Gestiona destinatarios, CC, CCO y archivos adjuntos.
    - `trackEmailOpen`: Un endpoint HTTP que funciona como un píxel de seguimiento para marcar las ofertas como "Vistas" cuando el cliente abre el email.
  - **Proyectos y Tareas:**
    - `createProject`, `updateProject`, `deleteProject`: CRUD para proyectos.
    - `createTask`, `updateTask`, `updateTaskStatus`: CRUD para tareas dentro de un proyecto.
  - **Artículos:**
    - `createArticle`, `updateArticle`, `getArticles`: CRUD para el catálogo de productos y servicios.
  - **Marketing:**
    - `createMarketingEvent`: Registra un post programado y descuenta el uso del servicio del cliente.
  - **Chat:**
    - `getOrCreateConversation`: Busca una conversación existente entre dos usuarios o crea una nueva si no existe.
    - `sendMessage`: Añade un nuevo mensaje a una conversación y actualiza el campo `lastMessage`.

- **Endpoints HTTP:**
  - `receiveNewCustomer`: Endpoint protegido por API Key que permite a un servicio externo (como DiciloSearch) crear un nuevo cliente en el ERP.

## 4. Casos de Estudio Técnicos y Soluciones

Esta sección documenta decisiones de arquitectura clave y la solución a problemas complejos que han surgido durante el desarrollo.

---

### Caso de Estudio 1: Error de Permisos en `collectionGroup` Query

*   **Problema:** Se detectó un error recurrente `FirebaseError: Missing or insufficient permissions` en el dashboard principal (`/`) para cualquier usuario que no tuviera el rol de `superadmin`.
*   **Diagnóstico:** La causa raíz era el componente `DashboardTaskList`. Este componente utilizaba una consulta de grupo (`collectionGroup(db, 'tasks')`) para obtener una lista de las tareas más prioritarias de *todos* los proyectos. Las reglas de seguridad de Firestore estaban correctamente configuradas para que un usuario solo pudiera leer las tareas de un proyecto si era miembro del equipo de ese proyecto (`request.auth.uid in resource.data.assignedTeam`). Una `collectionGroup query` respeta estas reglas, pero al intentar acceder a tareas de proyectos no autorizados, Firestore devolvía un error de permisos general que bloqueaba toda la consulta, impidiendo que incluso las tareas permitidas se mostraran.
*   **Solución:** Se implementó un **renderizado condicional** en el componente `src/app/page.tsx`. Ahora, se verifica el rol del usuario autenticado. El componente `DashboardTaskList` solo se monta y ejecuta su consulta si el usuario es `superadmin`. Para el resto de los roles (`colaborador`, `teamoffice`), el componente no se renderiza en absoluto. Esto evita que se ejecute la consulta no autorizada, eliminando el error de permisos y restaurando la funcionalidad del dashboard para todos los usuarios.
*   **Conclusión Clave:** Las consultas de `collectionGroup` son potentes, pero deben usarse con precaución cuando las reglas de seguridad son restrictivas. Si una consulta de este tipo puede potencialmente acceder a documentos que el usuario no tiene permiso para leer, es preferible evitar la consulta por completo en lugar de intentar manejar el error, ya que Firestore la bloqueará por completo.
