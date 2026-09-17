# MASTER PROMPT — Portfolio Website Neumorphism (React + Vite)

Gunakan prompt ini secara utuh di Cursor AI, Bolt.new, v0.dev, atau tool AI coding lainnya.

---

## 🎯 PROJECT OVERVIEW

Buatkan website portofolio personal dengan tema **Neumorphism (Soft UI)** yang elegan, modern, dan premium — terinspirasi dari UI dashboard fitness app, music player, dan komponen soft-shadow yang halus (bukan neumorphism "kotak polos" yang datar dan membosankan). Website harus terasa seperti produk digital nyata (app UI), bukan landing page biasa.

**Tech Stack (WAJIB):**
- React 18 (Vite sebagai build tool, **bukan** Next.js/CRA)
- Tailwind CSS v3 (custom config untuk shadow neumorphism)
- Framer Motion (untuk micro-interaction & page transition)
- React Icons atau Lucide React (icon set)
- React Router DOM (jika multi-page/section routing dibutuhkan)

---

## 🎨 DESIGN SYSTEM

### Palet Warna
```
--bg-base:        #E8ECF1   /* background utama, abu-abu kebiruan lembut */
--bg-card:        #ECF0F3   /* background card, sedikit lebih terang dari base */
--shadow-light:   #FFFFFF   /* highlight shadow (arah kiri-atas) */
--shadow-dark:    #A3B1C6   /* shadow gelap (arah kanan-bawah) */
--text-primary:   #2E3440   /* teks utama, abu gelap kebiruan */
--text-secondary: #6B7785   /* teks sekunder/caption */
--accent-primary: #7C6EF2   /* ungu — untuk CTA, active state, progress */
--accent-secondary: #F2739E /* pink — untuk highlight sekunder, badge */
--accent-gradient: linear-gradient(135deg, #7C6EF2 0%, #F2739E 100%)
```

### Formula Shadow Neumorphism (INTI dari desain ini)
Semua elemen "timbul" (raised) menggunakan dual-shadow:
```css
box-shadow: 8px 8px 16px var(--shadow-dark),
            -8px -8px 16px var(--shadow-light);
```
Elemen "tertekan" (pressed/inset — untuk input aktif, tombol yang diklik):
```css
box-shadow: inset 6px 6px 12px var(--shadow-dark),
            inset -6px -6px 12px var(--shadow-light);
```
Untuk komponen kecil (icon button, toggle) gunakan shadow lebih tipis (4px/8px blur), untuk card besar gunakan shadow lebih tebal (10px/20px blur). Selalu **soft, tidak pernah tajam/hard-edge**.

### Border Radius
Gunakan radius besar & konsisten agar terasa "lembut": `rounded-2xl` (16px) untuk card kecil, `rounded-3xl` (24px) untuk card besar, `rounded-full` untuk avatar/icon button bulat.

### Tipografi
- Heading: **Poppins** atau **Space Grotesk** (bold, sedikit tight letter-spacing)
- Body: **Inter** atau **DM Sans**
- Hierarki: H1 (56-72px bold), H2 (36-40px semibold), Body (16px regular), Caption (13-14px medium, warna text-secondary)

### Prinsip Visual Tambahan (agar tidak flat/membosankan)
- Kombinasikan neumorphism dengan **sedikit glassmorphism** pada elemen hero/modal (blur + transparansi tipis) — seperti referensi "Blending Glassmorphism & Neumorphism"
- Tambahkan **gradient mesh blob** samar di background hero (ungu-pink, blur besar, opacity rendah) supaya tidak terasa "abu-abu kosong"
- Progress ring, chart donut, dan data visual kecil (seperti di dashboard fitness) sangat cocok dipakai untuk menampilkan skill/statistik
- Icon selalu dalam container neumorphism bulat/rounded, bukan icon polos mengambang

---

## 🧩 STRUKTUR HALAMAN & KOMPONEN

### 1. Navbar
- Floating navbar dengan efek neumorphism raised, sedikit transparan + blur (glass-neu hybrid)
- Logo/inisial di kiri, menu di tengah/kanan, tombol CTA "Contact Me" dengan accent-gradient
- Sticky on scroll dengan shadow yang muncul halus

