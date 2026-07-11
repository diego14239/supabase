# Práctica: CRUD con React + TypeScript + Supabase

Proyecto de práctica (tarea de Felipe): un CRUD completo de "Tareas" usando el
mismo patrón de arquitectura que VentaPlay (Página → Hook integrado → Hook de
datos / Hook de acciones / Realtime → Supabase), más los "extras" que pidió:
tablas, bucket de Storage, Edge Function y Realtime.

## 1. Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratis (si no tienes).
2. "New project" → nombre libre, elige una contraseña de base de datos (guárdala,
   no la necesitas para este proyecto pero sí si entras por `psql`).
3. Espera ~2 minutos a que se aprovisione.

## 2. Crear la tabla, el bucket y activar Realtime

1. En el dashboard de tu proyecto: **SQL Editor** → **New query**.
2. Copia y pega TODO el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecútalo (▶ Run).

## 3. Conectar el proyecto local a tu Supabase

1. En el dashboard: **Project Settings** → **API**.
2. Copia **Project URL** y **anon public key**.
3. En esta carpeta, copia `.env.example` a `.env`:
   ```
   cp .env.example .env
   ```
4. Pega tus valores reales en `.env`.

## 4. Correr el proyecto

```
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`).

## 5. (Bonus) Desplegar la Edge Function

Requiere el [Supabase CLI](https://supabase.com/docs/guides/cli) instalado y logueado (`supabase login`, `supabase link`).

```
supabase functions deploy contar-tareas --no-verify-jwt
```

Se despliega sin verificación de JWT porque la llama el navegador sin sesión
(mismo motivo por el que varias funciones de VentaPlay usan `--no-verify-jwt`).

## Qué practicar acá

- `src/hooks/useTareasData.ts` — el mismo patrón de `useProductosStockData.ts`.
- `src/hooks/useTareasActions.ts` — el mismo patrón de `useProductosStockActions.ts`.
- `src/hooks/useTareasRealtime.ts` — Realtime con `postgres_changes`.
- `src/hooks/useTareas.ts` — hook integrado, igual a `useProductosStockIntegrated.ts`.
- `src/hooks/useSubirAdjunto.ts` — subir archivos a un bucket de Storage.
- `supabase/functions/contar-tareas/` — una Edge Function real en Deno.
