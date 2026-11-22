# Servicios Integrales — Auditoría, Diagnóstico y Plan de Producto

> Documento de dirección de producto. Elaborado como entrega previa a la
> implementación (metodología por etapas). **No se modificó código del producto
> para generarlo.** Requiere aprobación antes de ejecutar.
>
> Fecha: 2026-11-22 · Alcance: todo el repositorio `joacov7/Solucionesintegrales`

---

## 0. Cómo leer este documento

Está organizado según los **9 entregables** que pediste:

1. Diagnóstico del estado actual
2. Problemas detectados
3. Comparación con aplicaciones de referencia (benchmark)
4. Funcionalidades a incorporar
5. Propuesta de rediseño visual
6. Propuesta de navegación
7. Arquitectura recomendada
8. Plan de implementación por etapas
9. Prioridades y justificación

Al final, una sección **"La organización opina"** sintetiza la mirada de cada
perfil profesional, y una **decisión arquitectónica** resuelve la contradicción
PostgreSQL vs Supabase que marcaste.

**Veredicto ejecutivo en una frase:** la base es sólida y bien separada (lógica
de negocio pura, datos, UI), con las 3 áreas ya esbozadas — pero hoy es un
**conjunto de módulos CRUD desconectados** con un **hueco de seguridad crítico**
(ya atacado por la PR #2, sin mergear), **sin continuidad entre procesos**,
**sin la capa visual de producto internacional** que buscás y **sin
multi-tenant** para el objetivo SaaS. El plan convierte eso en un ecosistema
integrado, seguro, visualmente de primer nivel y escalable.

---

## 1. Diagnóstico del estado actual

### 1.1 Qué hay construido (y funciona)

| Área | Implementado | Estado real |
| --- | --- | --- |
| **Comercial** | Home, 6 páginas SEO de servicio, cotizador de alarmas (wizard), cotizadores de cámaras/electricidad/solar/domótica (captura de lead), WhatsApp, PWA (manifest) | Funciona. Cotizador de alarmas es el único con precio real; el resto genera leads |
| **Administrativa** | Dashboard (contadores), productos+precios, configuración (dólar/IVA/margen), financiación, mano de obra, clientes, leads/CRM básico, presupuestos (builder + estados), comprobante imprimible | Funciona con DB; sin DB cae a "modo demo" (solo lectura) |
| **Operativa** | Órdenes de trabajo (auto-creadas al aceptar presupuesto), instaladores, checklist de alarma, app del instalador (mobile), instalaciones+garantías, mantenimiento | Funciona el flujo presupuesto→orden→instalación |
| **Infra** | Next.js 16 + TS + Tailwind + Prisma/PostgreSQL (Neon), CI (typecheck+build), deploy en Vercel, auth interina (HMAC + login + middleware) | CI verde, deploy OK, DB **sin seed todavía** |

### 1.2 Arquitectura actual (fortaleza real)

```
src/
  config/      → marca y servicios (parametrizable en 1 archivo) ✅
  lib/         → pricing.ts (motor puro, sin UI ni DB) ✅ whatsapp, auth, prisma
  data/        → capa de acceso (catalog, admin, operations, leads) ✅
  features/    → lógica+UI por dominio (quoter, quotes, workorders, portal) ✅
  components/  → ui/ + layout/ + admin/ (reutilizables) ✅
  app/         → (public) / admin / installer / client / login ✅
```

La **separación de capas está bien hecha**: el motor de precios no conoce
Prisma ni React; la marca está centralizada; los dominios están aislados. Esto
es una base valiosa que **conviene conservar y potenciar**, no rehacer.

### 1.3 Clasificación de cada elemento

| Elemento | Veredicto | Nota |
| --- | --- | --- |
| `lib/pricing.ts` (motor de precios) | **Mantener** | Puro, correcto, con Decimal. Base de la rentabilidad |
| `config/site.ts` + `config/services.ts` | **Mantener / Mejorar** | Base del white-label; extender a multi-tenant |
| Capa `data/*` con fallback "modo demo" | **Mejorar** | Patrón bueno, pero el fallback silencioso oculta errores (ver §2) |
| Cotizador de alarmas (wizard) | **Mantener / Mejorar** | Mejor pieza de UX del proyecto; falta integrarlo al CRM |
| Cotizadores cámaras/elec/solar/domótica | **Mejorar** | Hoy solo generan lead; falta pricing real y continuidad |
| Panel admin (tablas/edición inline) | **Rediseñar** | Funcional pero "administrativo tradicional" (lo que no querés) |
| Dashboard admin (contadores) | **Rediseñar** | Sin gráficos ni insight; reemplazar por analítica real |
| Auth interina (HMAC) | **Mejorar → Reemplazar** | Sirve de puente; migrar a auth real con roles/tenant |
| Autorización en server actions | **Corregir (crítico)** | Faltaba; la PR #2 la agrega — **mergear** |
| Portal de clientes por teléfono | **Reemplazar** | Inseguro (cualquiera prueba teléfonos); PR #2 lo deshabilita |
| App del instalador | **Mejorar** | Buen esqueleto; falta offline real, fotos, firma, navegación |
| Fotos de instalación (por URL/enlace) | **Reemplazar** | Necesita storage real (subida de archivos) |
| Tests | **Incorporar** | No hay ninguno pese al CI |
| Multi-tenant | **Incorporar** | No existe; es condición del objetivo SaaS |
| Agenda/calendario, pipeline, compras, series | **Incorporar** | No existen (ver §4) |

---

## 2. Problemas detectados

Ordenados por severidad.

### 2.1 Críticos (seguridad / integridad)

- **Autorización ausente en server actions (pre-PR #2).** Las acciones de
  escritura (`saveProductAction`, `createQuoteAction`, `updateWorkOrderAction`,
  etc.) no verificaban rol: un usuario no autenticado podía invocarlas
  directamente. El middleware solo protege la navegación, no las acciones. **La
  PR #2 corrige esto** (autorización por rol dentro de cada acción). Es el
  cambio más importante pendiente → **mergear ya**.
- **Portal de clientes por teléfono = enumeración de datos.** Cualquiera
  ingresa un teléfono y ve datos de ese cliente. PR #2 lo deshabilita hasta
  tener auth real. Correcto.
- **`AUTH_SECRET` con fallback inseguro.** Si falta, usa una clave hardcodeada.
  En producción debe **fallar cerrado** (PR #2 lo exige ≥32 chars). Correcto.
- **18 vulnerabilidades en dependencias** (9 moderadas, 8 altas, 1 crítica,
  reportadas por `npm ci` en la PR #2). Requiere auditoría/actualización.

### 2.2 Altos (producto / integración)

- **Módulos desconectados.** No hay continuidad lead → oportunidad → visita →
  presupuesto → orden. El lead de un cotizador no se convierte en presupuesto
  con un clic; hay que recargar datos. Rompe el requisito central de "ecosistema
  integrado".
- **Fallback "modo demo" silencioso.** Varias lecturas de catálogo atrapan el
  error de DB y devuelven datos del seed. Pero las lecturas del admin
  (`getDashboardStats`, `listCustomers`, `listLeads`, `listQuotes`) **no** tienen
  ese try/catch → si la DB no tiene tablas (estado actual de Neon), **`/admin`
  tira error 500**. Hoy mismo el panel no abre hasta correr el seed.
- **Precios inventados prohibidos, pero módulos sin precio.** Cámaras, solar y
  electricidad no cotizan (correcto: no hay datos), pero tampoco hay modelo para
  cargarlos → quedan como formularios de contacto. Falta el motor de paquetes
  real para cámaras.

### 2.3 Medios (UX / calidad)

- **Estética "panel administrativo tradicional"**: tablas, formularios largos,
  sin jerarquía visual fuerte, sin gráficos, sin microinteracciones. Es
  exactamente lo que pediste evitar.
- **Navegación por módulos, no por procesos.** Completar una venta implica
  saltar entre Clientes → Presupuestos → Órdenes. Sin búsqueda global, sin
  command palette, sin paneles laterales, sin edición contextual.
- **Sin tests, sin manejo de errores visible al usuario** (toasts), sin estados
  de carga consistentes.
- **Dashboard sin inteligencia**: contadores, no insight (márgenes, embudo,
  alertas, pendientes).

### 2.4 Menores

- Fotos por enlace (no subida real), sin notificaciones, sin agenda, sin
  reportes exportables, i18n no preparado, accesibilidad no auditada.

---

## 3. Benchmark: qué hacen los mejores y qué tomamos

Investigación sobre Jobber, Housecall Pro, ServiceTitan y tendencias FSM 2025/26
(fuentes al pie). **No copiamos**: adoptamos patrones probados y los superamos
para nuestro mercado (seguridad/CCTV/energía en Argentina).

### 3.1 Qué tienen ellos que nosotros no

| Patrón de referencia | Quién lo hace bien | Qué adoptamos (mejorado) |
| --- | --- | --- |
| **Client Hub / portal del cliente** (aprobar presupuesto, firmar, pagar seña, pedir trabajo) | Jobber | Portal seguro con aprobación de presupuesto + firma digital + seguimiento de la instalación en tiempo real |
| **Price book visual** (catálogo con fotos, flat-rate, "bueno/mejor/óptimo") | Housecall Pro, ServiceTitan | Catálogo visual + **paquetes "Bueno/Mejor/Premium"** (Good-Better-Best) por tipo de instalación, con rentabilidad detrás |
| **Scheduling/dispatch con calendario drag-and-drop** y tracking del técnico | Los tres | Agenda visual + asignación por skill/zona + estado en vivo de la orden |
| **App móvil del técnico con offline** (cache de la orden, fotos, firma, sincronización) | ServiceTitan, IFS, SAP | PWA offline real para el técnico (requisito tuyo), con cola de sincronización |
| **Automatizaciones** (recordatorios, seguimientos, "voy en camino" con foto) | Jobber, Housecall Pro | Motor de automatizaciones: seguimiento de presupuestos, aviso "en camino", recordatorio de garantía/mantenimiento |
| **Reporting gerencial** (scorecards de técnico, ventas, performance) | ServiceTitan | Dashboards de rentabilidad por dimensión + scorecards |
| **AI scheduling / predictivo / agentes de voz** | ServiceTitan, Salesforce Agentforce, IFS | IA aplicada a problemas concretos (ver §4.4), no adorno |

### 3.2 Qué resuelven mejor (procesos)

- **Flujo único de venta**: de la consulta al cobro sin cambiar de pantalla.
- **Pricebook como fuente de verdad** de precios y rentabilidad (nosotros ya
  separamos costo/venta: ventaja a capitalizar).
- **Offline como estándar**, no como extra.

### 3.3 Dónde podemos superarlos (nuestra oportunidad)

1. **Especialización vertical**: alarmas Vetti + cámaras Uniview/Uniarch +
   energía solar con **cotizadores guiados por tipo de instalación** (ellos son
   genéricos; nosotros, expertos del rubro).
2. **Rentabilidad transparente en tiempo real** (dólar/IVA/margen/costo
   financiero) pensada para Argentina — ellos no modelan tipo de cambio ni
   financiación en cuotas como nosotros.
3. **Experiencia visual nivel Linear/Stripe** en un rubro donde el software es
   feo: diferenciación inmediata.
4. **Precio**: SaaS accesible en USD/ARS para PyMEs de servicios técnicos de LATAM.

---

## 4. Funcionalidades a incorporar (y por qué)

Cada módulo justificado. No se agrega nada "para crecer el proyecto".

### 4.1 Núcleo comercial (CRM real)

- **Pipeline / embudo de ventas** con etapas (Nuevo → Contactado → Visita →
  Presupuestado → Ganado/Perdido) y vista Kanban. *Por qué:* hoy el "estado" del
  lead es un enum sin flujo; sin embudo no hay gestión comercial.
- **Oportunidad** como entidad que une consulta↔cliente↔presupuestos. *Por qué:*
  es el pegamento del ecosistema integrado que pediste.
- **Timeline/actividad por cliente** (llamadas, notas, mensajes, cambios de
  estado). *Por qué:* "cada registro debe tener su historial".
- **Conversión lead → presupuesto en 1 clic** (precarga datos). *Por qué:*
  elimina recarga y navegación.

### 4.2 Operaciones

- **Agenda/calendario** con asignación de técnicos por zona/skill y vista
  semana/día. *Por qué:* hoy no se puede planificar.
- **Visitas técnicas** como paso formal (electricidad/solar lo requieren).
- **App del técnico offline** (PWA + cola de sync), fotos con subida real,
  firma del cliente, checklist dinámico por tipo de servicio. *Por qué:*
  requisito explícito; hoy fotos son enlaces y no hay offline.
- **Órdenes con materiales reservados** y descuento de stock al cierre (ya está
  parcialmente: formalizar).

### 4.3 Gestión económica e inventario

- **Rentabilidad por dimensión**: presupuesto, servicio, producto, instalación,
  cliente, técnico, período. *Por qué:* pediste administrar el negocio, no solo
  guardar datos.
- **Compras y proveedores** + **movimientos de stock** (entradas/salidas/ajustes)
  + **números de serie** (la garantía ya tiene el campo; falta gestión). *Por
  qué:* trazabilidad real de equipos de seguridad.
- **Contratos / abonos de mantenimiento** (ingreso recurrente). *Por qué:* es el
  negocio recurrente de una empresa de seguridad.

### 4.4 Inteligencia funcional (IA con propósito)

Aplicada a problemas concretos, no decorativa:

- Sugerir **productos/componentes complementarios** según tipo de instalación.
- Detectar **presupuestos sin seguimiento** y **márgenes bajos**.
- Alertar **stock bajo**, **garantías por vencer**, **mantenimientos sugeridos**.
- **Resúmenes automáticos** de cuenta de cliente y **redacción de mensajes
  comerciales/WhatsApp**.
- **Crear presupuesto desde una consulta en lenguaje natural** ("alarma para
  casa de 3 aberturas con cámara") → arma la solución.
  *Stack IA:* API de Claude (Anthropic) para generación/resumen; reglas
  determinísticas para alertas (no requieren IA).

### 4.5 Plataforma / SaaS

- **Multi-tenant** (empresa → sucursales → usuarios) con aislamiento de datos.
- **Roles finos** (ADMIN, GERENTE, VENDEDOR, TÉCNICO, CLIENTE).
- **Notificaciones** (in-app, email, push PWA, WhatsApp).
- **Reportes gerenciales** exportables.

---

## 5. Propuesta de rediseño visual (prioridad absoluta)

Objetivo: que **dé gusto usarla** y transmita calidad de producto internacional
(referencias de criterio: Linear, Stripe, Vercel, Notion — no copia).

### 5.1 Sistema de diseño

- **Design tokens** (ya hay variables CSS de marca → formalizar escala de
  tipografía, espaciado, radios, sombras, z-index, motion).
- **Librería de componentes**: adoptar **shadcn/ui** (Radix UI + Tailwind) como
  base accesible y headless — es el estándar del look Linear/Vercel y mantiene
  el control total del estilo. Reemplaza nuestros componentes ad-hoc sin perder
  la marca.
- **Tipografía** moderna (Inter/Geist) con jerarquía real.
- **Modo claro/oscuro** nativo (los tokens ya lo permiten).

### 5.2 Patrones visuales

- **Tarjetas y superficies** con profundidad sutil; densidad de información
  controlada; mucho espacio en blanco.
- **Microinteracciones y animaciones** con **Framer Motion** (transiciones de
  estado, entrada de paneles, feedback de acciones).
- **Gráficos** comprensibles con **Recharts/visx** (rentabilidad, embudo,
  ventas, carga de técnicos) siguiendo buenas prácticas de dataviz
  (color accesible, un insight por gráfico).
- **Estados claros**: loading (skeletons), vacío (empty states con acción),
  error (toasts), éxito (feedback inmediato).

### 5.3 Diseño didáctico (para no técnicos)

- Asistentes multipaso en lugar de formularios de 20 campos (ya lo hacemos en
  el cotizador — extender a presupuestos y alta de cliente).
- Tooltips, ayudas contextuales, valores por defecto razonables, validaciones
  comprensibles con Zod + mensajes claros.
- "Vacíos que enseñan": cada pantalla vacía explica el próximo paso.

> Entregable de esta fase: una **guía de estilo navegable** (storybook o página
> `/admin/design`) con todos los componentes, antes de rediseñar pantallas.

---

## 6. Propuesta de navegación (por procesos, no por módulos)

### 6.1 Principios

- **Un proceso = un flujo**, sin saltar entre módulos para tareas relacionadas.
- **Acciones donde el usuario está** (contextuales), no en otra pantalla.

### 6.2 Mecanismos a implementar

- **Command palette (⌘K)** con **cmdk**: búsqueda global (clientes, presupuestos,
  órdenes, productos) + acciones rápidas ("nuevo presupuesto", "agendar visita").
- **Paneles laterales (sheets)** y **modales inteligentes** para crear/editar sin
  perder contexto.
- **Edición en línea** en tablas (TanStack Table) y **vistas relacionadas**
  (desde un cliente ves sus presupuestos/órdenes/garantías).
- **Workspaces por rol**: Admin/Gerente (analítica + gestión), Vendedor
  (pipeline + presupuestos), Técnico (agenda + órdenes, mobile-first).

### 6.3 Flujo estrella: "Nueva venta en una pantalla"

Rediseñar el alta comercial como **un solo flujo guiado**:

```
Cliente (buscar o crear inline)
  → Servicio/solución (cotizador guiado o paquete)
  → Productos + mano de obra (con rentabilidad en vivo)
  → Financiación (cuotas, sin tocar el margen)
  → Presupuesto generado
  → Enviar por WhatsApp (mensaje auto)
  → Seguimiento (queda en el pipeline)
  → Al aceptar: orden de trabajo automática + agenda
```

Todo sin cambiar de módulo. Es el corazón del ecosistema integrado.

---

## 7. Arquitectura recomendada

### 7.1 Decisión: PostgreSQL vs Supabase (tu contradicción, resuelta)

**Decisión: PostgreSQL gestionado en Neon como base (se mantiene) + autenticación
con una librería en la app (Auth.js v5 / Better Auth) sobre Prisma +
almacenamiento de archivos dedicado (Supabase Storage o Cloudflare R2/UploadThing)
+ multi-tenant a nivel de aplicación reforzado con RLS de Postgres.**

Justificación:
- **Por qué Postgres/Neon (no Supabase como base):** ya está integrado, es
  portable, sin lock-in, excelente con Prisma y Vercel, serverless y barato. El
  documento original pedía explícitamente "que no sea Supabase" como base — se
  respeta.
- **Por qué auth en la app (Auth.js/Better Auth) y no Supabase Auth:** mantiene
  identidad, roles y tenant junto al resto del modelo de datos (una sola fuente
  de verdad), evita partir el stack y habilita roles finos + multi-tenant a
  medida. La auth interina actual (HMAC) es un **puente** hacia esto.
- **Storage:** las fotos/firmas necesitan subida real. Supabase Storage o R2 son
  válidos; se usa solo como servicio de archivos, no como base. (Decisión fina a
  confirmar en Fase 2.)
- **Multi-tenant:** `tenantId` en todas las tablas + scoping obligatorio en la
  capa `data/` + **Row Level Security** en Postgres como segunda barrera.

> Esta es la **única decisión que conviene confirmar con vos** antes de Fase 0,
> porque condiciona la seguridad y el modelo. Recomiendo la opción de arriba.

### 7.2 Capas (reforzar lo existente)

```
UI (app/ + components/ + features/*/components)
  ↓ solo presentación, sin lógica de negocio
Lógica de negocio (lib/ + features/*/logic)   ← pura, testeable
  ↓
Servicios de aplicación (casos de uso, orquestan)  ← NUEVO, explícito
  ↓
Acceso a datos (data/ repos)  ← scoping de tenant obligatorio aquí
  ↓
Prisma / PostgreSQL (Neon) + RLS
```

Agregar una capa explícita de **servicios/casos de uso** (hoy la lógica vive
entre server actions y `data/`) para que las reglas de negocio (ej.
"aceptar presupuesto crea orden + reserva stock + agenda") estén en un solo lugar
testeable.

### 7.3 Calidad de ingeniería

- **Tests**: Vitest (unidad: pricing, reglas), Playwright (E2E de flujos clave).
- **Validación**: Zod en bordes (server actions, APIs).
- **Errores**: resultado tipado + toasts; eliminar fallbacks silenciosos.
- **Observabilidad**: logging estructurado + Sentry.
- **Tipado estricto** (ya está) + lint en CI (agregar al workflow).

### 7.4 Eventos y continuidad

Modelo de **eventos de dominio** (cambio de estado dispara efectos:
presupuesto aceptado → orden + agenda + notificación). Permite agregar líneas de
negocio sin reescribir.

---

## 8. Plan de implementación por etapas

Cada fase entrega algo **usable y probado**. No se rompe lo que funciona.

### Fase 0 — Fundaciones (seguridad + base lista) · *1 sprint*
- Mergear **PR #2** (autorización) tras revisión.
- **Seed en Neon** (desbloquea `/admin`) + quitar fallback silencioso en admin.
- **Auth real** con roles + base **multi-tenant** (tenantId + RLS).
- **Design system** (shadcn/ui + tokens + motion) y guía de estilo.
- Auditoría de dependencias (18 vulnerabilidades) + lint/tests en CI.

### Fase 1 — Núcleo comercial integrado · *2 sprints*
- **CRM + pipeline (Kanban)** + entidad Oportunidad + timeline.
- **Flujo "nueva venta en una pantalla"** + conversión lead→presupuesto.
- **Command palette + búsqueda global + paneles laterales**.
- Rediseño visual de las pantallas comerciales.

### Fase 2 — Operaciones · *2 sprints*
- **Agenda/calendario** + asignación de técnicos + visitas técnicas.
- **App del técnico offline (PWA real)**: fotos (storage), firma, checklist
  dinámico, cola de sync.
- Garantías + números de serie vinculados a la instalación.

### Fase 3 — Gestión económica · *1–2 sprints*
- **Rentabilidad por dimensión** + dashboards con gráficos.
- **Compras/proveedores** + **movimientos de stock**.
- **Contratos/abonos** de mantenimiento (recurrencia).

### Fase 4 — Inteligencia · *1–2 sprints*
- Alertas y recomendaciones (reglas) + resúmenes y mensajes (IA Claude) +
  "presupuesto desde lenguaje natural".

### Fase 5 — Escala SaaS · *continuo*
- Multi-empresa/sucursales, roles finos, reportes gerenciales, notificaciones
  completas, onboarding de nuevos clientes (white-label).

> Estimaciones orientativas (sprint ≈ 1–2 semanas de trabajo enfocado). Se
> ajustan según prioridades tuyas.

## 9. Prioridades y justificación

| Prioridad | Qué | Por qué ahora |
| --- | --- | --- |
| **P0** | Mergear PR #2 + seed DB + quitar fallback silencioso | Sin esto hay hueco de seguridad y `/admin` no abre. Bloqueante |
| **P0** | Auth real + multi-tenant + RLS | Condición del objetivo SaaS y de la seguridad; cuanto antes, menos costo de migración |
| **P1** | Design system + flujo "nueva venta en una pantalla" | Es el doble objetivo central: experiencia visual + navegación por procesos |
| **P1** | CRM/pipeline + continuidad lead→presupuesto→orden | "Ecosistema integrado" (tu requisito núcleo) |
| **P2** | Agenda + app técnico offline + fotos reales | Diferenciador operativo y pedido explícito |
| **P2** | Rentabilidad por dimensión + inventario/compras | "Administrar el negocio", no solo guardar datos |
| **P3** | IA con propósito | Alto valor percibido, se apoya en el resto ya integrado |
| **P3** | Reportes, contratos/abonos, notificaciones | Completan la plataforma y el ingreso recurrente |

Criterio: **primero lo que desbloquea y da seguridad, después lo que diferencia
(visual + integración), luego lo que escala el negocio.**

---

## La organización opina (síntesis multidisciplinaria)

- **CEO/Producto:** la base existe; el salto a "SaaS internacional" es
  integración + experiencia + multi-tenant, no más CRUDs.
- **Product Manager:** priorizar el flujo de venta único; es donde se gana o
  pierde al usuario.
- **Arquitecto:** conservar la separación de capas; agregar casos de uso,
  eventos de dominio y tenant scoping. No reescribir.
- **UX Research:** el usuario es no-técnico y móvil (técnico en obra);
  asistentes > formularios.
- **UI/UX senior:** shadcn/ui + tokens + motion para el look Linear/Stripe.
- **Frontend:** command palette, sheets, TanStack Table, skeletons, toasts.
- **Backend:** server actions con autorización (PR #2), validación Zod, servicios.
- **DBA:** multi-tenant + RLS + índices; migraciones versionadas (no solo `db push`).
- **Seguridad:** mergear PR #2, cerrar portal por teléfono, secretos fail-closed,
  auditar dependencias.
- **QA:** Vitest + Playwright en los flujos de dinero y de orden de trabajo.
- **DevOps:** lint+tests en CI, Sentry, previews por PR (ya hay Vercel).
- **IA:** usar IA donde quita trabajo real (resúmenes, mensajes, sugerencias),
  medir adopción.
- **Negocio:** modelar rentabilidad por dimensión y abonos recurrentes.
- **Marketing/conversión:** portal del cliente (aprobar/firmar) + automatización
  de seguimiento suben la conversión como en Jobber.

---

## Fuentes (benchmark)

- Jobber — funcionalidades y Client Hub: getjobber.com, reviews en Capterra/TechRadar/CrazyEgg.
- Housecall Pro — price book, app móvil, dispatch: housecallpro.com/features, G2, Capterra.
- ServiceTitan — pricebook/dispatch/reporting: servicetitan.com/product-tour, G2, TrustRadius.
- Tendencias FSM 2025/26 (IA scheduling, offline): Salesforce (future-of-field-service),
  ServiceTitan (blog/field-service-trends), IFS (blog top FSM 2026), IDC MarketScape.

*(Material de referencia, no vinculante. No se copió diseño ni código de terceros.)*
