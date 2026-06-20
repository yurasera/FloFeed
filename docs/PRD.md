# Product Requirements Document (PRD)

# FloFeed (MVP)

## 1. Ringkasan Produk

FloFeed adalah aplikasi web sederhana yang memungkinkan pengguna memberikan feedback anonim melalui serangkaian pertanyaan.

Tujuan utama FloFeed adalah membantu seseorang mendapatkan masukan yang jujur dan konstruktif tanpa mengharuskan pemberi feedback mengungkapkan identitasnya.

Pada versi MVP, aplikasi hanya berfokus pada tampilan dan alur pengisian feedback. Data feedback belum disimpan dan hanya digunakan untuk mensimulasikan pengalaman pengguna.

---

## 2. Tujuan Produk

### Tujuan Utama

Memvalidasi konsep aplikasi feedback anonim berbasis pertanyaan.

### Tujuan Pembelajaran

* Mempelajari pengembangan Single Page Application (SPA).
* Mempelajari pengelolaan form dan validasi input.
* Membangun fondasi aplikasi sebelum integrasi backend.

---

## 3. Scope MVP

### In Scope

* Landing Page
* Feedback Form Page
* Success Page
* Navigasi antar halaman
* Form validation

### Out of Scope

* Login dan Register
* Dashboard
* Penyimpanan feedback
* Database
* Profil pengguna
* Link feedback personal
* Statistik feedback
* Integrasi backend

---

## 4. User Flow

Pengunjung membuka landing page.

↓

Pengunjung memilih untuk memberikan feedback.

↓

Pengunjung mengisi seluruh pertanyaan.

↓

Pengunjung mengirim feedback.

↓

Sistem menampilkan halaman sukses.

---

## 5. Halaman

### 5.1 Landing Page

Halaman utama yang menjelaskan tujuan FloFeed.

#### Hero Section

Headline:

> Receive Honest Anonymous Feedback

Deskripsi singkat mengenai manfaat feedback anonim.

Call To Action:

* Give Feedback

#### Features Section

Menampilkan manfaat utama FloFeed:

* Anonymous Feedback
* Easy to Use
* Honest Insights
* Quick Submission

#### How It Works

Menjelaskan alur penggunaan:

1. Open the form
2. Answer the questions
3. Submit feedback

---

### 5.2 Feedback Form Page

Halaman untuk mengisi feedback anonim.

#### Pertanyaan

##### Communication

How would you rate my communication?

Jawaban:

* Rating 1–5

##### Collaboration

How would you rate my collaboration?

Jawaban:

* Rating 1–5

##### Strength

What is my biggest strength?

Jawaban:

* Text Area

##### Improvement

What should I improve?

Jawaban:

* Text Area

##### Suggestion

Any additional suggestions?

Jawaban:

* Text Area

#### Tombol

* Submit Feedback

#### Validasi

* Semua pertanyaan wajib diisi.
* Feedback tidak dapat dikirim jika terdapat jawaban kosong.

---

### 5.3 Success Page

Ditampilkan setelah feedback berhasil dikirim.

Pesan:

> Thank you for your feedback.

Tombol:

* Back to Home

---

## 6. Future Version (V2)

Fitur yang direncanakan untuk versi berikutnya:

* Login dan Register
* Profil pengguna
* Link feedback personal
* Penyimpanan feedback
* Dashboard feedback
* Statistik feedback
* Integrasi backend dan database

---

## 7. Kriteria Selesai

Aplikasi dianggap selesai apabila:

* Landing page dapat ditampilkan dengan baik.
* Pengguna dapat membuka halaman feedback.
* Pengguna dapat mengisi seluruh pertanyaan.
* Validasi form berjalan dengan baik.
* Pengguna dapat mengirim feedback.
* Halaman sukses ditampilkan setelah submit.
* Tampilan responsif pada desktop dan mobile.
