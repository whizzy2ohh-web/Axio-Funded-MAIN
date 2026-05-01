import { supabase } from "@/integrations/supabase/client";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "EURUSD", "XAUUSD", "GBPUSD", "SOLUSDT"];
const PLATFORMS: Array<"mt4" | "mt5" | "binance" | "bybit" | "bingx"> = ["mt5", "binance", "bybit", "mt4", "bingx"];
const TIERS: Array<{ tier: "starter" | "pro" | "elite"; size: number; phase: "phase_1" | "phase_2" | "funded" }> = [
  { tier: "starter", size: 10000, phase: "phase_2" },
  { tier: "pro", size: 25000, phase: "funded" },
];

const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const seedUserData = async (userId: string) => {
  const existing = await supabase.from("challenges").select("id").eq("user_id", userId).limit(1);
  if (existing.data && existing.data.length > 0) return;

  const challengeIds: string[] = [];
  for (const t of TIERS) {
    const balance = t.size * (1 + rand(0.02, 0.09));
    const { data, error } = await supabase.from("challenges").insert({
      user_id: userId, tier: t.tier, account_size: t.size, phase: t.phase,
      status: "active", profit_pct: +rand(2, 9).toFixed(2), drawdown_pct: +rand(0.5, 4).toFixed(2),
      available_balance: +balance.toFixed(2),
    }).select("id").single();
    if (!error && data) challengeIds.push(data.id);
  }

  const trades: any[] = [];
  for (let i = 0; i < 24; i++) {
    const symbol = pick(SYMBOLS);
    const side = Math.random() > 0.5 ? "buy" : "sell";
    const entry = symbol.includes("BTC") ? rand(58000, 72000) : symbol.includes("ETH") ? rand(2900, 3800) : symbol === "XAUUSD" ? rand(2300, 2500) : rand(1.05, 1.35);
    const pnl = +(rand(-180, 320)).toFixed(2);
    const exit = entry * (1 + (pnl >= 0 ? rand(0.001, 0.02) : -rand(0.001, 0.015)) * (side === "buy" ? 1 : -1));
    const opened = new Date(Date.now() - rand(1, 30) * 86400000);
    trades.push({
      user_id: userId, challenge_id: challengeIds[i % Math.max(challengeIds.length, 1)] || null,
      symbol, side, lots: +rand(0.05, 1.2).toFixed(2),
      entry_price: +entry.toFixed(symbol.includes("USD") && !symbol.includes("USDT") ? 5 : 2),
      exit_price: +exit.toFixed(symbol.includes("USD") && !symbol.includes("USDT") ? 5 : 2),
      pnl, status: "closed", opened_at: opened.toISOString(), closed_at: new Date(opened.getTime() + rand(1, 8) * 3600000).toISOString(),
    });
  }
  await supabase.from("trades").insert(trades);

  const cred = challengeIds[0];
  if (cred) {
    await supabase.from("account_credentials").insert({
      user_id: userId, challenge_id: cred, platform: "mt5", server: "AxioFunded-Live01", login_id: "1029384",
    });
  }

  await supabase.from("payouts").insert([
    { user_id: userId, challenge_id: challengeIds[1] || null, amount: 850, method: "usdt_trc20", destination: "TQn9Y…3kFp", status: "paid", processed_at: new Date(Date.now() - 8 * 86400000).toISOString() },
    { user_id: userId, challenge_id: challengeIds[1] || null, amount: 1200, method: "btc", destination: "bc1q…q8a", status: "approved" },
    { user_id: userId, challenge_id: challengeIds[1] || null, amount: 540, method: "bank", destination: "Acct ****4521", status: "pending" },
  ]);
};
