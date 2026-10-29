# Nexachain Investment & Referral Platform

A full-stack MERN application implementing an investment contract system, 3-tier recursive referral commission distribution, an idempotent daily ROI cron scheduler, and a React management dashboard.

This repository covers all five tasks specified in the Nexachain technical assessment.

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Atlas / Mongoose 9)
- **Security & Validation:** JWT (JSON Web Tokens), Bcrypt.js, Helmet, Express Rate Limit, Joi
- **Scheduler:** node-cron
- **Testing:** Jest, Supertest
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Recharts

---

## System Architecture

```text
+-----------------------------------------------------------+
|                      React Frontend                       |
|           (Vite + Tailwind CSS + Recharts UI)             |
+-----------------------------+-----------------------------+
                              | Axios (Bearer Token)
                              v
+-----------------------------------------------------------+
|                   Express REST Gateway                    |
|             (Helmet, CORS, IP Rate Limiter)               |
+--------------+--------------+--------------+--------------+
               |              |              |
               v              v              v
     +-----------------+ +------------+ +-----------------+
     | Auth Controller | | Investment | | Referral Engine |
     |  (JWT & Bcrypt) | | Controller | |  (3-Tier Tree)  |
     +-----------------+ +-----+------+ +--------+--------+
                               |                 |
                               v                 v
     +----------------------------------------------------+
     |             Daily ROI Cron Scheduler               |
     |           (0 0 * * * - Calendar Idempotent)        |
     +-------------------------+--------------------------+
                               |
                               v
     +----------------------------------------------------+
     |               MongoDB Atlas Database               |
     |   (Compound Indexes: Idempotency & Query Speed)    |
     +----------------------------------------------------+
```

---

## Repository Structure

```text
nexachain-investment-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── constants.js          # Referral tier rates (5%, 3%, 1%) and plan presets
│   │   │   └── db.js                 # Resilient Mongoose connection with DNS fallback
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, profile, and test deposits
│   │   │   ├── investmentController.js # Create and list investment contracts
│   │   │   ├── dashboardController.js  # Aggregated metrics and 7-day earnings chart data
│   │   │   ├── referralController.js # Direct referrals, nested hierarchy tree, history
│   │   │   └── roiController.js      # ROI payout logs and test trigger
│   │   ├── cron/
│   │   │   └── roiCron.js            # node-cron scheduler running daily at midnight
│   │   ├── middlewares/
│   │   │   ├── auth.js               # JWT bearer token verification
│   │   │   └── errorHandler.js       # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js               # User accounts, referral codes, and wallet balances
│   │   │   ├── Investment.js         # Contract amounts, durations, rates, and statuses
│   │   │   ├── ReferralIncome.js     # Multi-level commission audit ledger
│   │   │   └── ROIHistory.js         # Daily ROI distribution history with unique index
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── investmentRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── referralRoutes.js
│   │   │   ├── roiRoutes.js
│   │   │   ├── cronRoutes.js
│   │   │   └── docsRoutes.js         # Interactive API docs route (/api/docs)
│   │   ├── services/
│   │   │   ├── referralService.js    # 3-tier upline traversal and wallet updates
│   │   │   └── roiService.js         # Idempotent daily ROI calculation engine
│   │   ├── seed.js                   # Seed script with 5 demo accounts & hierarchy
│   │   └── server.js                 # Express server bootstrap
│   ├── tests/
│   │   ├── referralMath.test.js      # Unit tests for 5%, 3%, 1% upline distribution
│   │   ├── idempotency.test.js       # Idempotency double-run prevention tests
│   │   └── health.test.js            # Health diagnostics & route tests
│   ├── postman/
│   │   └── Nexachain_Investment_Platform.postman_collection.json
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/client.js             # Axios instance with auth interceptor
│   │   ├── components/               # Cards, Recharts analytics, data tables, tree UI
│   │   ├── context/                  # AuthContext and ThemeContext
│   │   ├── pages/                    # LoginPage, RegisterPage, DashboardPage
│   │   └── utils/csvExport.js        # CSV export utility for tables
│   └── package.json
└── README.md
```

---

## Database Design & Indexing (Task 1)

All schemas are defined using Mongoose in `backend/src/models/` with strict type constraints, compound indexing, and validation hooks.

### 1. User (`backend/src/models/User.js`)
- `fullName`: String (Required, trimmed)
- `email`: String (Required, Unique, Lowercase, Indexed)
- `mobileNumber`: String (Required)
- `password`: String (Bcrypt salted, hashed via async pre-save hook)
- `referralCode`: String (Unique, Indexed, Auto-generated 8-character string)
- `referredBy`: ObjectId (ref: User, Indexed)
- `walletBalance`: Number (Default: 0)
- `totalRoiEarned`: Number (Default: 0)
- `totalLevelIncomeEarned`: Number (Default: 0)
- `accountStatus`: Enum `['Active', 'Suspended', 'Inactive']` (Default: `Active`, Indexed)

