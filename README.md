# MagicBricks Property Search Clone (Bangalore & Mumbai)

A full-stack property portal inspired by **MagicBricks.com** for searching residential rental and purchase properties in **Bangalore** and **Mumbai**.

## Features
- **Dual City Coverage**: Exclusively curated verified properties in Bangalore and Mumbai.
- **Rent vs. Buy**: Switch between properties to buy or rent.
- **Budget Filtering**: Tailored budget tiers for rental rates and purchase prices.
- **Property Types**: Filter by `Flat` or `House`.
- **BHK & Keyword Filters**: Filter by bedroom count or search specific localities (e.g., Whitefield, Bandra, Indiranagar, Powai).
- **Interactive Details & Contact Agent**: Full property specs, amenities, and instant callback request form.
- **Shortlisting**: Bookmark properties stored locally.

## Tech Stack
- **Database**: SQLite (SQLAlchemy ORM)
- **Backend**: FastAPI & Uvicorn
- **Frontend**: React (Vite) & Modern CSS

## Setup & Running

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
