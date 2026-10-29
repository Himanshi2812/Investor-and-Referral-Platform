# Nexachain AI — MERN Stack Technical Assessment
### Production-Grade Investment & Multi-Tier Referral Platform Architecture

---

## 📌 Executive Summary

This repository contains the complete, production-ready implementation of the **MERN Stack Technical Assessment** for **Nexachain AI**. Built by applying senior-level architectural design patterns, it delivers a scalable backend architecture, mathematical business logic engines with **ACID transactional consistency**, an **idempotent daily ROI scheduler**, and a modern, high-performance **React Fintech Dashboard**.

---

## 🏗️ Architectural Overview

```
                                  ┌──────────────────────────┐
                                  │      React Frontend      │
                                  │  (Vite + Tailwind + UI)  │
                                  └─────────────┬────────────┘
                                                │ Axios (JWT Bearer)
                                                ▼
                                  ┌──────────────────────────┐
                                  │   Express REST Gateway   │
                                  │ (Helmet, CORS, RateLimit)│
                                  └─────────────┬────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
     ┌───────────────────────┐      ┌───────────────────────┐      ┌───────────────────────┐
     │  Authentication & ME  │      │  Investment Engine    │      │ Multi-Tier Referrals  │
     │ (JWT, Bcrypt Salting) │      │ (ACID Wallet Updates) │      │ (Recursive Traversal) │
     └───────────────────────┘      └───────────┬───────────┘      └───────────┬───────────┘
                                                │                              │
                                                ▼                              ▼
                                    ┌───────────────────────┐      ┌───────────────────────┐
                                    │ Idempotent ROI Cron   │      │ MongoDB Atlas / Local │
                                    │ (node-cron @ midnight)│◄────►│  (Compound Indexes)   │
                                    └───────────────────────┘      └───────────────────────┘
```

---

## 📂 Repository Structure

