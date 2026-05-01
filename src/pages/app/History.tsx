import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatUSD } from "@/lib/tiers";

const History = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("all");
  const [side, setSide] = useState("all");
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("trades").select("*").eq("user_id", user.id).eq("status", "closed").order("opened_at", { ascending: false }).then(({ data }) => setRows(data || []));
  }, [user]);

  const filtered = useMemo(() => rows.filter(r => {
    if (symbol !== "all" && r.symbol !== symbol) return false;
    if (side !== "all" && r.side !== side) return false;
    if (from && new Date(r.opened_at) < new Date(from)) return false;
    if (to && new Date(r.opened_at) > new Date(to)) return false;
    return true;
  }), [rows, symbol, side, from, to]);

  const symbols = useMemo(() => Array.from(new Set(rows.map(r => r.symbol))), [rows]);
  const totalPnl = filtered.reduce((s, r) => s + Number(r.pnl), 0);
  const wins = filtered.filter(r => Number(r.pnl) > 0).length;
  const winRate = filtered.length ? (wins / filtered.length * 100).toFixed(1) : "0";
  const best = filtered.reduce((m, r) => Math.max(m, Number(r.pnl)), 0);

  const exportCsv = () => {
    const header = "Date,Symbol,Side,Lots,Entry,Exit,PnL\n";
    const body = filtered.map(r => `${new Date(r.opened_at).toISOString()},${r.symbol},${r.side},${r.lots},${r.entry_price},${r.exit_price ?? ""},${r.pnl}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "axio-trades.csv"; a.click();
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">Trade History</h1><p className="text-white/60 mt-1">Review and export every closed trade.</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Trades", v: filtered.length.toString() },
          { l: "Win Rate", v: `${winRate}%` },
          { l: "Total PnL", v: formatUSD(totalPnl), c: totalPnl >= 0 ? "text-success" : "text-destructive" },
          { l: "Best Trade", v: formatUSD(best), c: "text-success" },
        ].map(s => (
          <div key={s.l} className="rounded-xl bg-card text-card-foreground border border-border p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className={`mt-2 text-2xl font-black ${s.c || ""}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card text-card-foreground border border-border p-5">
        <div className="flex flex-wrap gap-3 items-end mb-5">
          <div><label className="text-xs uppercase text-muted-foreground">From</label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="mt-1 w-40" /></div>
          <div><label className="text-xs uppercase text-muted-foreground">To</label><Input type="date" value={to} onChange={e => setTo(e.target.value)} className="mt-1 w-40" /></div>
          <div>
            <label className="text-xs uppercase text-muted-foreground">Symbol</label>
            <Select value={symbol} onValueChange={setSymbol}><SelectTrigger className="mt-1 w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem>{symbols.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground">Side</label>
            <Select value={side} onValueChange={setSide}><SelectTrigger className="mt-1 w-32"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="buy">Buy</SelectItem><SelectItem value="sell">Sell</SelectItem></SelectContent>
            </Select>
          </div>
          <Button onClick={exportCsv} className="ml-auto bg-gradient-gold text-black font-semibold"><Download className="h-4 w-4 mr-1.5" /> Download CSV</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr><th className="text-left py-3">Date</th><th className="text-left">Symbol</th><th className="text-left">Side</th><th className="text-right">Lots</th><th className="text-right">Entry</th><th className="text-right">Exit</th><th className="text-right">PnL</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="py-3 text-muted-foreground">{new Date(r.opened_at).toLocaleString()}</td>
                  <td className="font-semibold">{r.symbol}</td>
                  <td className={r.side === "buy" ? "text-success uppercase font-semibold" : "text-destructive uppercase font-semibold"}>{r.side}</td>
                  <td className="text-right">{r.lots}</td>
                  <td className="text-right font-mono">{Number(r.entry_price).toFixed(2)}</td>
                  <td className="text-right font-mono">{Number(r.exit_price).toFixed(2)}</td>
                  <td className={`text-right font-bold ${Number(r.pnl) >= 0 ? "text-success" : "text-destructive"}`}>{Number(r.pnl) >= 0 ? "+" : ""}{formatUSD(Number(r.pnl))}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No trades match these filters</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default History;
