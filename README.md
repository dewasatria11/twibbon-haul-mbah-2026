# Website Twibbon Haul Ke-10 KH. Abu Chamid

Website interaktif dan modern untuk pembuatan **Twibbon Haul Ke-10 KH. Abu Chamid & Silaturrahim Alumni IMAB 2026** di Pondok Pesantren Al Ikhsan Beji, Kedungbanteng, Banyumas.

---

## ✨ Fitur Utama

1. **Desain & Animasi Menarik**:
   - Nuansa warna bersih, mewah, dan teduh bernuansa pesantren luhur.
   - Animasi transisi halus menggunakan **Framer Motion**.
   - Efek perayaan (*confetti celebration*) saat twibbon berhasil dibuat.

2. **Preview Gambar Twibbon**:
   - Menampilkan frame poster `revisi-HAUL MBAH ABU CHAMID KE 10.png`.
   - Informasi detail acara haul (tanggal, waktu, lokasi, muballigh, dan live streaming YouTube).

3. **Pilih Foto dari Galeri (1-Click)**:
   - Tombol utama **"Buat Twibbon Sekarang"** langsung membuka galeri HP atau file picker di PC/laptop.

4. **Studio Editor Interaktif (Geser & Zoom)**:
   - **Geser (Pan / Drag)**: Sentuh/klik dan geser foto bebas ke posisi yang pas.
   - **Zoom**: Slider zoom, tombol `+` / `-`, *pinch-to-zoom* (cubit layar di smartphone), serta scroll *mouse wheel* di PC.
   - **Putar 90°**: Rotasi cepat jika foto miring.
   - **Cermin (Flip)**: Membalik foto selfie.
   - **Reset**: Mengembalikan posisi dan ukuran foto ke default.

5. **Render Resolusi Ultra HD (3240 × 4050 px)**:
   - Menggabungkan foto pengguna dan frame twibbon asli secara *client-side* dengan kualitas 100% jernih tanpa pecah.

6. **Save & Share**:
   - **💾 Tombol Simpan / Unduh**: Mengunduh file gambar PNG kualitas tinggi langsung ke perangkat.
   - **📲 Tombol Bagikan (Share)**: Mendukung Web Share API bawaan untuk langsung membagikan gambar ke WhatsApp, Instagram Story, Telegram, dll. (disertai fallback otomatis).
   - **📋 Salin Caption**: Template teks resmi untuk memudahkan posting ke media sosial.

---

## 🚀 Cara Menjalankan

### Mode Pengembangan (Development)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### Mode Produksi (Build & Start)
```bash
npm run build
npm start
```
