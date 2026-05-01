import { Target, TrendingUp, Wallet } from "lucide-react";

const steps = [
  { icon: Target, title: "Choose Your Challenge", body: "Select an account size and tier that fits your trading style — from $5K Starter to $100K Elite." },
  { icon: TrendingUp, title: "Prove Your Skills", body: "Hit an 8% target in Phase 1 and 5% in Phase 2 while staying within risk limits. Trade your strategy." },
  { icon: Wallet, title: "Get Funded & Paid", body: "Receive your funded account and withdraw up to 90% of your profits on a bi-weekly cycle." },
];

export const HowItWorks = () => (
  <section id="how" className="py-28 bg-background">
    <div className="container mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">How it works</p>
        <h2 className="mt-3 text-4xl md:text-5xl font-black">From challenge to <span className="text-gradient-gold">funded</span>, in 3 steps</h2>
      </div>
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border border-border bg-card p-8 hover-lift">
            <div className="absolute -top-4 -left-4 h-10 w-10 rounded-xl bg-gradient-gold text-black font-black flex items-center justify-center text-lg shadow-gold">{i + 1}</div>
            <div className="h-14 w-14 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
              <s.icon className="h-7 w-7 text-gold" />
            </div>
            <h3 className="text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
