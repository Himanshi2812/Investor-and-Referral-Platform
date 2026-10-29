const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nexachain AI - REST API Documentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0B0F19; color: #E5E7EB; }
    pre, code { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-6 md:p-12 max-w-6xl mx-auto space-y-10">
  <header class="border-b border-gray-800 pb-6 flex items-center justify-between">
    <div>
      <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Production API v1.0</span>
      <h1 class="text-3xl font-extrabold text-white mt-2">NEXACHAIN AI REST API Specifications</h1>
      <p class="text-sm text-gray-400 mt-1">MERN Stack Technical Assessment Documentation</p>
    </div>
    <div class="text-right text-xs text-gray-400">
      <div>Base URL: <code class="text-emerald-400 bg-gray-900 px-2 py-1 rounded">http://localhost:5000/api/v1</code></div>
      <div class="mt-1">Auth Header: <code class="text-indigo-400 bg-gray-900 px-2 py-1 rounded">Authorization: Bearer &lt;token&gt;</code></div>
    </div>
  </header>

  <!-- Section 1: Authentication -->
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white flex items-center space-x-2">
      <span class="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
      <span>1. Authentication APIs</span>
    </h2>
    <div class="grid gap-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
        <div class="flex items-center space-x-3">
          <span class="bg-green-600/20 text-green-400 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">POST</span>
          <code class="text-white font-semibold">/api/v1/auth/register</code>
          <span class="text-xs text-gray-400">— Register user and generate unique referral code</span>
        </div>
        <div class="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <div class="text-gray-400 font-semibold mb-1">Sample Request Body:</div>
            <pre class="bg-gray-950 p-3 rounded-lg text-gray-300 overflow-x-auto">{\n  "fullName": "Jane Doe",\n  "email": "jane@example.com",\n  "mobileNumber": "+1234567890",\n  "password": "password123",\n  "referralCode": "NXAARAV1" // Optional sponsor\n}</pre>
          </div>
          <div>
            <div class="text-gray-400 font-semibold mb-1">Sample 201 Response:</div>
            <pre class="bg-gray-950 p-3 rounded-lg text-emerald-400 overflow-x-auto">{\n  "success": true,\n  "data": {\n    "token": "eyJhbGciOi...",\n    "user": {\n      "fullName": "Jane Doe",\n      "referralCode": "NX98F2A1",\n      "walletBalance": 1000\n    }\n  }\n}</pre>
          </div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
        <div class="flex items-center space-x-3">
          <span class="bg-green-600/20 text-green-400 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">POST</span>
          <code class="text-white font-semibold">/api/v1/auth/login</code>
          <span class="text-xs text-gray-400">— Authenticate and receive JWT token</span>
        </div>
        <div class="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <div class="text-gray-400 font-semibold mb-1">Sample Request Body:</div>
            <pre class="bg-gray-950 p-3 rounded-lg text-gray-300">{\n  "email": "aarav@nexachain.ai",\n  "password": "password123"\n}</pre>
          </div>
          <div>
            <div class="text-gray-400 font-semibold mb-1">Sample 200 Response:</div>
            <pre class="bg-gray-950 p-3 rounded-lg text-emerald-400">{\n  "success": true,\n  "data": {\n    "token": "eyJhbGciOi...",\n    "user": { "fullName": "Aarav Sharma", ... }\n  }\n}</pre>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 2: Investment -->
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white flex items-center space-x-2">
      <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
      <span>2. Investment APIs</span>
    </h2>
    <div class="grid gap-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
        <div class="flex items-center space-x-3">
          <span class="bg-green-600/20 text-green-400 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">POST</span>
          <code class="text-white font-semibold">/api/v1/investments</code>
          <span class="text-xs text-gray-400">— Deducts wallet, activates contract, triggers multi-tier commissions</span>
        </div>
        <div class="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <div class="text-gray-400 font-semibold mb-1">Sample Request Body:</div>
            <pre class="bg-gray-950 p-3 rounded-lg text-gray-300">{\n  "planId": "growth",\n  "amount": 1000\n}</pre>
          </div>
          <div>
            <div class="text-gray-400 font-semibold mb-1">Sample 201 Response:</div>
            <pre class="bg-gray-950 p-3 rounded-lg text-emerald-400">{\n  "success": true,\n  "data": {\n    "investment": {\n      "investmentAmount": 1000,\n      "dailyRoiPercentage": 2.0,\n      "investmentStatus": "Active"\n    },\n    "referralDistributions": [ ... ]\n  }\n}</pre>
          </div>
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
        <div class="flex items-center space-x-3">
          <span class="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">GET</span>
          <code class="text-white font-semibold">/api/v1/investments</code>
          <span class="text-xs text-gray-400">— List user investments with status filters and totals</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Section 3: Dashboard -->
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white flex items-center space-x-2">
      <span class="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
      <span>3. Dashboard APIs (Verbatim Spec)</span>
    </h2>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <div class="flex items-center space-x-3">
        <span class="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">GET</span>
        <code class="text-white font-semibold">/api/v1/dashboard</code>
      </div>
      <div class="text-xs">
        <div class="text-gray-400 font-semibold mb-1">Sample 200 Response:</div>
        <pre class="bg-gray-950 p-3 rounded-lg text-emerald-400">{\n  "success": true,\n  "data": {\n    "totalInvestments": 5000,\n    "totalRoiEarned": 350.5,\n    "totalLevelIncomeEarned": 1100.0,\n    "walletBalance": 2450.5,\n    "dailyRoi": 125.0,\n    "charts": { ... }\n  }\n}</pre>
      </div>
    </div>
  </section>

  <!-- Section 4: Referral -->
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white flex items-center space-x-2">
      <span class="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
      <span>4. Referral APIs</span>
    </h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
        <div class="flex items-center space-x-2">
          <span class="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded text-xs font-mono font-bold">GET</span>
          <code class="text-white text-xs">/api/v1/referrals/direct</code>
        </div>
        <p class="text-xs text-gray-400">Fetches direct Level 1 referrals with their total investments count and active volume.</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
        <div class="flex items-center space-x-2">
          <span class="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded text-xs font-mono font-bold">GET</span>
          <code class="text-white text-xs">/api/v1/referrals/tree?depth=4</code>
        </div>
        <p class="text-xs text-gray-400">Fetches complete multi-level tree hierarchy in nested JSON format.</p>
      </div>
    </div>
  </section>

  <!-- Section 5: Cron & Idempotency -->
  <section class="space-y-4">
    <h2 class="text-xl font-bold text-white flex items-center space-x-2">
      <span class="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
      <span>5. Automated Cron & Idempotency Simulation</span>
    </h2>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3 text-xs">
      <div class="flex items-center space-x-3">
        <span class="bg-green-600/20 text-green-400 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">POST</span>
        <code class="text-white font-semibold">/api/v1/cron/trigger-daily-roi</code>
        <span class="text-gray-400">— Manual trigger for evaluators to test idempotent double-run protection</span>
      </div>
      <p class="text-gray-300">
        Scheduler is registered at <code class="text-indigo-400">0 0 * * *</code> (midnight). When triggered twice for the same calendar date, the unique compound index <code class="text-amber-400">{ investment: 1, dateString: 1 }</code> prevents duplicate payouts.
      </p>
    </div>
  </section>
</body>
</html>`;
  res.send(html);
});

module.exports = router;