### 2. Investment (`backend/src/models/Investment.js`)
- `user`: ObjectId (ref: User, Indexed)
- `investmentAmount`: Number (Required, Min: 1)
- `planDetails`: Object (`planName`, `durationDays`, `dailyRoiPercentage`, `description`)
- `startDate`: Date (Default: `Date.now`)
- `endDate`: Date (Required, calculated: `startDate + durationDays`)
- `dailyRoiPercentage`: Number (Required)
- `investmentStatus`: Enum `['Active', 'Completed', 'Cancelled']` (Default: `Active`, Indexed)
- `totalRoiPaid`: Number (Default: 0)
- `lastRoiDate`: Date
- **Compound Indexes:**
  - `{ investmentStatus: 1, startDate: 1, endDate: 1 }` — Optimizes midnight cron queries
  - `{ user: 1, investmentStatus: 1, createdAt: -1 }` — Speeds up dashboard portfolio queries

### 3. ReferralIncome (`backend/src/models/ReferralIncome.js`)
- `recipientUser`: ObjectId (ref: User, Beneficiary of commission, Indexed)
- `sourceUser`: ObjectId (ref: User, Downline user activating the contract, Indexed)
- `investment`: ObjectId (ref: Investment, Contract ID)
- `referralLevel`: Number (1, 2, or 3)
- `commissionPercentage`: Number (5%, 3%, 1%)
- `incomeAmount`: Number (Commission amount credited)
- `date`: Date (Default: `Date.now`)
- **Compound Indexes:**
  - `{ recipientUser: 1, date: -1 }` — Fast ledger history retrieval
  - `{ investment: 1, referralLevel: 1 }` (Unique) — Guarantees no upline receives duplicate commission for the same contract

### 4. ROIHistory (`backend/src/models/ROIHistory.js`)
- `user`: ObjectId (ref: User, Indexed)
- `investment`: ObjectId (ref: Investment, Indexed)
- `roiAmount`: Number
- `roiPercentage`: Number
- `date`: Date
- `dateString`: String (Standardized `YYYY-MM-DD` calendar identifier, Indexed)
- `status`: Enum `['Credited', 'Failed', 'Pending']`
- **Unique Idempotent Index:**
  - `{ investment: 1, dateString: 1 }` (Unique) — Enforces database-level duplicate prevention for the same calendar date

---

## API Reference (Task 2)

Private routes require the header: `Authorization: Bearer <JWT_TOKEN>`.

### Authentication
- `POST /api/v1/auth/register` — Create user account with optional referral code
- `POST /api/v1/auth/login` — Authenticate and receive JWT token
- `GET /api/v1/auth/me` — Get current authenticated user profile
- `POST /api/v1/auth/deposit` — Add funds to wallet (for sandbox testing)

### Investments
- `GET /api/v1/investments/plans` — List preset investment plans
- `POST /api/v1/investments` — Activate investment plan, deduct wallet, trigger referral payout
- `GET /api/v1/investments` — List user's active and completed investment contracts

### Dashboard Metrics
- `GET /api/v1/dashboard` — Returns verbatim metrics (`totalInvestments`, `totalRoiEarned`, `totalLevelIncomeEarned`, `walletBalance`, `dailyRoi`, and 7-day earnings chart series)

### Referrals
- `GET /api/v1/referrals/direct` — List direct (Level 1) referrals with investment statistics
- `GET /api/v1/referrals/tree` — Return multi-level nested referral tree
- `GET /api/v1/referrals/history` — Audit ledger of referral commissions received

### ROI & Cron
- `GET /api/v1/roi/history` — Daily ROI payout ledger
- `POST /api/v1/cron/trigger-daily-roi` — Trigger daily ROI run on demand (useful for evaluator idempotency testing)
- `GET /api/health` — System diagnostics, uptime, and database connection state
- `GET /api/docs` — Interactive HTML documentation of all REST endpoints

---

## Business Logic & Calculations (Task 3)

### 1. Daily ROI Distribution
- **Formula:**
  $$\text{Daily ROI} = \frac{\text{Investment Amount} \times \text{Daily ROI Percentage}}{100}$$
- **Execution:**
  1. Finds all active contracts where `startDate <= today` and `investmentStatus === 'Active'`.
  2. Generates date string `YYYY-MM-DD` (UTC).
  3. Checks if `ROIHistory` already exists for `(investment, dateString)`. If found, skips.
  4. Atomically increments user's `walletBalance` and `totalRoiEarned`.
  5. Inserts an `ROIHistory` record.
  6. If contract maturity date is reached (`today >= endDate`), updates status to `Completed`.

### 2. 3-Tier Referral Commission Traversal
- **Rates:**
  - **Level 1 (Direct Sponsor):** 5.0%
  - **Level 2 (Upline Level 2):** 3.0%
  - **Level 3 (Upline Level 3):** 1.0%
  - **Level 4 and beyond:** 0% (Strictly capped at 3 tiers)
- **Execution:**
  1. Triggered immediately upon new investment creation.
  2. Traverses upward through the sponsor chain up to 3 tiers.
  3. Validates recipient account status (`Active`).
  4. Atomically credits the upline's `walletBalance` and `totalLevelIncomeEarned`.
  5. Logs each transaction to `ReferralIncome` with `{ investment, referralLevel }` unique index.

