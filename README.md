# Marketplace

![Pablo Felipe Acevedo Cuellar](public/Yo.png)

## Acerca del Proyecto

Marketplace es una plataforma revolucionaria para la tokenización de activos inmobiliarios en blockchain. Esta aplicación permite a los usuarios comprar, vender y gestionar tokens que representan fracciones de propiedad inmobiliaria, democratizando el acceso a inversiones en bienes raíces y creando nuevas oportunidades de mercado.

Desarrollado con tecnologías de vanguardia como Next.js, TypeScript y Tailwind CSS, Sylicon Marketplace se integra con la API de Kravata para proporcionar funcionalidades robustas de gestión de tokens, verificación KYC y procesamiento de pagos.

## Características Principales

- **Marketplace de Tokens Inmobiliarios**: Explora, compra y vende tokens que representan fracciones de propiedades inmobiliarias.
- **Gestión de Billetera**: Visualiza y administra tus tokens en una interfaz intuitiva.
- **Verificación KYC**: Proceso de verificación de identidad integrado a través de Kravata.
- **Pagos con PSE**: Integración con el sistema de pagos PSE para transacciones seguras.
- **Historial de Transacciones**: Seguimiento detallado de todas tus operaciones de compra y venta.
- **Dashboard Personalizado**: Gestiona tus tokens y ofertas en el mercado desde un panel centralizado.

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: API Routes de Next.js, Supabase
- **Base de Datos**: PostgreSQL (a través de Supabase)
- **Autenticación**: Sistema de autenticación personalizado con Kravata
- **Integración de Pagos**: API de Kravata para PSE
- **Blockchain**: Integración con tokens ERC1155 en la red MATIC-AMOY

## Integración con Kravata

