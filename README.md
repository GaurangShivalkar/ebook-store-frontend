# FileSure – Full Stack Developer Intern Assignment
### Project: E-Book Store Referral & Credit System

This is the **[FRONTEND]** for the FileSure Full Stack Intern assignment. The goal was to build a complete referral and credit system for a digital e-book store.

* **Live Frontend:** [Link to your Vercel URL]
* **Live Backend:** [Link to your Render URL]
* **Backend Repo:** https://github.com/GaurangShivalkar/ebook-store-bacckend.git

---

### 🏛️ Architecture & System Design

The application is built with a modern, decoupled full-stack architecture.

* **Frontend:** Next.js (App Router) with TypeScript & Tailwind CSS.
* **Backend:** Node.js & Express with TypeScript.
* **Database:** MongoDB.
* **State Management:** Zustand (for global auth state).
* **Authentication:** JWT (JSON Web Tokens) stored in `localStorage` via Zustand's persist middleware.

#### System Data Flow

The core logic revolves around the relationship between the `User` and `Purchase` models. When a new user (ABC) signs up using a referrer's code (XYZ), the `referredBy` field on ABC's user document is set to XYZ's `_id`.

When Ryan makes his *first* purchase, an atomic transaction is started to:
1.  Check if `user.hasMadeFirstPurchase` is `false`.
2.  Give ABC 2 credits.
3.  Set `user.hasMadeFirstPurchase` to `true`.
4.  Find ABC's referrer (XYZ) via `user.referredBy`.
5.  Atomically increment XYZ's `credits` by 2.
6.  Commit the transaction.


---

### 🚀 Local Setup

**[FOR FRONTEND REPO]**

1.  Clone the repository:
    ```bash
    git clone https://github.com/GaurangShivalkar/ebook-store-frontend.git
    cd ebook-store-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables. Create a `.env.local` file:
    ```ini
    # This must point to your backend (local or live)
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)
