# ቀዳሚ (Kedami) - Ethiopian Property Search Portal

**ቀዳሚ (Kedami)** is Ethiopia's premier real estate search platform inspired by modern property portals, specially tailored for finding residential rental and purchase properties in **Addis Ababa (አዲስ አበባ)** and **Adama (አዳማ)** with full **Amharic (አማርኛ)** language support and **Ethiopian Birr (ETB)** pricing.

---

## 🇪🇹 Key Features

- **Ethiopian Cities**: 20 hand-picked verified listings across **Addis Ababa** (Bole, CMC, Kazanchis, Old Airport, Sarbet, Ayat, Summit, Lebu, Gerji) and **Adama** (Bole Sub-City, Dembela, Posta Bet, Wonji Road, Boku, Geda, ASTU area).
- **Full Amharic (አማርኛ) Language Toggle**: One-click language switch between English and Amharic for all UI navigation, search filters, property descriptions, amenities, contact forms, and notifications.
- **Ethiopian Birr (ETB)**: All listings, price per square meter (~ETB/m²), and budget filter tiers are customized for the Ethiopian real estate market.
- **Buy (ይግዙ) vs. Rent (ይከራዩ)**: Instant toggle with customized budget tiers for both purchase and monthly rent.
- **Property Types**: Filter by **Flat / Apartment (አፓርታማ / ፎቅ)** or **House / Villa (ቪላ / ጊቢ ያለው ቤት)**.
- **BHK & Bedroom Filter**: Filter from 1 to 4+ bedrooms.
- **Interactive Details & Contact Agent**: Full property specifications, amenities, and instant callback request form with Ethiopian phone validation (`+251` / `09...`).
- **Shortlisting**: Bookmark properties with local browser storage.

---

## 🛠️ Tech Stack

- **Database**: SQLite (SQLAlchemy ORM)
- **Backend**: FastAPI & Uvicorn (Python)
- **Frontend**: React (Vite) + Lucide Icons + Google Noto Sans Ethiopic Font

---

## 🚀 Setup & Running Locally

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.