```text
nexachain-investment-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js          # Referral tiers (5%, 3%, 1%), plan definitions
│   │   │   └── db.js                 # Resilient Mongoose connection with retry
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Me, Mock Deposit
│   │   │   ├── investmentController.js # Create & View Investments
│   │   │   ├── dashboardController.js  # Aggregated metrics & 7-day chart series
│   │   │   ├── referralController.js # Direct referrals, nested tree, history
│   │   │   └── roiController.js      # ROI history & on-demand test trigger
│   │   ├── cron/
│   │   │   └── roiCron.js            # Node-cron scheduler running daily at 00:00 AM
│   │   ├── middlewares/
│   │   │   ├── auth.js               # JWT Bearer token protection & user status check
│   │   │   └── errorHandler.js       # Centralized error handler (CastError, E11000, Joi)
│   │   ├── models/
│   │   │   ├── User.js               # User schema with encrypted passwords & wallets
│   │   │   ├── Investment.js         # Investment contracts, maturity dates, status
│   │   │   ├── ReferralIncome.js     # Audit ledger for multi-tier level earnings
│   │   │   └── ROIHistory.js         # Idempotent daily ROI payout history
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── investmentRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── referralRoutes.js
│   │   │   ├── roiRoutes.js
│   │   │   └── cronRoutes.js
│   │   ├── services/
│   │   │   ├── referralService.js    # Hierarchy traversal & commission distribution
│   │   │   └── roiService.js         # Idempotent Daily ROI calculation engine
│   │   ├── seed.js                   # Comprehensive demo network seeder script
│   │   └── server.js                 # Application bootstrap & lifecycle management
│   ├── postman/
│   │   └── Nexachain_Investment_Platform.postman_collection.json # Ready-to-import API tests
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # Axios client with automatic Bearer interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Brand header, wallet balance pill, quick actions
│   │   │   ├── DashboardCards.jsx    # Metric cards (Investments, Daily ROI, Level, Wallet)
│   │   │   ├── EarningsChart.jsx     # Recharts 7-day ROI vs Level income area chart
│   │   │   ├── InvestmentTable.jsx   # Portfolio contract ledger with status badges
│   │   │   ├── RoiTable.jsx          # Daily ROI payout history ledger
│   │   │   ├── ReferralTable.jsx     # Network referral commission ledger
│   │   │   ├── ReferralTree.jsx      # Recursive nested tree hierarchy visualization
│   │   │   ├── InvestmentModal.jsx   # Interactive plan selector & projected ROI calculator
│   │   │   ├── DepositModal.jsx      # Instant wallet top-up modal for testing
│   │   │   └── CronSimulator.jsx     # Live Idempotency test trigger console
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global reactive user authentication state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # Login screen with 1-click evaluator demo accounts
│   │   │   ├── RegisterPage.jsx      # Registration screen with auto-filled referral codes
│   │   │   └── DashboardPage.jsx     # Primary responsive dashboard orchestrator
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🗄️ Task 1: Database Schema Design & Optimization

All schemas are implemented inside `backend/src/models/` with strict Mongoose validation, type definitions, and compound indexing:

### 1. `User` Model ([`backend/src/models/User.js`](backend/src/models/User.js))
- **Fields**:
  - `fullName`: String (Required, trimmed)
  - `email`: String (Required, Unique, Lowercase, Indexed)
  - `mobileNumber`: String (Required)
  - `password`: String (Bcrypt encrypted, hashed via `pre('save')` hook, omitted in queries by default)
  - `referralCode`: String (Unique, Indexed, Auto-generated 8-char uppercase string)
  - `referredBy`: ObjectId (ref: `User`, Indexed upline sponsor)
  - `walletBalance`: Number (Default: 0, non-negative validator)
  - `totalRoiEarned`: Number (Default: 0, non-negative validator)
  - `totalLevelIncomeEarned`: Number (Default: 0, non-negative validator)
  - `accountStatus`: Enum `['Active', 'Suspended', 'Inactive']` (Default: `Active`, Indexed)
  - `timestamps`: `createdAt`, `updatedAt`

### 2. `Investment` Model ([`backend/src/models/Investment.js`](backend/src/models/Investment.js))
- **Fields**:
  - `user`: ObjectId (ref: `User`, Required, Indexed)
  - `investmentAmount`: Number (Required, Min: 1)
  - `planDetails`: Object (`planName`, `durationDays`, `dailyRoiPercentage`, `description`)
  - `startDate`: Date (Default: `Date.now`)
  - `endDate`: Date (Required, calculated: `startDate + durationDays`)
  - `dailyRoiPercentage`: Number (Required)
  - `investmentStatus`: Enum `['Active', 'Completed', 'Cancelled']` (Default: `Active`, Indexed)
  - `totalRoiPaid`: Number (Default: 0)
  - `lastRoiDate`: Date
- **Compound Indexes**:
  - `{ investmentStatus: 1, startDate: 1, endDate: 1 }` — High-speed cron queries.
  - `{ user: 1, investmentStatus: 1, createdAt: -1 }` — Fast dashboard filtering.

### 3. `ReferralIncome` Model ([`backend/src/models/ReferralIncome.js`](backend/src/models/ReferralIncome.js))
- **Fields**:
  - `recipientUser`: ObjectId (ref: `User`, Beneficiary of the commission, Indexed)
  - `sourceUser`: ObjectId (ref: `User`, Downline user who made the investment, Indexed)
  - `investment`: ObjectId (ref: `Investment`, Contract triggering the commission)
  - `referralLevel`: Number (Level 1, Level 2, Level 3)
  - `commissionPercentage`: Number (e.g. 5%, 3%, 1%)
  - `incomeAmount`: Number (Calculated commission in $)
  - `date`: Date (Default: `Date.now`)
- **Compound Indexes**:
  - `{ recipientUser: 1, date: -1 }` — Fast user ledger lookups.
  - `{ investment: 1, referralLevel: 1 }` (Unique) — Guaranteed duplicate commission prevention.

### 4. `ROIHistory` Model ([`backend/src/models/ROIHistory.js`](backend/src/models/ROIHistory.js))
- **Fields**:
  - `user`: ObjectId (ref: `User`, Indexed)
  - `investment`: ObjectId (ref: `Investment`, Indexed)
  - `roiAmount`: Number
  - `roiPercentage`: Number
  - `date`: Date
  - `dateString`: String (Standardized `YYYY-MM-DD` calendar identifier, Indexed)
  - `status`: Enum `['Credited', 'Failed', 'Pending']`
- **Critical Idempotent Index**:
  - `{ investment: 1, dateString: 1 }` (Unique constraint) — Absolute database-level guarantee that an investment can **never** receive double daily ROI for the same date.

---

## ⚡ Task 2: RESTful API Specifications

All private endpoints require the HTTP header:  
`Authorization: Bearer <JWT_TOKEN>`

### 1. Authentication Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register user, validate optional sponsor code, issue JWT |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user credentials, issue JWT |
| `GET` | `/api/v1/auth/me` | Private | Retrieve authenticated user profile & sponsor details |
| `POST` | `/api/v1/auth/deposit` | Private | Top-up mock wallet funds for sandbox testing |

### 2. Investment Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/investments/plans` | Public | Fetch configured investment plans |
| `POST` | `/api/v1/investments` | Private | Create investment, deduct wallet, trigger multi-tier referral distribution |
| `GET` | `/api/v1/investments` | Private | View user's investments with status filters and totals |

