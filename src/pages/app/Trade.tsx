import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatUSD } from "@/lib/tiers";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "EURUSD", "GBPUSD", "XAUUSD"];
const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1D"] as const;

declare global { interface Window { LightweightCharts?: any; } }

const loadCharts = () => new Promise<void>((res, rej) => {
  if (window.LightweightCharts) return res();
  const s = document.createElement("script");
  s.src = "https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js";
  s.onload = () => res(); s.onerror = () => rej(new Error("Failed to load charts"));
  document.head.appendChild(s);
});

const genCandles = (symbol: string, count = 200) => {
  const base = symbol.includes("BTC") ? 65000 : symbol.includes("ETH") ? 3300 : symbol === "XAUUSD" ? 2400 : symbol.includes("SOL") ? 165 : 1.1;
  const step = symbol.includes("USD") && !symbol.includes("USDT") ? 0.0008 : base * 0.005;
  const candles: any[] = [];
  let price = base;
  const now = Math.floor(Date.now() / 1000) - count * 3600;
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * step * 4;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * step * 2;
    const low = Math.min(open, close) - Math.random() * step * 2;
    candles.push({ time: now + i * 3600, open, high, low, close });
    price = close;
  }
  return candles;
};

const Trade = () => {
  const { user } = useAuth();
  const chartRef = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [tf, setTf] = useState<typeof TIMEFRAMES[number]>("1h");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState<string>("");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [lots, setLots] = useState("0.10");
  const [sl, setSl] = useState(""); const [tp, setTp] = useState("");
  const [positions, setPositions] = useState<any[]>([]);
  const [price, setPrice] = useState(65000);

  useEffect(() => {
    if (!user) return;
    supabase.from("challenges").select("id, tier, account_size").eq("user_id", user.id).then(({ data }) => {
      setAccounts(data || []); if (data?.[0]) setAccountId(data[0].id);
    });
  }, [user]);

  const loadPositions = async () => {
    if (!user) return;
    const { data } = await supabase.from("trades").select("*").eq("user_id", user.id).eq("status", "open").order("opened_at", { ascending: false });
    setPositions(data || []);
  };
  useEffect(() => { loadPositions(); }, [user]);

  useEffect(() => {
    let series: any, chart: any, dispose = () => {};
    (async () => {
      await loadCharts();
      if (!chartRef.current || !window.LightweightCharts) return;
      chart = window.LightweightCharts.createChart(chartRef.current, {
        layout: { background: { color: "#0a0a0a" }, textColor: "#cfcfcf" },
        grid: { vertLines: { color: "#1a1a1a" }, horzLines: { color: "#1a1a1a" } },
        crosshair: { vertLine: { color: "#FFD700" }, horzLine: { color: "#FFD700" } },
        rightPriceScale: { borderColor: "#222" }, timeScale: { borderColor: "#222" },
        width: chartRef.current.clientWidth, height: chartRef.current.clientHeight,
      });
      series = chart.addCandlestickSeries({
        upColor: "#22c55e", downColor: "#ef4444",
        wickUpColor: "#22c55e", wickDownColor: "#ef4444",
        borderVisible: false,
      });
      const candles = genCandles(symbol);
      series.setData(candles);
      setPrice(candles[candles.length - 1].close);
      chart.timeScale().fitContent();
      const onResize = () => chart.applyOptions({ width: chartRef.current!.clientWidth, height: chartRef.current!.clientHeight });
      window.addEventListener("resize", onResize);
      dispose = () => { window.removeEventListener("resize", onResize); chart.remove(); };
    })();
    return () => dispose();
  }, [symbol, tf]);

  const submitOrder = async (side: "buy" | "sell") => {
    if (!user || !accountId) { toast.error("Pick an account"); return; }
    const lotsNum = parseFloat(lots);
    if (!lotsNum || lotsNum <= 0) { toast.error("Invalid lot size"); return; }
    const { error } = await supabase.from("trades").insert({
      user_id: user.id, challenge_id: accountId, symbol, side,
      lots: lotsNum, entry_price: price, status: "open",
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`${side.toUpperCase()} ${lotsNum} ${symbol} @ ${price.toFixed(2)}`);
    loadPositions();
  };

  const close = async (id: string, entry: number, side: string, lotsN: number) => {
    const exit = price;
    const pnl = (side === "buy" ? exit - entry : entry - exit) * lotsN * (symbol.includes("USD") && !symbol.includes("USDT") ? 100000 : 1);
    const { error } = await supabase.from("trades").update({ status: "closed", exit_price: exit, pnl: +pnl.toFixed(2), closed_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Closed @ ${exit.toFixed(2)} · PnL ${formatUSD(pnl)}`);
    loadPositions();
  };

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-4 h-[calc(100vh-9rem)]">
      <div className="rounded-2xl bg-card text-card-foreground border border-border p-5 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">New Order</h2>
        <div className="space-y-3">
          <div><Label>Symbol</Label><Select value={symbol} onValueChange={setSymbol}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{SYMBOLS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Account</Label><Select value={accountId} onValueChange={setAccountId}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Pick account" /></SelectTrigger><SelectContent>{accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.tier.toUpperCase()} · {formatUSD(Number(a.account_size))}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["market", "limit"] as const).map(t => (
              <button key={t} onClick={() => setOrderType(t)} className={`flex-1 py-1.5 rounded-md text-sm font-semibold capitalize ${orderType === t ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
          <div><Label>Lot size</Label><Input value={lots} onChange={e => setLots(e.target.value)} className="mt-1.5" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Stop Loss</Label><Input value={sl} onChange={e => setSl(e.target.value)} className="mt-1.5" /></div>
            <div><Label className="text-xs">Take Profit</Label><Input value={tp} onChange={e => setTp(e.target.value)} className="mt-1.5" /></div>
          </div>
          <div className="text-xs text-muted-foreground">Mark price: <span className="font-mono text-foreground font-semibold">{price.toFixed(symbol.includes("USD") && !symbol.includes("USDT") ? 5 : 2)}</span></div>
          <Button onClick={() => submitOrder("buy")} className="w-full h-12 bg-success hover:bg-success/90 text-white font-black text-base">BUY</Button>
          <Button onClick={() => submitOrder("sell")} className="w-full h-12 bg-destructive hover:bg-destructive/90 text-white font-black text-base">SELL</Button>
        </div>
        <div className="mt-6">
          <h3 className="font-bold text-sm mb-2 uppercase tracking-wider text-muted-foreground">Open positions</h3>
          <div className="space-y-2">
            {positions.length === 0 && <div className="text-sm text-muted-foreground py-3 text-center">No open positions</div>}
            {positions.map(p => {
              const livePnl = (p.side === "buy" ? price - Number(p.entry_price) : Number(p.entry_price) - price) * Number(p.lots) * (p.symbol.includes("USD") && !p.symbol.includes("USDT") ? 100000 : 1);
              return (
                <div key={p.id} className="rounded-lg bg-muted/50 p-3 text-sm">
                  <div className="flex justify-between"><span className="font-bold">{p.symbol}</span><span className={p.side === "buy" ? "text-success uppercase font-bold" : "text-destructive uppercase font-bold"}>{p.side}</span></div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>{p.lots} lots @ {Number(p.entry_price).toFixed(2)}</span><span className={livePnl >= 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>{livePnl >= 0 ? "+" : ""}{formatUSD(livePnl)}</span></div>
                  <Button size="sm" variant="outline" className="mt-2 w-full h-7 text-xs" onClick={() => close(p.id, Number(p.entry_price), p.side, Number(p.lots))}>Close position</Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="font-bold text-card-foreground">{symbol}</div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {TIMEFRAMES.map(t => (
              <button key={t} onClick={() => setTf(t)} className={`px-3 py-1 rounded-md text-xs font-semibold ${tf === t ? "bg-gold text-black" : "text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div ref={chartRef} className="flex-1 min-h-[400px]" />
      </div>
    </div>
  );
};
export default Trade;
