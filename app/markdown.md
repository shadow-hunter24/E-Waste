# ♻️ E-Waste Management Mobile App (Group 8 – Class E)

> Mobile App Project — React Native (Expo + TypeScript) + PHP (XAMPP) + MySQL  
> Date: 21 July 2025

## 1) Goal & Scope
Build a simple, effective, and user-friendly app that links **residents** to **recycling centers**, enabling doorstep pickup of e-waste, instant quotes, and **Mobile Money** payout (placeholder).

---

## 2) Key Features (MVP ✅)
- **Account**
  - Email/password sign up & login
  - Profile: full name, phone, MoMo number, address
- **Location**
  - Enter pickup location (address + landmark + GPS optional)
- **Waste Submission**
  - Choose **type(s)** of e-waste + **quantity**
  - Auto-calculate **quote** (price per item/category)
  - Accept quote & submit request
- **Payments**
  - Choose payout preference (MoMo or cash on pickup—placeholder)
- **Status Tracking**
  - View requests with statuses: `PENDING`, `ACCEPTED`, `ON_ROUTE`, `COMPLETED`, `REJECTED`
- **Notifications**
  - In-app status updates (push later)
- **History**
  - Past submissions & payouts

### Nice-to-Have (Phase 2 🚀)
- Push notifications (Expo Notifications)
- Live driver ETA (basic)
- In-app chat with center
- Promo codes/campaigns
- Admin web panel (later)
- Image upload of items
- Multi-center marketplace (dynamic pricing by center)

---

## 3) User Roles
- **Customer (Mobile App)** — submits e-waste, accepts quotes, tracks pickup, receives payout.
- **Recycler Admin (Backend)** — reviews requests, assigns pickup, marks status, sets pricing.
- **Driver (Optional Later)** — sees assigned pickups, updates status.

---

## 4) Screens & Navigation
- **Auth**: Login ▸ Register ▸ Forgot Password (later)
- **Main (Tabs/Stack)**:
  - Home (create new request)
  - Requests (list + details)
  - Submit Waste (form wizard)
  - Payments (summary)
  - Profile (edit info, logout)

**Flow:** `Login → Home → Submit Waste (select types & qty → quote → payout preference → submit) → Requests (track)`

---

## 5) Non-Functional Requirements
- **Performance:** < 2s perceived latency for API calls on Wi-Fi
- **Security:** hashed passwords (PHP `password_hash`), token auth (JWT), server-side validation
- **Reliability:** input validation, transaction safety for payments
- **Compatibility:** Android first (Expo Go), iOS as stretch
- **DX:** .env-like config for base URLs, TypeScript types, linting

---

## 6) Tech Stack
- **Frontend:** React Native (Expo, TypeScript), React Navigation, Axios/Fetch
- **Backend:** PHP (XAMPP, Apache), MySQL, JWT (`firebase/php-jwt`)
- **Design:** Figma
- **Repo:** GitHub

---

## 7) API Contract (PHP under `http://localhost/e-waste-api`)
> All responses: JSON with `{ success: boolean, data?: any, error?: string }`  
> Auth: Bearer token (JWT) for protected routes

### Auth
- **POST** `/auth/register.php`  
  **Body:**  
  ```json
  { "name":"John Doe", "email":"john@example.com", "password":"Pass@123", "phone":"+233...", "momo_number":"024xxxxxxx" }
