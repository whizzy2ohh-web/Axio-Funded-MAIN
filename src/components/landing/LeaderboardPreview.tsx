import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award } from "lucide-react";

const TOP = [
  { rank: 1, name: "Mar***ez", profit: 24.6, size: 100000, tier: "Elite" },
  { rank: 2, name: "Yos***ki", profit: 21.2, size: 50000, tier: "Pro" },
  { rank: 3, name: "Liu***ng", profit: 18.4, size: 100000, tier: "Elite" },
  { rank: 4, name: "Sof***ya", profit: 17.1, size: 25000, tier: "Pro" },
  { rank: 5, name: "Joh***re", profit: 15.8, size: 10000, tier: "Starter" },
];

const medal = (r: number) =>
  r === 1 ? <Trophy className="h-5 w-5 text-gold-bright" /> :
  r === 2 ? <Medal className="h-5 w-5 text-gold-soft" /> :
  r === 3 ? <Award className="h-5 w-5 text-gold" /> : null;

export const LeaderboardPreview = () => (
  <section id="leaderboard" className="py-28 bg-background">
    <div className="container mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">Leaderboard</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-black">Top funded traders <span className="text-gradient-gold">this month</span></h2>
        </div>
        <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold/10">
          <Link to="/login">View Full Leaderboard</Link>
        </Button>
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 text-xs uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
          <div className="col-span-2">Rank</div><div className="col-span-4">Trader</div>
          <div className="col-span-2">Tier</div><div className="col-span-2">Account</div>
          <div className="col-span-2 text-right">Profit</div>
        </div>
        {TOP.map(r => (
          <div key={r.rank} className="grid grid-cols-12 px-6 py-4 items-center border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
            <div className="col-span-2 flex items-center gap-2 font-bold">{medal(r.rank)} #{r.rank}</div>
            <div className="col-span-4 font-mono">{r.name}</div>
            <div className="col-span-2 text-sm">{r.tier}</div>
            <div className="col-span-2 text-sm">${r.size.toLocaleString()}</div>
            <div className="col-span-2 text-right font-bold text-success">+{r.profit}%</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
