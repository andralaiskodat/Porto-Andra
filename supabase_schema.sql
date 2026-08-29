-- ============================================================================
-- SQL SCHEMA FOR PORTO-ANDRA (SUPABASE)
-- Jalankan script ini di Supabase Dashboard: SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Buat Tabel Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  category text not null default 'Web/Apps',
  tech text[] not null default '{}',
  link text default '',
  image text not null
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.projects enable row level security;

-- 3. Policy untuk publik membaca data proyek
create policy "Allow public read access on projects" 
  on public.projects 
  for select 
  using (true);

-- 4. Policy untuk mengizinkan insert, update, delete
create policy "Allow full access on projects" 
  on public.projects 
  for all 
  using (true)
  with check (true);

-- ============================================================================
-- 5. Storage Bucket Configuration (project-images)
-- ============================================================================
-- Buat bucket penyimpanan gambar jika belum ada
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Policy agar publik dapat melihat/mengunduh gambar
create policy "Public Access for project-images"
  on storage.objects for select
  using ( bucket_id = 'project-images' );

-- Policy agar user dapat mengunggah gambar (maks 5MB)
create policy "Allow public uploads for project-images"
  on storage.objects for insert
  with check ( bucket_id = 'project-images' );

-- Policy untuk update gambar
create policy "Allow update for project-images"
  on storage.objects for update
  using ( bucket_id = 'project-images' );

-- Policy untuk delete gambar
create policy "Allow delete for project-images"
  on storage.objects for delete
  using ( bucket_id = 'project-images' );
