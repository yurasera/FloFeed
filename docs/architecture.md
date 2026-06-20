# Architecture Document

# FloFeed (MVP)

## 1. Overview

FloFeed adalah Single Page Application (SPA) yang memungkinkan pengguna mengisi feedback anonim melalui serangkaian pertanyaan.

Versi MVP hanya berfokus pada frontend dan tidak memiliki backend maupun database.

Feedback yang dikirim tidak disimpan dan hanya digunakan untuk mensimulasikan alur aplikasi.

---

## 2. Technology Stack

### Frontend

* React
* React Router
* JavaScript (ES6+)
* CSS Modules atau Plain CSS

### Deployment

* GitHub Pages atau Vercel

---

## 3. High Level Architecture

```text
User
  │
  ▼
React Application
  │
  ├── Landing Page
  ├── Feedback Form Page
  └── Success Page
```

Tidak ada komunikasi dengan server pada versi MVP.

---

## 4. Routing

| Route     | Description   |
| --------- | ------------- |
| /         | Landing Page  |
| /feedback | Feedback Form |
| /success  | Success Page  |

---

## 5. Folder Structure

```text
src/

├── pages/
│   ├── HomePage.jsx
│   ├── FeedbackPage.jsx
│   └── SuccessPage.jsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   │
│   ├── feedback/
│   │   ├── FeedbackForm.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── RatingInput.jsx
│   │   └── TextareaInput.jsx
│   │
│   └── common/
│       ├── Button.jsx
│       └── Card.jsx
│
├── data/
│   └── questions.js
│
├── styles/
│
├── App.jsx
└── main.jsx
```

---

## 6. Pages

### HomePage

Tanggung jawab:

* Menampilkan informasi produk.
* Menampilkan fitur utama.
* Menampilkan tombol menuju halaman feedback.

---

### FeedbackPage

Tanggung jawab:

* Menampilkan daftar pertanyaan.
* Mengelola state jawaban.
* Melakukan validasi form.
* Redirect ke halaman success setelah submit.

---

### SuccessPage

Tanggung jawab:

* Menampilkan pesan sukses.
* Menyediakan navigasi kembali ke landing page.

---

## 7. Question Configuration

Pertanyaan disimpan dalam file konfigurasi.

Contoh:

```javascript
export const questions = [
  {
    id: 1,
    type: 'rating',
    label: 'How would you rate my communication?'
  },
  {
    id: 2,
    type: 'rating',
    label: 'How would you rate my collaboration?'
  },
  {
    id: 3,
    type: 'textarea',
    label: 'What is my biggest strength?'
  }
]
```

Tujuan:

* Pertanyaan mudah ditambah.
* UI dapat dirender secara dinamis.
* Siap digunakan kembali pada V2.

---

## 8. State Management

Menggunakan React State lokal.

Contoh data form:

```javascript
{
  communication: 0,
  collaboration: 0,
  strength: '',
  improvement: '',
  suggestion: ''
}
```

Tidak menggunakan:

* Redux
* Zustand
* Context API

Karena kebutuhan MVP masih sederhana.

---

## 9. Form Validation

Aturan validasi:

### Rating

* Wajib dipilih.
* Nilai antara 1 sampai 5.

### Text Area

* Tidak boleh kosong.
* Spasi kosong dianggap tidak valid.

Jika terdapat error:

* Pesan validasi ditampilkan.
* Submit dibatalkan.

---

## 10. Submit Flow

```text
User fills form
        │
        ▼
Validate Input
        │
        ├── Invalid
        │       │
        │       ▼
        │   Show Error
        │
        └── Valid
                │
                ▼
        Navigate('/success')
```

Pada MVP tidak ada penyimpanan data.

---

## 11. Styling Strategy

Menggunakan:

* Mobile First Design
* Flexbox
* CSS Grid

Breakpoints:

| Device  | Width          |
| ------- | -------------- |
| Mobile  | < 768px        |
| Tablet  | 768px - 1023px |
| Desktop | ≥ 1024px       |