### 2. Hero Section
- Layout split: teks perkenalan (nama, role, tagline) di satu sisi, "widget card" neumorphism di sisi lain (bisa berupa mock dashboard kecil, foto profil dalam frame neumorphism bulat, atau kartu status "Available for work")
- CTA utama (rounded-full, accent-gradient, shadow raised) + CTA sekunder (outline neumorphism)
- Background: gradient blob samar + subtle noise texture (opsional)

### 3. About Section
- Card besar neumorphism berisi bio singkat
- Beberapa "stat card" kecil neumorphism (Years of Experience, Projects Completed, dll) dengan angka besar dan icon

### 4. Skills Section
- Grid card neumorphism, masing-masing skill punya icon dalam container bulat + progress bar/ring neumorphism (inset style) menunjukkan level

### 5. Projects/Portfolio Section
- Card project dalam bentuk "app mockup" style — mirip referensi dashboard fitness: gambar/screenshot project dalam frame neumorphism raised, judul, deskripsi singkat, tag teknologi (chip kecil neumorphism), tombol "View Project" dengan hover lift effect (translateY -4px + shadow membesar)
- Filter kategori project menggunakan toggle pill neumorphism (active state = inset/pressed)

### 6. Experience/Timeline Section (opsional)
- Timeline vertikal dengan dot neumorphism bulat di tiap milestone, card horizontal untuk detail

### 7. Testimonial Section (opsional)
- Card testimoni neumorphism dengan avatar bulat, carousel dengan tombol navigasi icon neumorphism kecil

### 8. Contact Section
- Form kontak dengan input **inset neumorphism** (bukan raised — karena input area biasanya "tertekan ke dalam")
- Tombol submit raised dengan accent-gradient dan efek "press" saat diklik (shadow berubah jadi inset sesaat)

### 9. Footer
- Minimalis, social icon dalam container bulat neumorphism kecil, background sedikit lebih gelap dari base

---

## ⚙️ INTERAKSI & ANIMASI (Framer Motion)

- **Fade + slide up** saat elemen masuk viewport (staggered untuk grid/list)
- **Hover state**: card terangkat sedikit (`translateY(-6px)`) dan shadow membesar (transisi 200-300ms, ease-out)
- **Button press**: shadow berubah dari raised ke inset selama 150ms saat `:active`
- **Toggle/tab switch**: transisi background dan shadow yang smooth antara state aktif (inset) dan non-aktif (raised)
- **Cursor custom** (opsional): dot kecil dengan efek magnetic saat hover ke tombol/link
- Hindari animasi yang terlalu ramai — neumorphism identik dengan kesan tenang & premium, bukan flashy

---

## 📱 RESPONSIVE

- Mobile-first, breakpoint standar Tailwind (sm/md/lg/xl)
- Di mobile: card grid jadi 1 kolom, navbar jadi hamburger menu dengan panel neumorphism yang slide-in
- Pastikan shadow neumorphism tetap terlihat jelas di layar kecil (jangan terlalu tipis)

---

## 📁 STRUKTUR FOLDER (React + Vite)

```
src/
├── components/
│   ├── layout/       (Navbar, Footer)
│   ├── ui/           (NeuButton, NeuCard, NeuInput, NeuToggle, ProgressRing)
│   └── sections/     (Hero, About, Skills, Projects, Contact, dst)
├── assets/           (images, icons)
├── data/             (projects.js, skills.js — konten portofolio dalam bentuk data/array)
├── hooks/            (custom hooks jika perlu, misal useScrollAnimation)
├── styles/           (globals.css / tailwind config tambahan)
├── App.jsx
└── main.jsx
tailwind.config.js    (extend shadow, colors, borderRadius sesuai design system di atas)
```

---

## ✅ CATATAN PENTING UNTUK AI CODING TOOL

1. Buat komponen UI dasar (NeuCard, NeuButton, NeuInput) sebagai **reusable component** dengan variant prop (`raised` / `inset` / `flat`) — jangan tulis shadow berulang-ulang di tiap section.
2. Definisikan shadow & warna di `tailwind.config.js` sebagai custom theme extension, bukan inline style, supaya konsisten di seluruh halaman.
3. Isi konten (nama, project, skill) boleh pakai placeholder realistis dulu — struktur data taruh di folder `data/` agar mudah diganti nanti.
4. Prioritaskan kualitas shadow & spacing dibanding jumlah section — 1 section yang dieksekusi rapi lebih baik daripada 8 section yang terasa generik.
5. Uji kontras teks di atas background neumorphism (jangan sampai teks abu-abu tenggelam di background abu-abu).