### 3. Dashboard Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/dashboard` | Private | Returns cards metrics, active contracts, wallet balance, and 7-day earnings chart series |

### 4. Referral Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/referrals/direct` | Private | Fetch direct referrals (Level 1) with active investment statistics |
| `GET` | `/api/v1/referrals/tree` | Private | Fetch nested referral hierarchy tree up to N levels |
| `GET` | `/api/v1/referrals/history`| Private | Paginated ledger of referral commission transactions |

### 5. ROI & Scheduler Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/roi/history` | Private | Paginated ledger of daily ROI payouts |
| `POST` | `/api/v1/cron/trigger-daily-roi` | Private | Manual trigger endpoint for testing cron & idempotency safeguards |

---

## 🧠 Task 3: Business Logic & Mathematical Formulas

### 1. Daily ROI Calculation Engine
- **Formula**:
  $$\text{Daily ROI Amount} = \frac{\text{Investment Amount} \times \text{Daily ROI Percentage}}{100}$$
- **Lifecycle & Execution Flow**:
  1. Scheduler queries all contracts with `investmentStatus === 'Active'` where `startDate <= today`.
  2. Evaluates idempotency: checks if an `ROIHistory` record already exists for `(investmentId, dateString)`.
  3. Uses atomic document operators (`$inc: { walletBalance: roi, totalRoiEarned: roi }`) within MongoDB transactional sessions.
  4. Increments contract's `totalRoiPaid` and sets `lastRoiDate = today`.
  5. If `today >= contract.endDate`, the contract is automatically transitioned to `investmentStatus = 'Completed'`.

