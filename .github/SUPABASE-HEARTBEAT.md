# Keep Supabase Alive

Workflow: [`workflows/keep-supabase-alive.yml`](workflows/keep-supabase-alive.yml).

Workflow melakukan GET ke `/rest/v1/projects?select=id&limit=1`. Tabel `projects`
sesuai dengan `supabase_schema.sql` dan query aplikasi di `src/lib/supabase.js`.
Permintaan ini hanya membaca paling banyak satu ID, tanpa mengubah data.

## Konfigurasi

Fallback URL dan **public anon key** disalin dari konfigurasi `.env` proyek saat
workflow dibuat. `.env` tetap diabaikan Git; GitHub Actions tidak membaca file
lokal tersebut. Jangan menaruh `service_role` atau secret key di workflow.

GitHub Actions Secrets opsional dapat mengganti fallback:

| Nilai | Prioritas |
| --- | --- |
| URL | `SUPABASE_URL`, lalu `VITE_SUPABASE_URL`, lalu fallback |
| Public key | `SUPABASE_ANON_KEY`, lalu `VITE_SUPABASE_ANON_KEY`, lalu `VITE_SUPABASE_PUBLISHABLE_KEY`, lalu fallback |

Jika pindah proyek atau mengganti key di `.env`, perbarui **URL dan key** di
Secrets atau fallback workflow juga. Keduanya harus berasal dari proyek yang sama.
Publishable key memakai header `apikey`; JWT anon key juga memakai `Authorization`.

## Menjalankan

1. Push workflow ke default branch repository GitHub dan pastikan Actions aktif.
2. Buka **Actions → Keep Supabase Alive → Run workflow** untuk uji manual.
3. Status HTTP `200` atau `206` berarti berhasil. Status lain atau kegagalan
   jaringan membuat job gagal, sehingga masalah terlihat di Actions.

Cron `0 0 */2 * *` mengikuti contoh: pukul **07.00 WIB / 00.00 UTC** pada tanggal
ganjil setiap bulan. Biasanya berjarak dua hari; pergantian bulan dapat berjarak
satu hari. Curl memiliki timeout dan retry untuk gangguan sementara.

Heartbeat tidak menjamin Supabase selalu aktif dan tidak melanjutkan proyek yang
sudah di-pause. Supabase menentukan pause berdasarkan aktivitas. Jadwal GitHub
juga dapat tertunda; repository publik dapat menonaktifkan jadwal setelah 60 hari
tanpa aktivitas repository. Periksa status Actions dan Supabase jika ping gagal.

Referensi: [Supabase project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)
dan [GitHub schedule events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