Sylicon Marketplace se integra con la [API de Kravata](https://www.kravata.co/) para proporcionar una infraestructura financiera robusta y cumplir con los requisitos regulatorios. Esta integración abarca tres áreas principales:

### Compliance (Cumplimiento)

El proceso de onboarding de usuarios a través de la API de Kravata sigue estos pasos:

* **Generación del enlace KYC**: La plataforma solicita un enlace de formulario KYC a través del endpoint **POST /formkyc**.
* **Verificación KYC**: La API valida la información presentada y determina si el usuario es aprobado o rechazado.
* **Creación de billetera**: Si el usuario es aprobado, se genera automáticamente una billetera digital.
* **Notificación de estado de onboarding**: La API notifica el resultado del proceso de verificación.
* **Notificación de transferencia de tokens**: Para usuarios premium, se gestiona la transferencia de tokens desde **TokenizerMintWallet** a **UserWallet**.

Endpoints clave:
* **Generación de enlace KYC**: Solicitud de enlace para que el usuario inicie su proceso de verificación.
* **Verificación de estado de onboarding**: Permite consultar el estado del usuario en cualquier momento.
* **Notificación de finalización de onboarding**: La API notifica cuando el usuario ha sido aprobado y su billetera ha sido creada.

### Custody (Custodia)

Esta sección incluye todos los endpoints relacionados con la gestión de billeteras de usuarios bajo la custodia de Kravata. Estas billeteras se crean automáticamente una vez que un usuario completa el proceso de onboarding y es aprobado mediante la verificación KYC.

Las billeteras custodiales permiten a la plataforma:
* Acceder y monitorear de forma segura los saldos de los usuarios
* Garantizar la custodia adecuada de los activos digitales
* Proporcionar transparencia en los saldos disponibles

Endpoint clave:
* **Consulta de balance**: Permite recuperar el saldo actual de la billetera custodial del usuario, esencial para verificar la disponibilidad de fondos antes de iniciar transacciones o mostrar saldos dentro de la plataforma.

### Liquidity (Liquidez)

Esta sección contiene todos los endpoints relacionados con la creación y gestión de órdenes financieras que involucran activos fiat y digitales dentro de la infraestructura de Kravata.

Este módulo permite a la plataforma:
* Iniciar flujos operativos como entrada de fondos, salida de fondos o movimientos relacionados con criptomonedas según la lógica de negocio.
* Gestionar el historial de transacciones y seguimiento de estado
* Controlar, rastrear y reconciliar todos los eventos de liquidez.

Endpoint clave:
* **Creación de órdenes**: Permite iniciar una orden financiera, desencadenando un proceso de transacción que puede involucrar fondos fiat, stablecoins o ambos, dependiendo del tipo de orden y destino.

## Inicio Rápido

1. **Requisitos previos**:
   - Node.js 18.x o superior
   - npm o yarn

2. **Instalación**:

```bash
# Clonar el repositorio
git clone https://github.com/pablofelipe01/sylicon-kravata.git
cd sylicon-kravata

# Instalar dependencias
npm install
# o
yarn install
```

3. **Configuración**:
   - Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
NEXT_PUBLIC_API_BASE_URL=https://7lydmigox7.execute-api.us-east-2.amazonaws.com/sylicon-test
KRAVATA_API_KEY=tu-clave-de-api-kravata
```

4. **Sincronización de tokens**:
   - Para sincronizar los tokens desde la API de Kravata a tu base de datos local:

```bash
npm run sync-tokens
```

5. **Desarrollo**:

```bash
npm run dev
# o
yarn dev
```

6. **Acceso**:
   - Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/                         # API Routes
│   │   ├── kravata/                 # Endpoints para Kravata API
│   │   │   ├── balance/             # Consulta de balance
│   │   │   ├── order/               # Gestión de órdenes
│   │   │   │   ├── detail/          # Detalle de órdenes
│   │   │   │   └── pse/             # Integración con PSE
│   │   │   └── transactions/        # Historial de transacciones
│   ├── components/                  # Componentes React
│   │   ├── ui/                      # Componentes UI básicos
│   │   ├── layout/                  # Header, Footer, etc.
│   │   ├── features/                # Componentes de características
│   │   │   ├── kyc/                 # Componentes KYC
│   │   │   ├── tokens/              # Gestión de tokens
│   │   │   ├── transactions/        # Historial de transacciones
│   │   │   └── orders/              # Gestión de órdenes
│   ├── contexts/                    # Contextos React
│   │   └── AuthContext.tsx          # Gestión de autenticación
│   ├── lib/                         # Utilidades
│   │   ├── api.ts                   # Cliente API de Kravata
│   │   ├── supabase.ts              # Cliente Supabase
│   │   └── formatters.ts            # Funciones de formato
│   ├── contacto/                    # Página de contacto
│   ├── dashboard/                   # Página de cuenta de usuario
│   ├── marketplace/                 # Página de marketplace
│   ├── nosotros/                    # Página de información del equipo
│   └── page.tsx                     # Página de inicio
└── public/                          # Archivos estáticos
```

## Integración con la API de Kravata

La integración con la API de Kravata se gestiona principalmente a través de los siguientes componentes:

- `/app/lib/api.ts`: Funciones para interactuar con la API de Kravata
- `/app/api/kravata/`: Endpoints proxy para la API de Kravata
- `/scripts/syncTokens.js`: Script para sincronizar tokens desde Kravata a Supabase

## Licencia y Derechos de Autor

![Pablo Felipe Acevedo Cuellar](public/Yo.png)

Este software es propiedad intelectual de Pablo Felipe Acevedo Cuellar con Cédula de Ciudadanía de la República de Colombia #79454772. Todos los derechos reservados.

### Marco Legal

Este software está protegido por:

- **Legislación colombiana**: Ley 23 de 1982 sobre Derechos de Autor, modificada por la Ley 1915 de 2018, que regula la protección de obras literarias, artísticas y científicas, incluyendo software.
  
- **Decreto 1360 de 1989**: Que reglamenta específicamente la inscripción del soporte lógico (software) en el Registro Nacional de Derecho de Autor en Colombia.

- **Decisión Andina 351 de 1993**: Que establece el Régimen Común sobre Derecho de Autor y Derechos Conexos para los países miembros de la Comunidad Andina.

- **Tratados internacionales**: Incluyendo el Convenio de Berna para la Protección de Obras Literarias y Artísticas, y los Tratados de la OMPI sobre Derecho de Autor (WCT).

Su uso, modificación, distribución o implementación está estrictamente prohibido sin un contrato de licenciamiento de software explícito firmado por el propietario. Cualquier uso no autorizado constituye una infracción a los derechos de autor y puede dar lugar a responsabilidad civil y penal según lo establecido en los artículos 270 a 272 del Código Penal Colombiano (Ley 599 de 2000).

## Más Información

Para más información sobre Next.js:

- [Documentación de Next.js](https://nextjs.org/docs)
- [Aprende Next.js](https://nextjs.org/learn)

## Despliegue

La forma más sencilla de desplegar esta aplicación es utilizar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

---

Desarrollado con ❤️ por Pablo Felipe Acevedo Cuellar y el equipo de Sylicon.