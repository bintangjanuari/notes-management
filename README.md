# Task 1 – Eksplorasi Vibe Coding

## Deskripsi Project
Pada task ini saya membuat sebuah **Notes App** sederhana berbasis web menggunakan pendekatan *vibe coding* dengan bantuan AI tools modern.

Aplikasi ini memungkinkan user untuk:
- Membuat catatan baru
- Memberikan warna pada catatan
- Menyimpan catatan
- Menghapus / membatalkan catatan
- Menggunakan aplikasi dengan tampilan responsive di desktop maupun mobile

---

## Tools yang Digunakan
- [Bolt.new](https://bolt.new)
- [React.js](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

## Proses Eksplorasi

### 1. Generate UI dengan AI Tool
Saya menggunakan Bolt.new untuk membantu membuat struktur awal aplikasi seperti:
- Layout notes app
- Form input catatan
- Color picker
- Styling dasar menggunakan Tailwind CSS

### 2. Penyesuaian Manual
Setelah UI awal dibuat oleh AI, saya melakukan beberapa penyesuaian manual seperti:
- Mengatur state management
- Memperbaiki responsive layout
- Menyesuaikan styling button dan spacing
- Menambahkan interaction yang lebih nyaman digunakan

---

## Kendala yang Dihadapi
Beberapa kendala yang saya alami selama proses eksplorasi:

- Layout awal kurang responsive di ukuran mobile kecil
- Tombol action sempat overflow / terpotong di layar HP
- Spacing antar komponen masih kurang rapi
- Hasil generate AI masih perlu penyesuaian manual agar lebih usable

---

## Solusi
Untuk mengatasi kendala tersebut saya melakukan:
- Mengubah layout footer menjadi fleksibel menggunakan `flex-col` dan `sm:flex-row`
- Menambahkan `flex-wrap` pada color picker
- Menyesuaikan ukuran button agar lebih mobile friendly
- Menambahkan padding responsive untuk layar kecil

---

## Hasil Project
### Demo
[https://notes-management-bay.vercel.app/]

### Repository
[https://github.com/bintangjanuari/notes-management]
