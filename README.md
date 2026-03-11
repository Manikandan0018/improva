# 🚌 BusRoute — Bus Ticket Reservation System

A modern, full-featured bus seat reservation system built with **React + Vite + Tailwind CSS**. All data is persisted in LocalStorage — no backend needed.

---

## ✨ Features

- **Visual Seat Map** — 40-seat bus layout with real-time availability (green/red)
- **Seat Reservation** — Click a seat, fill out a form, confirm booking
- **Passenger Dashboard** — View all bookings in a sortable, searchable table
- **Edit Reservations** — Update passenger details inline
- **Delete Reservations** — Remove bookings with confirmation modal
- **LocalStorage Persistence** — Data survives page refreshes
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Animated UI** — Smooth transitions and micro-interactions

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS 3 | Styling |
| Lucide React | Icons |
| LocalStorage | Data persistence |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Top navigation with dropdown
│   └── Seat.jsx         # Individual seat button component
├── pages/
│   ├── Reservation.jsx  # Bus layout + booking form
│   └── Dashboard.jsx    # All reservations table + CRUD
├── utils/
│   └── storage.js       # LocalStorage helper functions
├── App.jsx              # Router setup
├── main.jsx             # Entry point
└── index.css            # Tailwind + custom styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation & Running

```bash
# 1. Navigate to project directory
cd bus-reservation

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📍 Routes

| Route | Page |
|-------|------|
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Passenger Dashboard |
| `/reserve` | Seat Reservation |

---

## 💾 LocalStorage Schema

```json
{
  "busroute_reservations": [
    {
      "id": 1710000000000,
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "seatNumber": 12,
      "bookingDate": "2026-03-11T10:30:00.000Z"
    }
  ]
}
```

---

## 🎨 Design

- **Theme**: Dark industrial with orange accent
- **Fonts**: Syne (display) + DM Sans (body) + JetBrains Mono (code)
- **Colors**: Deep navy dark mode with `#F97316` accent

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```
