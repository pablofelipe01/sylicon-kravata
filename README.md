# Marketplace

![Pablo Felipe Acevedo Cuellar](public/Yo.png)

## Acerca del Proyecto

Marketplace es una plataforma revolucionaria para la tokenización de activos inmobiliarios en blockchain. Esta aplicación permite a los usuarios explorar, adquirir y gestionar tokens que representan fracciones de propiedad inmobiliaria, democratizando el acceso a inversiones en bienes raíces y creando nuevas oportunidades de mercado.

Desarrollado con tecnologías de vanguardia como Next.js, TypeScript y Tailwind CSS, Marketplace se integra con la API de Kravata para proporcionar funcionalidades robustas de gestión de tokens, verificación KYC y procesamiento de pagos.

## Características Principales

- **Marketplace de Tokens Inmobiliarios**: Explora, compra y vende tokens que representan fracciones de propiedades inmobiliarias.
- **Gestión de Billetera**: Visualiza y administra tus tokens en una interfaz intuitiva.
- **Verificación KYC**: Proceso de verificación de identidad integrado mediante Kravata.
- **Pagos con PSE**: Integración con el sistema de pagos PSE para transacciones seguras.
- **Historial de Transacciones**: Seguimiento detallado de todas tus operaciones.
- **Dashboard Personalizado**: Gestiona tus tokens y ofertas desde un panel centralizado.

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS  
- **Backend**: API Routes de Next.js, Supabase  
- **Base de Datos**: PostgreSQL (a través de Supabase)  
- **Autenticación**: Sistema personalizado con Kravata  
- **Pagos**: API de Kravata para PSE  
- **Blockchain**: Tokens ERC1155 en la red MATIC-AMOY

## Integración con Kravata

Marketplace se integra con la [API de Kravata](https://www.kravata.co/) para proporcionar una infraestructura financiera robusta y cumplir con requisitos regulatorios. La integración abarca tres áreas clave:

### Compliance (Cumplimiento)

El onboarding de usuarios sigue estos pasos:

1. **Generación del enlace KYC** mediante el endpoint `POST /formkyc`.
2. **Verificación** de la información suministrada.
3. **Creación automática de billetera** en caso de aprobación.
4. **Notificación del estado** del proceso.
5. **Transferencia de tokens** desde `TokenizerMintWallet` a `UserWallet` para usuarios premium.

Endpoints clave:
- Generación de enlace KYC
- Consulta de estado
- Notificación de onboarding completado

### Custody (Custodia)

Las billeteras son creadas automáticamente tras la aprobación KYC. Permiten:
- Monitoreo seguro de saldos
- Custodia adecuada de activos
- Transparencia en balances

Endpoint clave:
- Consulta de balance custodial

### Liquidity (Liquidez)

Gestión de órdenes financieras con activos fiat y digitales. Permite:
- Ingreso y retiro de fondos
- Historial y estado de transacciones
- Control y conciliación de eventos de liquidez

Endpoint clave:
- Creación de órdenes

## Inicio Rápido

1. **Requisitos previos**:
   - Node.js 18.x o superior
   - npm o yarn

2. **Instalación**:

```bash
git clone https://github.com/pablofelipe01/sylicon-kravata.git
cd sylicon-kravata

npm install
# o
yarn install
```

3. **Configuración**:
   Crea `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
NEXT_PUBLIC_API_BASE_URL=https://7lydmigox7.execute-api.us-east-2.amazonaws.com/sylicon-test
KRAVATA_API_KEY=tu-clave-de-api-kravata
```

4. **Sincronización de tokens**:

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
   Abre [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── kravata/
│   │   │   ├── balance/
│   │   │   ├── order/
│   │   │   │   ├── detail/
│   │   │   │   └── pse/
│   │   │   └── transactions/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── features/
│   │   │   ├── kyc/
│   │   │   ├── tokens/
│   │   │   ├── transactions/
│   │   │   └── orders/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── supabase.ts
│   │   └── formatters.ts
│   ├── contacto/
│   ├── dashboard/
│   ├── marketplace/
│   ├── nosotros/
│   └── page.tsx
└── public/
```

## Integración con la API de Kravata

- `/app/lib/api.ts`: Cliente API
- `/app/api/kravata/`: Endpoints proxy
- `/scripts/syncTokens.js`: Sincronización con Supabase

## Licencia y Derechos de Autor

![Pablo Felipe Acevedo Cuellar](public/Yo.png)

Este software es propiedad intelectual de **Pablo Felipe Acevedo Cuellar**, identificado con Cédula de Ciudadanía de la República de Colombia No. **79454772**.

Todos los derechos reservados.

### Marco Legal

Este software es propiedad intelectual de Pablo Felipe Acevedo Cuellar, identificado con Cédula de Ciudadanía de la República de Colombia No. 79454772.

**Este software es de naturaleza propietaria y todos los derechos están reservados, incluyendo, pero no limitado a, el código fuente, la interfaz de usuario, el diseño, la documentación y cualquier material asociado.**

Marco Legal

Este software está protegido por:
Ley 23 de 1982, modificada por la Ley 1915 de 2018 (Colombia)
Decreto 1360 de 1989
Decisión Andina 351 de 1993
Convenio de Berna, Tratados de la OMPI (WCT)

Queda estrictamente prohibido el uso, copia, distribución, modificación, ingeniería inversa o implementación parcial o total de este software sin un contrato de licenciamiento explícito y firmado con el propietario. Cualquier infracción de estos derechos constituye delito conforme a los artículos 270 a 272 del Código Penal Colombiano (Ley 599 de 2000) y puede acarrear las sanciones legales correspondientes.

**Copyright (c) 2025 Pablo Felipe Acevedo Cuellar. Todos los derechos reservados.**

**Para obtener una licencia de uso de este software, por favor contactar a pablofelipe@mac.com.**

## Más Información

- [Documentación de Next.js](https://nextjs.org/docs)
- [Aprende Next.js](https://nextjs.org/learn)

## Despliegue

Se recomienda desplegar con [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [guía de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

---

Desarrollado con ❤️ por **Pablo Felipe Acevedo Cuellar**
```
Estamos en Beta test
