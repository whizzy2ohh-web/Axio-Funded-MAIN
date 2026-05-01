import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { seedUserData } from "@/lib/seed";
import { Wallet, TrendingUp, Banknote, Target, ArrowRight, LineChart, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatUSD } from "@/lib/tiers";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ accounts: 0, profit: 0, pendingPayouts: 0, winRate: 0 });
  const [active, setActive] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      await seedUserData(user.id);
      const [{ data: ch }, { data: tr }, { data: po }] = await Promise.all([
        supabase.from("challenges").select("*").eq("user_id", user.id),
        supabase.from("trades").select("*").eq("user_id", user.id).order("opened_at", { ascending: false }),
        supabase.from("payouts").select("amount").eq("user_id", user.id).eq("status", "pending"),
      ]);
      const trades = tr || [];
      const wins = trades.filter(t => Number(t.pnl) > 0).length;
      const totalProfit = trades.reduce((s, t) => s + Number(t.pnl), 0);
      const pending = (po || []).reduce((s, p) => s + Number(p.amount), 0);
      setStats({
        accounts: (ch || []).filter(c => c.status === "active").length,
        profit: totalProfit, pendingPayouts: pending,
        winRate: trades.length ? +(wins / trades.length * 100).toFixed(1) : 0,
      });
      setActive((ch || [])[0] || null);
      setRecent(trades.slice(0, 5));
      setLoading(false);
    })();
  }, [user]);

  const fullName = user?.user_metadata?.full_name || (user?.email || "").split("@")[0];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl glass-gold p-6 md:p-8">
        <p className="text-xs uppercase tracking-widest text-gold font-semibold">Trader dashboard</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-black">Welcome back, <span className="text-gradient-gold">{fullName}</span></h1>
        <p className="mt-2 text-white/60">Here's what's happening with your funded accounts today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Accounts", value: stats.accounts.toString(), icon: Wallet },
          { label: "Total Profit", value: formatUSD(stats.profit), icon: TrendingUp, accent: stats.profit >= 0 ? "text-success" : "text-destructive" },
          { label: "Pending Payouts", value: formatUSD(stats.pendingPayouts), icon: Banknote },
          { label: "Win Rate", value: `${stats.winRate}%`, icon: Target },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-card text-card-foreground border border-border p-5 hover-lift">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="h-9 w-9 rounded-lg bg-gold/15 flex items-center justify-center"><s.icon className="h-4 w-4 text-gold" /></div>
            </div>
            <div className={`mt-3 text-2xl font-black ${s.accent || ""}`}>{loading ? "—" : s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-card text-card-foreground border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Account Status</h3>
            {active && <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/15 text-gold font-bold">{active.tier} · {active.phase.replace("_", " ")}</span>}
          </div>
          {active ? (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Profit Target</span><span className="font-semibold">{active.profit_pct}% / 8%</span></div>
                <Progress value={Math.min(100, (active.profit_pct / 8) * 100)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Drawdown</span>
                  <span className={`font-semibold ${active.drawdown_pct > 4 ? "text-destructive" : active.drawdown_pct > 2.5 ? "text-warning" : "text-success"}`}>{active.drawdown_pct}% / 5%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${active.drawdown_pct > 4 ? "bg-destructive" : active.drawdown_pct > 2.5 ? "bg-warning" : "bg-success"}`} style={{ width: `${Math.min(100, (active.drawdown_pct / 5) * 100)}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-lg bg-muted/50 p-3"><div className="text-xs text-muted-foreground">Account size</div><div className="font-bold">{formatUSD(Number(active.account_size))}</div></div>
                <div className="rounded-lg bg-muted/50 p-3"><div className="text-xs text-muted-foreground">Balance</div><div className="font-bold">{formatUSD(Number(active.available_balance))}</div></div>
                <div className="rounded-lg bg-muted/50 p-3"><div className="text-xs text-muted-foreground">Status</div><div className="font-bold capitalize text-success">{active.status}</div></div>
              </div>
            </div>
          ) : <p className="text-muted-foreground">No active challenge yet. <Link to="/#pricing" className="text-gold font-semibold">Start one</Link>.</p>}
        </div>

        <div className="rounded-2xl bg-card text-card-foreground border border-border p-6">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button asChild className="w-full justify-between bg-gradient-gold text-black font-semibold"><Link to="/app/trade">Open Trade <LineChart className="h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" className="w-full justify-between border-gold text-gold hover:bg-gold/10"><Link to="/app/payouts">Request Payout <Banknote className="h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" className="w-full justify-between"><Link to="/app/leaderboard">View Leaderboard <Trophy className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card text-card-foreground border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Recent trades</h3>
          <Link to="/app/history" className="text-sm text-gold hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr><th className="text-left py-3">Symbol</th><th className="text-left">Side</th><th className="text-left">Lots</th><th className="text-right">PnL</th><th className="text-right">Time</th></tr>
            </thead>
            <tbody>
              {recent.map(t => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-semibold">{t.symbol}</td>
                  <td className={t.side === "buy" ? "text-success font-semibold uppercase" : "text-destructive font-semibold uppercase"}>{t.side}</td>
                  <td>{t.lots}</td>
                  <td className={`text-right font-bold ${Number(t.pnl) >= 0 ? "text-success" : "text-destructive"}`}>{Number(t.pnl) >= 0 ? "+" : ""}{formatUSD(Number(t.pnl))}</td>
                  <td className="text-right text-muted-foreground">{new Date(t.opened_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No trades yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
