-- =====================================================================
-- Ejecuta esto en: Supabase Dashboard -> tu proyecto -> SQL Editor -> New query
-- =====================================================================

-- 1) Tabla principal
create table if not exists public.tareas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  completada boolean not null default false,
  adjunto_url text,
  created_at timestamptz not null default now()
);

-- 2) Row Level Security
-- IMPORTANTE: acá la DESACTIVAMOS a propósito porque es un proyecto de práctica
-- sin login (así lo pidió Felipe). En VentaPlay real, TODAS las tablas tienen
-- RLS activado con políticas que filtran por organizacion_id — nunca se deja
-- una tabla sin RLS en producción. Esto es solo para que puedas practicar
-- CRUD sin la complejidad de auth todavía.
alter table public.tareas disable row level security;

-- 3) Realtime: hay que agregar la tabla a la publicación para que
-- supabase.channel(...).on('postgres_changes', ...) reciba los eventos.
alter publication supabase_realtime add table public.tareas;

-- =====================================================================
-- 4) Bucket de Storage para los adjuntos (alternativa a hacerlo por Dashboard:
-- Storage -> New bucket -> nombre "adjuntos-tareas" -> Public bucket = ON)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('adjuntos-tareas', 'adjuntos-tareas', true)
on conflict (id) do nothing;

-- Política para permitir subir/leer archivos sin login (mismo criterio que arriba:
-- solo aceptable porque es un proyecto de práctica sin auth).
create policy "Acceso publico de practica a adjuntos-tareas"
on storage.objects for all
using (bucket_id = 'adjuntos-tareas')
with check (bucket_id = 'adjuntos-tareas');
