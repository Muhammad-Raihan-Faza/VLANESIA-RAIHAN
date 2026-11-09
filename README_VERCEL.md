# VLANesia — Vercel + Supabase (versi perbaikan v1.1)

## Yang diperbaiki dari versi sebelumnya

1. **`api/index.mjs` → `api/index.js`**: handler lama memakai gaya Web `(request)` sehingga `new URL(request.url)` crash di Vercel (semua `/api/*` error). Sekarang memakai handler Node `(req, res)` resmi.
2. **`supabase_setup.sql`** ditambah `GRANT ... TO service_role` + `NOTIFY pgrst, 'reload schema'`. Sejak 2026 Supabase tidak otomatis membuka tabel baru ke Data API; tanpa GRANT muncul error `42501 permission denied`.
3. **Key `sb_secret_...`** hanya dikirim lewat header `apikey` (bukan `Authorization: Bearer`), sesuai dokumentasi Supabase.
4. **Environment variable toleran**: kutip, spasi, newline, garis miring akhir, atau `/rest/v1/` pada `SUPABASE_URL` dirapikan otomatis. Nama alternatif `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SERVICE_KEY` / `NEXT_PUBLIC_SUPABASE_URL` juga dibaca.
5. **`/api/health` sekarang diagnostik**: menampilkan penyebab (key salah, tabel belum dibuat, belum GRANT, URL salah) tanpa pernah menampilkan isi key.
6. `vercel.json` menetapkan `outputDirectory: public`; `package.json` memakai Node `20.x`.

## Cara deploy ringkas

1. Upload **isi** folder ini ke root repository GitHub (`vercel.json`, `package.json`, `public/`, `api/` langsung di root).
2. Supabase > SQL Editor > jalankan **seluruh** `supabase_setup.sql`.
3. Vercel > Add New > Project > Import repo. Framework Preset: **Other**. Build Command & Output Directory: biarkan default.
4. Environment Variables: `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` (centang Production, Preview, Development). Lalu Deploy.
5. Buka `https://domainmu.vercel.app/api/health` → harus `"ok": true` dan `"global": true`.

Panduan lengkap dari nol ada di file Word `Panduan_Hosting_VLANesia_Vercel_Supabase.docx`.

**Setiap kali mengubah Environment Variables, wajib Redeploy** agar nilai baru terbaca.

## Menjalankan di laptop

`node server.js` atau klik `start.bat`; buka `http://127.0.0.1:3000`. Tanpa `.env`, mode lokal dipakai **hanya di laptop** (data tersimpan di `data/local-db.json`).

## Catatan keamanan

- Login memakai alias sesi, **bukan** akun/password. Dashboard guru belum dibatasi role. Jangan dipakai untuk data pribadi/sensitif sebelum menambah autentikasi.
- `SUPABASE_SECRET_KEY` jangan pernah masuk ke GitHub, `app.js`, atau `index.html`.
