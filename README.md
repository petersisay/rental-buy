# ቀዳሚ (Kedami) - Ethiopian Real Estate MERN Portal

**ቀዳሚ (Kedami)** is an Ethiopian real estate platform built on the **MERN Stack (MongoDB, Express, React, Node.js)**. Designed for finding, buying, and renting residential properties in **Addis Ababa (አዲስ አበባ)** and **Adama (አዳማ)** with full **Amharic (አማርኛ)** and English language options, **Ethiopian Birr (ETB)** pricing, and dedicated role portals for **Property Owners**, **Agents**, **Developers**, and **Platform Administrators**.

---

## 🇪🇹 Key Features

- **MERN Stack Architecture**: Pure JavaScript / Node.js throughout: MongoDB + Mongoose, Express.js REST API, React (Vite) frontend, Node.js runtime.
- **Dedicated Portals for Every Role**:
  1. 🔍 **Public Search (ዋናው መፈለጊያ)**: Browse 20 verified properties across Addis Ababa and Adama with dynamic ETB budget tiers, Buy/Rent toggle, Flat/House filter, and interactive contact modal.
  2. 🏠 **Property Owners (የቤት ባለቤቶች)**: Individual landlords & homeowners can post their flat or house directly for sale or rent with 0% brokerage fees.
  3. 💼 **Agents & Brokers (ደላላዎች / ወኪሎች)**: Multi-property management dashboard with agency branding and a real-time Client Leads Inbox.
  4. 🏗️ **Builders & Real Estate Developers (የሪል እስቴት አልሚዎች)**: Showcase mega residential projects (e.g. Ayat Real Estate, Tsehay Real Estate, Noah Real Estate, Flintstone Homes) with total units, handover year, and project master plans.
  5. 🛡️ **Platform Administrators (የሲስተሙ አስተዳዳሪዎች)**: Platform KPI statistics and review queue to verify, approve (ያጽድቁ), or reject (ውድቅ ያድርጉ) new property submissions before public release.
- **Bilingual Amharic (አማርኛ) / English**: Seamless one-click language toggle across all search filters, role forms, specifications, and notifications.
- **Ethiopian Cities**: Addis Ababa (Bole, CMC, Kazanchis, Old Airport, Sarbet, Ayat, Summit, Lebu, Gerji) and Adama (Bole Sub-City, Dembela, Posta Bet, Wonji Road, Boku, Geda).
- **ETB Currency**: Native formatting in Ethiopian Birr (`ብር` / `ETB`) with calculated rates per square meter (~ETB/m²).

---

## ☁️ Deployment

### 1. Frontend on Vercel
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Configured with `frontend/vercel.json` for client-side SPA routing.

### 2. Backend on Render + MongoDB
- Root directory: `backend`
- Environment: `Node`
- Build command: `npm install`
- Start command: `npm start`
- Configured with `backend/render.yaml`
- Set `MONGODB_URI` environment variable to your MongoDB Atlas connection string:
  ```
  mongodb+srv://<username>:<password>@cluster0.mongodb.net/kedami?retryWrites=true&w=majority
  ```

---

## 💻 Local Development Setup

### 1. Backend (Express & MongoDB / In-Memory Fallback)
```bash
cd backend
npm install
npm start
```
The server will start on `http://localhost:8000`. If a local MongoDB instance is not detected, it automatically operates in resilient fallback mode pre-loaded with the 20 Ethiopian listings and developer projects!

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.
