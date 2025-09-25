# Bitácora de Cambios del ERP Dicilo

Este documento sirve como un registro manual de los cambios significativos realizados en el proyecto. El objetivo es mantener un historial claro para facilitar la depuración, la planificación y el seguimiento del desarrollo.

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

*   **¿Por qué se hizo?** Para restaurar la funcionalidad principal de canje de cupones, que estaba rota debido a la codificación incorrecta del QR, y para alinear el diseño final del cupón con los requisitos de negocio, asegurando que la información más importante (términos y condiciones) tenga el espacio y la visibilidad adecuados. Además, se proporcionó una solución de impresión funcional que era una carencia crítica del módulo.

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