### 2. Multi-Tier Referral Traversal Engine
- **Tier Commission Matrix**:
  - **Level 1 (Direct Sponsor)**: 5.0%
  - **Level 2 (Sponsor's Sponsor)**: 3.0%
  - **Level 3 (Grand-sponsor)**: 1.0%
- **Algorithm**:
  $$\text{Level Income} = \frac{\text{Investment Amount} \times \text{Tier Percentage}}{100}$$
  When an investor activates a new contract:
  1. The engine checks if the investor was sponsored (`investor.referredBy`).
  2. Traverses upward through the parent graph for each tier.
  3. Verifies that the recipient account status is `Active`.
  4. Atomically credits the sponsor's `walletBalance` and `totalLevelIncomeEarned`.
  5. Creates an audit record in `ReferralIncome` with `{ investment, referralLevel }` unique index.

---

## ⏰ Task 5: Cron Job Scheduler & Idempotency Safeguards

The automated scheduler is implemented with `node-cron` inside [`backend/src/cron/roiCron.js`](backend/src/cron/roiCron.js):

- **Cron Expression**: `0 0 * * *` (Executes every midnight at 12:00 AM).
- **Two-Tier Idempotency Architecture**:
  1. **Application-Level Check**: Before attempting database updates, `roiService` queries `ROIHistory.exists({ investment: id, dateString: 'YYYY-MM-DD' })`. If existing, it skips processing.
  2. **Database-Level Constraint**: `ROIHistorySchema.index({ investment: 1, dateString: 1 }, { unique: true })`. Even under concurrent server worker clusters, any race condition is caught by MongoDB's unique index constraint (`code 11000`), preventing double payouts.
- **On-Demand Simulator Console**:
  In the React frontend, an interactive **Automated Scheduler Console** allows evaluators to click **"Run Scheduled ROI Job Now"**.
  - **First Run**: Distributes daily payouts and updates balances.
  - **Second Run Immediately After**: Returns `0 processed, X skipped (Already credited today)`. This visually proves the idempotency safeguard!

---

## 💻 Task 4: React Dashboard Architecture

Built with modern **Vite + React 18 + Tailwind CSS + Lucide Icons + Recharts**:

1. **Dashboard Metric Cards**:
   - Total Investments (with active vs total plans)
   - Daily ROI (with estimated daily yield)
   - Total Level Income (with direct downlines count)
   - Wallet Balance (with instant top-up action)
2. **Interactive Earnings Chart**:
   - Visual 7-day stacked gradient area chart comparing Daily ROI versus Level Referral Income.
3. **Interactive Referral Tree**:
   - Visual nested tree representation of multi-level downlines.
   - Shows Level Badges (Root, Level 1, Level 2, Level 3), user details, referral codes, joined dates, and total investment volume.
   - Expandable / collapsible nodes.
4. **Contract & Financial Ledgers**:
   - Investment Portfolio Table (with status badges: Active, Completed, Cancelled).
   - Daily ROI History Table.
   - Referral Income Ledger.
5. **Interactive Modals**:
   - New Investment Modal with dynamic plan picker and real-time ROI calculator.
   - Mock Wallet Deposit Modal.
6. **1-Click Evaluator Logins**:
   - On the login screen, single-click buttons instantly populate demo credentials for **Alice (Root Sponsor)** or **Bob (Level 1)**.

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v24.x`)
- MongoDB (Local instance at `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

### Step 1: Start Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies (already pre-installed)
npm install

# (Optional) Seed realistic demo users, investments, and referral hierarchy
npm run seed

# Start backend server
npm run dev
# Server will run on: http://localhost:5000
```

### Step 2: Start Frontend
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies (already pre-installed)
npm install

# Start Vite development server
npm run dev
# Frontend dashboard will be live at: http://localhost:3000
```

### Step 3: Log In with Pre-Seeded Demo Accounts
- **Root Sponsor (Alice)**:
  - Email: `alice@nexachain.ai`
  - Password: `password123`
  - Referral Code: `NXALICE1`
  - *(Has multiple tiers of downlines and active contracts)*
- **Downline Member (Bob)**:
  - Email: `bob@nexachain.ai`
  - Password: `password123`
  - Referred by: Alice

---

## 📮 Postman Collection

A complete Postman Collection is provided inside:  
[`backend/postman/Nexachain_Investment_Platform.postman_collection.json`](backend/postman/Nexachain_Investment_Platform.postman_collection.json)

### How to use:
1. Open Postman -> Click **Import** -> Select `Nexachain_Investment_Platform.postman_collection.json`.
2. Run the request **"1. Authentication -> Login User"**.
3. A test script automatically captures the returned JWT token and sets `{{token}}` in your collection variables.
4. All subsequent authenticated requests (Investments, Dashboard, Referrals, ROI, Cron Trigger) will use the token automatically.

---

## 💡 Assumptions Made During Development

1. **Referral Tier Distribution**: A standard 3-tier commission model was adopted (Level 1: 5%, Level 2: 3%, Level 3: 1%).
2. **Wallet-Funded Contracts**: Investments are activated by deducting from the user's liquid `walletBalance`. A mock sandbox deposit feature is provided so evaluators can top-up balances freely.
3. **Calendar-Day Idempotency**: Daily ROI is bounded to a unique calendar date (`YYYY-MM-DD`). A contract can receive at most one payout per calendar day.
4. **Graceful Transaction Support**: The services use MongoDB sessions (`ClientSession`) for ACID transactions when connected to a replica set/Atlas, with automatic atomic fallbacks for standalone local instances.

---

## 🏆 Evaluation Criteria Checklist

- [x] **Database Design**: Proper schema relationships, strict types, compound indexing, unique constraints.
- [x] **API Architecture**: Clean layered separation of concerns (Routes -> Middlewares -> Controllers -> Services -> Models).
- [x] **Code Quality**: Clean, modular, thoroughly commented, standard JSON error handling.
- [x] **Security Practices**: Bcrypt password salting, JWT token authentication, route protection, Helmet headers, CORS, rate limiting.
- [x] **Business Logic Accuracy**: Precision calculations for daily ROI and multi-level upline traversal.
- [x] **Frontend UI/UX**: Responsive React dashboard with dark/fintech aesthetics, Recharts charts, and nested referral tree.
- [x] **Cron Job & Idempotency**: Node-cron running at 12:00 AM with bulletproof multi-layer duplicate prevention.
- [x] **Documentation & Postman**: Full Postman v2.1 collection and comprehensive README.
