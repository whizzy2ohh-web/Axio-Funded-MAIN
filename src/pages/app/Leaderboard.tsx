import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award } from "lucide-react";

const ROWS = [
  { name: "Mar***ez", tier: "Elite", size: 100000, profit: 24.6, winRate: 71, days: 18 },
  { name: "Yos***ki", tier: "Pro", size: 50000, profit: 21.2, winRate: 68, days: 14 },
  { name: "Liu***ng", tier: "Elite", size: 100000, profit: 18.4, winRate: 64, days: 22 },
  { name: "Sof***ya", tier: "Pro", size: 25000, profit: 17.1, winRate: 70, days: 11 },
  { name: "Joh***re", tier: "Starter", size: 10000, profit: 15.8, winRate: 66, days: 9 },
  { name: "Aks***il", tier: "Pro", size: 50000, profit: 14.2, winRate: 62, days: 16 },
  { name: "Car***os", tier: "Elite", size: 100000, profit: 13.7, winRate: 59, days: 24 },
  { name: "Pri***na", tier: "Starter", size: 5000, profit: 12.9, winRate: 73, days: 8 },
  { name: "Tho***as", tier: "Pro", size: 25000, profit: 12.1, winRate: 60, days: 13 },
  { name: "Wei***ng", tier: "Elite", size: 100000, profit: 11.8, winRate: 57, days: 19 },
  { name: "Ema***el", tier: "Starter", size: 10000, profit: 10.6, winRate: 65, days: 7 },
  { name: "Fer***da", tier: "Pro", size: 50000, profit: 10.2, winRate: 61, days: 12 },
  { name: "Hen***ik", tier: "Elite", size: 100000, profit: 9.7, winRate: 58, days: 17 },
  { name: "Iva***na", tier: "Pro", size: 25000, profit: 9.1, winRate: 63, days: 10 },
  { name: "Kob***hi", tier: "Starter", size: 10000, profit: 8.6, winRate: 67, days: 6 },
  { name: "Luc***as", tier: "Pro", size: 50000, profit: 8.0, winRate: 60, days: 11 },
  { name: "Mat***eo", tier: "Elite", size: 100000, profit: 7.4, winRate: 55, days: 15 },
  { name: "Nia***le", tier: "Starter", size: 5000, profit: 6.8, winRate: 69, days: 5 },
  { name: "Ola***fe", tier: "Pro", size: 25000, profit: 6.2, winRate: 58, days: 9 },
  { name: "Pat***ck", tier: "Elite", size: 100000, profit: 5.9, winRate: 56, days: 13 },
];

const medal = (r: number) =>
  r === 1 ? <Trophy className="h-5 w-5 text-gold-bright" /> :
  r === 2 ? <Medal className="h-5 w-5 text-gold-soft" /> :
  r === 3 ? <Award className="h-5 w-5 text-gold" /> : <span className="text-muted-foreground font-mono text-sm">#{r}</span>;

const Leaderboard = () => {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? ROWS : ROWS.filter(r => r.tier.toLowerCase() === tab);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">AXIO FUNDED <span className="text-gradient-gold">LEADERBOARD</span></h1>
        <p className="text-white/60 mt-1">Top performing traders this month.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All Tiers</TabsTrigger>
          <TabsTrigger value="starter">Starter</TabsTrigger>
          <TabsTrigger value="pro">Pro</TabsTrigger>
          <TabsTrigger value="elite">Elite</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-2xl bg-card text-card-foreground border border-border overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 text-xs uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/40">
          <div className="col-span-1">Rank</div><div className="col-span-3">Trader</div>
          <div className="col-span-2">Tier</div><div className="col-span-2">Size</div>
          <div className="col-span-2 text-right">Profit</div><div className="col-span-1 text-right">Win%</div><div className="col-span-1 text-right">Days</div>
        </div>
        {filtered.map((r, i) => (
          <div key={r.name} className="grid grid-cols-12 px-6 py-3.5 items-center border-b border-border last:border-0 hover:bg-muted/30">
            <div className="col-span-1 flex items-center">{medal(i + 1)}</div>
            <div className="col-span-3 font-mono">{r.name}</div>
            <div className="col-span-2 text-sm">{r.tier}</div>
            <div className="col-span-2 text-sm">${r.size.toLocaleString()}</div>
            <div className="col-span-2 text-right font-bold text-success">+{r.profit}%</div>
            <div className="col-span-1 text-right">{r.winRate}%</div>
            <div className="col-span-1 text-right text-muted-foreground">{r.days}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Leaderboard;
