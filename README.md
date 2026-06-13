# Mates Aconcagua — E-commerce

Tienda online de productos de mate artesanales de Mendoza, Argentina. Plataforma completa con catálogo de productos, carrito de compras, checkout con Mercado Pago, panel de administración y asistente virtual integrado.

---

## Stack tecnológico

**Frontend**
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-7.1-CA4245?logo=reactrouter&logoColor=white&style=flat-square)

**Backend**
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white&style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white&style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white&style=flat-square)

**Infraestructura & Servicios**
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel&logoColor=white&style=flat-square)
![Railway](https://img.shields.io/badge/Railway-Backend-0B0D0E?logo=railway&logoColor=white&style=flat-square)
![MercadoPago](https://img.shields.io/badge/Mercado_Pago-Payments-009EE3?logo=mercadopago&logoColor=white&style=flat-square)
![n8n](https://img.shields.io/badge/n8n-Automatizaciones-EA4B71?logo=n8n&logoColor=white&style=flat-square)

---

## Características principales

### Tienda
- Catálogo de productos con categorías (Mates, Bombillas, Yerba, Accesorios)
- Búsqueda por nombre, descripción y categoría
- Filtros por categoría y rango de precio
- Ordenamiento por precio y nombre
- Paginación (8 productos por página)
- Página de detalle con imágenes múltiples

### Carrito y Checkout
- Carrito persistente en `localStorage` para usuarios anónimos
- Sincronización automática con el backend al iniciar sesión
- Formulario de checkout con datos de envío y contacto
- Envío gratuito a todo el país
- Integración con **Mercado Pago** para pagos seguros
- Páginas de resultado para pago exitoso, fallido y pendiente

### Autenticación
- Registro e inicio de sesión con email y contraseña
- Sesiones basadas en **JWT** con verificación de expiración
- Rol de administrador derivado del payload del token
- Persistencia de sesión en `localStorage`

### Panel de Administración
- Dashboard con métricas: productos activos, stock total, valor de inventario
- Alertas de stock bajo (≤ 20 unidades)
- CRUD completo de productos con soporte para imágenes múltiples
- Gestión de pedidos con actualización de estado (pendiente → preparando → enviado → completado)

### Asistente Virtual
- Chatbot flotante integrado con flujos de **n8n**
- Respuestas de fallback para preguntas frecuentes sin conexión
- Historial de sesión persistente (TTL de 10 minutos)
- Sanitización HTML con **DOMPurify** para prevenir XSS
- Links de productos clickeables dentro del chat

### Automatizaciones (n8n)
- Email de bienvenida al registrarse
- Recordatorio de carrito abandonado (15 minutos de inactividad)
- Confirmación de compra exitosa
- Notificación de pago fallido

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                    │
│                    React + Vite                         │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Tienda  │  │  Admin   │  │ Checkout │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  Context: AuthContext · CartContext · ProductsContext   │
│  Services: cartService · orderService · n8nService      │
└────────────────────────┬────────────────────────────────┘
                         │ REST API (JWT)
┌────────────────────────▼────────────────────────────────┐
│                   BACKEND (Railway)                     │
│               Spring Boot 3 · Java 17                   │
│                                                         │
│  /api/auth      /api/products    /api/orders            │
│  /api/cart      /api/checkout    /api/webhooks          │
│                                                         │
│                    MySQL 8.0                            │
└─────────────────────────────────────────────────────────┘
                         │
           ┌─────────────┴──────────────┐
           │                            │
┌──────────▼──────┐          ┌──────────▼──────┐
│  Mercado Pago   │          │      n8n         │
│  (Pagos)        │          │ (Automatizaciones│
└─────────────────┘          └─────────────────┘
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── auth/           # BrandPanel
│   ├── cart/           # CartDrawer, CartButton, CartItem
│   ├── chat/           # ChatWidget (n8n)
│   ├── layout/         # Header, Footer, Layout
│   ├── products/       # ProductCard, HeroCarousel, FeaturedProducts
│   └── ui/             # Button, Input, Modal, Skeleton
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ProductsContext.jsx
├── hooks/
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   └── usePageSEO.js
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx
│   ├── Checkout.jsx
│   ├── CheckoutResult.jsx
│   ├── Orders.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── About.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       └── AdminOrders.jsx
├── routes/
│   └── AppRouter.jsx
└── services/
    ├── api.js
    ├── cartService.js
    ├── orderService.js
    ├── productService.js
    └── n8nService.js
```

---

## Configuración local

### Requisitos previos

- Node.js 18+
- pnpm 8+
- Java 17+
- Maven
- MySQL 8.0

### Frontend

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/ecommerce-mates.git
cd ecommerce-mates

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Completar los valores en .env

# Iniciar servidor de desarrollo
pnpm dev
```

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# URL del backend
VITE_API_URL=https://tu-api.up.railway.app

# Mercado Pago — solo la Public Key va en el frontend
VITE_MP_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Webhook del chatbot (n8n)
VITE_N8N_CHAT_URL=https://tu-n8n.example.com/webhook/chat-ecommerce
```

### Backend

El backend se encuentra en un repositorio separado. Requiere las siguientes variables de entorno en Railway (o en `application.properties` para desarrollo local):

```env
DB_URL=jdbc:mysql://host:3306/mates_db
DB_USERNAME=usuario
DB_PASSWORD=contraseña
JWT_SECRET=secreto-jwt-muy-largo
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxx...
APP_BASE_URL=https://tu-frontend.vercel.app
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo en `localhost:5173` |
| `pnpm build` | Build de producción en `/dist` |
| `pnpm preview` | Preview del build de producción |
| `pnpm test` | Ejecutar tests con Vitest |
| `pnpm test:ui` | Tests con interfaz visual |
| `pnpm test:coverage` | Reporte de cobertura |

---

## Despliegue

### Frontend — Vercel

El proyecto incluye `vercel.json` con:
- Rewrite de rutas para SPA (`/* → /index.html`)
- Headers de seguridad: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`

### Backend — Railway

El backend se despliega automáticamente desde su repositorio con:
```toml
buildCommand = "./mvnw clean package"
startCommand = "java -jar target/*.jar"
```

---

## Seguridad

- Precios validados contra la base de datos en el backend (nunca se confía en precios del cliente)
- Tokens JWT verificados en cada request protegido
- Rol de admin derivado del payload del JWT (no del localStorage)
- HTML del chatbot sanitizado con DOMPurify (previene XSS)
- Headers de seguridad HTTP configurados en Vercel
- Endpoint de checkout requiere autenticación

---

## Contacto

**Mates Aconcagua** — Mendoza, Argentina  
Email: [lorenzocona14@gmail.com](mailto:lorenzocona14@gmail.com)
