## AXIO FUNDED — Build Plan

A premium prop-trading firm site with a public marketing experience and a protected trader dashboard, backed by a real database, real auth, and Stripe checkout for challenge fees.

### Brand & Design System
- Palette: white #FFFFFF, deep black #0A0A0A, muted gold #C9A84C, highlight gold #FFD700. Subtle gold gradients on CTAs and hero accents.
- Typography: Inter (bold, large headings; gold gradient text on key headlines).
- Style: luxury fintech — clean white sections alternated with deep-black sections featuring glassmorphism cards with gold borders. Smooth hover lifts and gold glow on CTAs.
- Logo: the uploaded AXIO FUNDED gold mark, used in the navbar, sidebar, auth pages, and footer.
- Tokens added to `index.css` and `tailwind.config.ts` so every component pulls from the same design system.

### Sitemap
```text
Public
  /                 Landing (hero, how it works, tiers, leaderboard preview, FAQ, footer)
  /login            Login
  /signup           Sign up
  /checkout/success Stripe success redirect
  /checkout/cancel  Stripe cancel redirect

Protected (sidebar shell)
  /app              Dashboard home
  /app/accounts     My challenge accounts
  /app/trade        Trading terminal
  /app/history      Trade history
  /app/leaderboard  Leaderboard
  /app/payouts      Payout request + history
  /app/settings     Profile / password
```

### Landing Page
- Hero: dark gradient with animated gold particle/line canvas, headline "TRADE, GROW, GET FUNDED", subheadline, gold-filled "Start Your Challenge" + gold-outlined "View Pricing", animated stats strip (90% split, $100K, MT4/5 + Binance/Bybit/BingX, 3 tiers).
- How It Works: 3 gold-iconed steps.
- Challenge Tiers (the 3 tiers from the prompt — Starter, Pro, Elite — all 90% split). Pro card elevated with gold "MOST POPULAR" badge. Each card's "Get Started" triggers Stripe checkout (or routes to signup if logged out).
- Leaderboard preview: top 5 traders.
- FAQ accordion (platforms, payouts, crypto, failure, evaluation length).
- Footer with logo, nav, socials, © 2025.

### Authentication
- Real email/password auth via Lovable Cloud (Supabase). Auth state via `onAuthStateChange` + session listener. Protected routes redirect to `/login`.
- Sign up fields: full name, email, password, confirm password, country, optional referral code, ToS checkbox. Profile row created via DB trigger.
- Login: email/password + "Forgot password?" → reset email flow + `/reset-password` page.

### Trader Dashboard Shell
- Collapsible Shadcn sidebar with the AXIO logo, nav links (Dashboard, Accounts, Trade, History, Leaderboard, Payouts, Settings, Logout), avatar + name pinned at the bottom. Hamburger / off-canvas on mobile.
- Top header with sidebar trigger and a small account-status pill.

### Dashboard Home
- "Welcome back, {name}" banner.
- Stats cards: Active Accounts, Total Profit, Pending Payouts, Win Rate.
- Account status widget: phase, profit-target progress bar, drawdown gauge (green/amber/red).
- Recent trades mini-table (last 5).
- Quick actions: Open Trade, Request Payout, View Leaderboard.

### My Challenge Accounts
- Card/table list: account ID, tier, size, platform, phase (Phase 1 / Phase 2 / Funded), status (Active/Passed/Breached) with color-coded badges, profit %, drawdown %.
- "Connect Account" modal with platform dropdown. Conditional fields:
  - MetaTrader 4/5 → Server, Login ID, Password.
  - Binance / Bybit / BingX → API Key, API Secret.
- Credentials stored in `account_credentials` (RLS owner-only). Toast confirmation on connect.

### Trading Terminal
- 30/70 split. Left: symbol selector (EURUSD, BTCUSDT, ETHUSDT, XAUUSD, etc.), account selector, Market/Limit toggle, lot size, SL, TP, large green BUY / red SELL, open positions mini-table with per-row Close.
- Right: TradingView Lightweight Charts (CDN) — dark theme, gold crosshair, candlestick BTC/USDT mock OHLCV, timeframe tabs 1m/5m/15m/1h/4h/1D.
- Submitting an order writes a row to `trades`; closing updates PnL.

### Trade History
- Filter bar: date range, platform, symbol, side. Sortable columns: time, symbol, side, lots, entry, exit, PnL (color coded), account.
- Top summary: total trades, win rate, total PnL, best trade.
- "Download CSV" export. Seeded with 20+ realistic rows per new user.

### Leaderboard
- Header + tier tabs (All / Starter / Pro / Elite). Rank column with gold/silver/bronze medal icons for top 3. Masked usernames (e.g. `Joh***re`). 20 seeded rows.

### Payouts
- Request form: account dropdown (funded only), available balance (auto), amount, method (Bank Transfer / USDT TRC20 / USDT ERC20 / BTC), conditional wallet/bank fields, Submit.
- Payout history table: date, amount, method, status (Pending/Approved/Paid), processed date.

### Backend (Lovable Cloud)
Tables (all with RLS, owner-only policies, `user_id` non-nullable):
- `profiles` (id ↔ auth.users, full_name, country, referral_code, avatar_url) — auto-created via `on_auth_user_created` trigger.
- `challenges` (id, user_id, tier, account_size, phase, status, profit_pct, drawdown_pct, stripe_session_id, created_at).
- `account_credentials` (id, user_id, challenge_id, platform, server, login_id, password_encrypted, api_key_encrypted, api_secret_encrypted).
- `trades` (id, user_id, challenge_id, symbol, side, lots, entry_price, exit_price, pnl, opened_at, closed_at, status).
- `payouts` (id, user_id, challenge_id, amount, method, destination, status, requested_at, processed_at).
- `leaderboard_view` (materialized aggregation by user/challenge).
- Roles handled via separate `user_roles` table + `has_role()` security-definer function (admin role reserved for future admin panel).

Edge functions:
- `create-checkout` — creates a Stripe Checkout Session for a chosen tier/size and returns the URL.
- `stripe-webhook` — on `checkout.session.completed`, inserts a new `challenges` row in Phase 1 / Active for the buyer.

### Payments (Stripe)
- Enable Lovable's built-in Stripe payments. Create products for the 3 tiers in the prompt (Starter $5K/$10K, Pro $25K/$50K, Elite $100K) — fees are placeholders we'll confirm with you before creating products. Each "Get Started" / tier "Buy" button calls `create-checkout` and redirects to Stripe; success returns to `/checkout/success` and auto-creates the challenge via webhook.

### Cross-cutting
- Responsive across mobile/tablet/desktop. Skeleton loaders on data tables. Sonner toasts for all actions. Zod validation on every form (client + edge functions). Encoded inputs, no `dangerouslySetInnerHTML`. SPA routing via React Router (BrowserRouter).

### Build Order
1. Design tokens, logo asset, Inter font, base layout primitives.
2. Landing page (hero, how-it-works, tiers, leaderboard preview, FAQ, footer).
3. Enable Lovable Cloud → auth (signup/login/reset) + protected route guard.
4. DB schema + RLS + triggers + seed data.
5. Dashboard shell + Dashboard home.
6. Accounts page + Connect Account modal.
7. Trading terminal (Lightweight Charts + order flow).
8. Trade History + CSV export.
9. Leaderboard.
10. Payouts (form + history).
11. Stripe enable + products + checkout edge function + webhook + success/cancel pages.
12. Polish: animations, skeletons, mobile QA, security scan.

After approval I'll confirm the exact Stripe fee per tier with you (the prompt didn't specify), then start building.