---

## Cron Scheduler & Idempotency (Task 5)

Implemented with `node-cron` in `backend/src/cron/roiCron.js`:
- Scheduled to run at midnight: `0 0 * * *`.
- **Two-tier idempotency defense:**
  - Application check: Checks if `dateString === YYYY-MM-DD` already exists before processing.
  - Database constraint: MongoDB unique compound index `{ investment: 1, dateString: 1 }` rejects duplicate writes even if two workers run at the same millisecond.
- Evaluators can test this via the frontend dashboard or by calling:
  ```bash
  curl -X POST http://localhost:5000/api/v1/cron/trigger-daily-roi \
    -H "Authorization: Bearer <TOKEN>"
  ```
  Running it twice for the same day returns `skippedCount` for contracts already credited and prevents duplicate payouts.

---

## Frontend Dashboard (Task 4)

Built with React 18, Vite, and Tailwind CSS in `frontend/`:
- **Theme System:** Defaults to a clean Corporate White palette, with 4 additional themes (Olive Green & Cream, Sunset Orange & Cream, Dark Mode, Emerald Onyx). Accessible via the palette icon in the header and login screen.
- **Metric Cards:** Real-time display of Total Investments, Daily ROI, Level Income, and Wallet Balance.
- **Recharts Analytics:** Visual area chart comparing 7-day Daily ROI earnings vs Referral commissions.
- **3 Ledger Tables with 1-Click CSV Export:**
  - Investment Portfolio (with status filter tabs and search)
  - Daily ROI Payout History
  - Referral Income History
- **Expandable Referral Tree:** Visual tree component rendering nested downlines with active investment volume.
- **Scheduler Testing Console:** Trigger the midnight cron job on demand and verify idempotency live in the browser.

---

## Setup & Local Reproduction

### Prerequisites
- Node.js (v18 or v20)
- npm (v9+)
- MongoDB Atlas or local MongoDB instance (MongoDB Atlas connection string is pre-configured in `.env`)

### Step 1: Start Backend
```bash
cd backend
npm install

# (Optional) Seed 5 demo accounts with pre-existing investments and hierarchy
npm run seed

# Run automated tests (14/14 tests)
npm test

# Start API server
npm run dev
# Server runs on: http://localhost:5000
# API docs available at: http://localhost:5000/api/docs
```

### Step 2: Start Frontend
```bash
cd ../frontend
npm install

npm run dev
# Dashboard runs on: http://localhost:3000
```

### Demo Accounts for Testing
- **Root Sponsor (Alice):**
  - Email: `alice@nexachain.ai`
  - Password: `password123`
  - *(Has active contracts, 3 tiers of referrals, and past payout logs)*
- **Downline Member (Bob):**
  - Email: `bob@nexachain.ai`
  - Password: `password123`
  - *(Referred directly by Alice)*

---

## Automated Test Suite

A test suite with 14 unit and integration tests is located in `backend/tests/`:

```bash
cd backend
npm test
```

### Test Coverage:
- `tests/referralMath.test.js`: Verifies exact 5%, 3%, 1% math, floating-point precision, and strict Level 4+ cap (0%).
- `tests/idempotency.test.js`: Verifies calendar-day duplicate prevention (running 2x or 10x does not duplicate payout).
- `tests/health.test.js`: Tests `/health`, `/api/health`, `/api/docs`, and 404 error responses.

---

## Postman Collection

A Postman collection is included in the repository at:  
`backend/postman/Nexachain_Investment_Platform.postman_collection.json`

### Usage:
1. Import the JSON file into Postman.
2. Run the request **1. Authentication -> Login User**.
3. A test script automatically extracts the JWT token and assigns it to `{{token}}`.
4. Subsequent requests use the bearer token automatically.

---

## Assumptions & Design Choices

1. **Referral Commission Rates:** Standard 3-tier structure (Level 1: 5%, Level 2: 3%, Level 3: 1%).
2. **Investment Activation:** Investments deduct directly from the user's liquid `walletBalance`. A test deposit feature (`POST /api/v1/auth/deposit`) is available so evaluators can top up balances without external payment gateways.
3. **Calendar-Day Idempotency:** Daily ROI is bound to a `YYYY-MM-DD` date string. A contract can receive at most one credit per calendar day.
4. **Transaction Support:** Uses MongoDB `ClientSession` transactions when running on replica sets (like MongoDB Atlas), with atomic fallbacks for standalone local instances.

---

## Assessment Verification Checklist

- [x] Task 1: Database schemas with strict typing and compound indexes.
- [x] Task 2: RESTful APIs for Auth, Investments, Dashboard, and Referrals.
- [x] Task 3: Daily ROI calculation and 3-tier upline referral distribution.
- [x] Task 4: Responsive React dashboard with Recharts, 3 tables with CSV export, and referral tree.
- [x] Task 5: node-cron scheduler at `0 0 * * *` with 2-tier idempotency duplicate prevention.
- [x] Deliverables: GitHub repository, Postman collection, API docs, seed script, unit tests, and README.
