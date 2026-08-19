# Servicios Integrales — Plataforma comercial

Plataforma web para una empresa de **servicios integrales** (alarmas, cámaras,
electricidad, domótica, energía solar, redes y mantenimiento) orientada a
hogares y comercios. No es una web institucional: es una herramienta comercial
para **captar clientes, cotizar servicios, calcular precios y administrar
presupuestos e instalaciones**.

Estética tecnológica moderna, mobile-first, PWA instalable.

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** (paleta de marca por variables CSS, cambiable desde config)
- **PostgreSQL** vía **Prisma ORM** (compatible con Neon, Railway, Vercel
  Postgres, RDS o el Postgres administrado de Supabase — la app **no** depende
  de Supabase)
- **PWA** (manifest + responsive + instalable)
- Preparado para deploy en **Vercel**

> La autenticación no está implementada todavía (Fase 1). La arquitectura queda
> preparada para **Supabase Auth + roles** (ADMIN, SELLER, INSTALLER, CUSTOMER)
> y Row Level Security. Ver [Seguridad](#seguridad).

---

## Arquitectura

Separación clara por capas y por área:

```
src/
├─ app/
│  ├─ (public)/            → Aplicación pública (Home, servicios, cotizadores)
│  │  ├─ [slug]/           → Páginas SEO por servicio (/alarmas, /camaras, …)
│  │  ├─ cotizar/          → Cotizadores (alarmas, cámaras, electricidad, solar)
│  │  └─ contacto/
│  ├─ admin/               → Panel administrativo
│  ├─ client/              → Portal de clientes (placeholder, Fase 3)
│  └─ actions/             → Server actions (leads, admin)
├─ components/
│  ├─ ui/                  → Componentes reutilizables (Button, Card, Icon…)
│  ├─ layout/              → Header, Footer, WhatsApp flotante
│  └─ admin/               → UI del panel admin
├─ features/
│  └─ quoter/              → Lógica y UI de los cotizadores (wizards)
├─ config/                 → Configuración central (empresa, servicios)
├─ data/                   → Capa de acceso a datos (catálogo, admin, leads, seed)
└─ lib/                    → Lógica de negocio pura (pricing, whatsapp, prisma)
prisma/
├─ schema.prisma          → Esquema de base de datos
└─ seed.ts                → Carga inicial (productos Vetti de la lista, etc.)
```

**Principios aplicados**

- **Lógica de negocio, UI y acceso a datos separados.** El motor de precios
  (`src/lib/pricing.ts`) es puro y no conoce ni Prisma ni React.
- **Precios nunca hardcodeados.** El tipo de cambio, IVA y márgenes viven en la
  tabla `settings`. Los precios de productos vienen de la base.
- **Componentes reutilizables**, sin duplicación.
- **Modo demo:** sin `DATABASE_URL`, la app arranca con los datos del seed en
  memoria (solo lectura) para poder verla funcionando sin base configurada.

---

## Configuración central de la empresa

Todo lo editable de marca está en **`src/config/site.ts`**:

- Nombre, logo, tagline y descripción
- Teléfono, WhatsApp, email, dirección
- **Colores** de la paleta (se inyectan como variables CSS → cambian todo el sitio)

Las áreas de servicio y sus textos SEO están en **`src/config/services.ts`**.

---

## Puesta en marcha (desarrollo)

Requisitos: Node 20+.

```bash
# 1) Dependencias
npm install

# 2) Variables de entorno
cp .env.example .env
#   Editá DATABASE_URL y DIRECT_URL. (Sin ellas, corre en modo demo.)

# 3) Base de datos (si configuraste las variables)
npm run db:generate      # genera el cliente Prisma
npm run db:push          # crea las tablas en la base (o: npm run db:migrate)
npm run db:seed          # carga productos Vetti, servicios, paquetes, config

# 4) Levantar
npm run dev              # http://localhost:3000
```

### Base de datos en Neon (recomendado)

1. Entrá a [neon.tech](https://neon.tech) y creá un proyecto (plan free alcanza).
   Elegí una región cercana (ej: AWS `us-east-2`).
2. En el proyecto, abrí **Connect** (o "Connection Details").
3. Copiá **dos** connection strings:
   - La **pooled** (el host tiene `-pooler`) → va en `DATABASE_URL`.
   - La **directa** (sin `-pooler`) → va en `DIRECT_URL`.
   Si solo ves una, activá el toggle **Connection pooling** para ver la pooled;
   la directa es la misma URL pero sin `-pooler` en el host.
4. Pegá ambas en tu `.env` (ver `.env.example`). Deben terminar en
   `?sslmode=require`.
5. Creá las tablas y cargá los datos iniciales:
   ```bash
   npm run db:push
   npm run db:seed
   ```
6. `npm run dev` → la app deja el modo demo y persiste todo en Neon.

> Prisma usa `DIRECT_URL` para migrar (la pooled de Neon usa PgBouncer y no es
> ideal para DDL) y `DATABASE_URL` (pooled) para las consultas de la app.

Rutas útiles:

- `/` — Home
- `/alarmas`, `/camaras`, `/electricidad`, `/domotica`, `/energia-solar`, `/redes`
- `/cotizar/alarmas` — wizard de alarmas (el módulo central)
- `/cotizar/camaras`, `/cotizar/electricidad`, `/cotizar/solar`
- `/admin` — panel administrativo
- `/client` — portal de clientes (placeholder)

---

## Modelo de precios

Los **costos (USD)** están separados de los **precios de venta (ARS)**:

```
costo ARS sin IVA = costo USD × dólar
IVA               = costo ARS sin IVA × iva     (si el producto lleva IVA)
costo final ARS   = costo sin IVA + IVA
precio de venta   = costo final × (1 + margen%)
```

- `dólar`, `iva` y `margen por defecto` se editan en **Admin → Configuración**.
- Cada producto puede tener su propio margen.
- La **financiación no modifica el margen**: el costo financiero se calcula y se
  muestra por separado (Admin → Financiación), igual que en los cotizadores.

Datos iniciales cargados (de la lista provista, en USD **sin IVA**): kit
Smart Alarm Standard y sensores/accesorios Vetti. **No se inventaron productos
ni precios.** La categoría de cámaras Uniview/Uniarch queda creada pero sin
precios (la lista no los incluía): el cotizador de cámaras recolecta la
configuración y genera una solicitud para cotizar a medida.

---

## Deploy en Vercel

1. Importá el repo en Vercel.
2. Configurá las variables de entorno: `DATABASE_URL` (pooled de Neon),
   `DIRECT_URL` (directa de Neon), `NEXT_PUBLIC_SITE_URL` y —para cerrar el
   panel— `AUTH_SECRET` + `AUTH_ADMIN_PASSWORD`.
3. Build command: `npm run build` (ya corre `prisma generate`; no necesita DB).
4. Creá las tablas y cargá el seed una sola vez. Podés hacerlo desde tu máquina
   apuntando a Neon (`npm run db:push && npm run db:seed`) o con
   `npx prisma migrate deploy` si usás migraciones versionadas.

> Tip Neon + Vercel: si integrás Neon desde el Marketplace de Vercel, las
> variables se cargan solas; verificá igual que `DATABASE_URL` sea la pooled.

---

## Estado por fases

**Fase 1 (implementada)**

- [x] Home de alta conversión + páginas SEO por servicio
- [x] Cotizador de alarmas (wizard con resumen y precio en tiempo real)
- [x] Cotizador de cámaras (recolección de requisitos → cotización a medida)
- [x] Cotizadores de electricidad (visita técnica) y solar (estimación preliminar)
- [x] WhatsApp integrado en toda la plataforma + mensaje de presupuesto armado
- [x] Base de datos (esquema completo) + seed con la lista Vetti
- [x] Captura de leads (CRM básico) desde todos los formularios
- [x] Admin: dashboard, productos y precios, configuración (tipo de cambio),
      financiación, mano de obra, clientes, leads, listado de presupuestos

**Fase 2 (implementada)**

- [x] Constructor de presupuestos formales con totales automáticos
      (costo, venta, ganancia, margen, descuento y forma de pago)
- [x] Flujo de estados del presupuesto; al **aceptar** se crea automáticamente
      la **orden de trabajo** con el checklist de alarma
- [x] Órdenes de trabajo: listado y detalle, asignación de instalador, fecha,
      dirección, estados y notas
- [x] Instaladores (alta y listado)
- [x] **App del instalador** (mobile-first): trabajos asignados, detalle de la
      orden, materiales con marcado de instalados, checklist, observaciones,
      fotos (por enlace) y conformidad del cliente → finaliza la instalación
- [x] Registro de instalaciones y **garantías**

> Las fotos hoy se registran por enlace; la carga de archivos se integrará con
> Supabase Storage.

**Fase 3 (implementada)**

- [x] **Portal de clientes** (`/client`): acceso por teléfono (stand-in de
      Supabase Auth) para ver presupuestos, órdenes, instalaciones, garantías y
      mantenimientos propios
- [x] **Mantenimiento**: agenda y seguimiento (preventivo, reparación, visita
      técnica, ampliación, cambio de batería) por instalación
- [x] **Stock**: control de existencias con alerta de stock bajo; se descuenta
      automáticamente al finalizar una instalación
- [x] **Facturación**: comprobante imprimible / PDF por presupuesto (base para
      facturación electrónica; hoy sin AFIP)
- [x] **Domótica**: formulario de consulta con captura de lead

> Cambio de esquema en esta fase: se agregó `stock` y `lowStockThreshold` a
> `products`. Si ya tenías la base creada, corré `npm run db:push` (o una
> migración) para aplicarlo.

**Pendiente para producción**

- [ ] Autenticación real (Supabase Auth) + Row Level Security en `/admin`,
      `/installer` y `/client`
- [ ] Carga de fotos con Supabase Storage
- [ ] Facturación electrónica (AFIP)

---

## Seguridad

Hay una **protección de acceso interina** (middleware + sesión firmada) sobre
`/admin` y `/installer`, lista para reemplazar por **Supabase Auth** sin tocar
el resto de la app:

- Configurá `AUTH_ADMIN_PASSWORD` y/o `AUTH_INSTALLER_PASSWORD` (+ `AUTH_SECRET`)
  para exigir login en `/login`. Sin contraseñas, el panel queda abierto
  (modo dev/demo), coherente con el resto de la plataforma.
- Roles: `ADMIN` (acceso total) e `INSTALLER` (solo `/installer`).
- La lógica de identidad está aislada en `src/lib/auth.ts`: para migrar a
  Supabase Auth se reemplaza la verificación de sesión ahí.

Arquitectura lista para el modelo completo de roles:

- Tabla `users` con enum `UserRole` (ADMIN, SELLER, INSTALLER, CUSTOMER).
- Al integrar Supabase Auth, agregar **Row Level Security** para que el rol
  CUSTOMER solo acceda a su propia información.
- Variables previstas en `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, etc.).

> ⚠️ En producción, definí `AUTH_SECRET` y las contraseñas (o integrá Supabase
> Auth) antes de exponer `/admin`.

## Integración continua (CI)

`.github/workflows/ci.yml` corre en cada push y PR: instala dependencias,
genera el cliente Prisma, hace **typecheck** y **build**. No requiere base de
datos (las páginas que la usan son dinámicas y degradan a modo demo).

---

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (incluye `prisma generate`) |
| `npm run start` | Servidor de producción |
| `npm run typecheck` | Chequeo de tipos |
| `npm run db:migrate` | Migraciones de Prisma |
| `npm run db:push` | Sincroniza el esquema sin migración |
| `npm run db:seed` | Carga datos iniciales |
| `npm run db:studio` | Prisma Studio |
