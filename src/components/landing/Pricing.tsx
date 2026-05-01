import { TIERS, formatUSD } from "@/lib/tiers";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Pricing = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (tier: string, size: number) => {
    if (!user) { nav("/signup"); return; }
    setLoading(`${tier}-${size}`);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", { body: { tier, size } });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      toast.error(e.message || "Could not start checkout");
    } finally { setLoading(null); }
  };

  return (
    <section id="pricing" className="py-28 surface-dark">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">Pricing</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-white">CHOOSE YOUR <span className="text-gradient-gold">CHALLENGE</span></h2>
          <p className="mt-4 text-white/60">Three tiers built for every level of trader. One transparent rulebook.</p>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-6 items-stretch">
          {TIERS.map(t => (
            <div key={t.id} className={`relative rounded-3xl p-8 flex flex-col ${t.popular ? "bg-gradient-to-b from-gold/15 to-transparent border-2 border-gold shadow-gold-strong scale-[1.02]" : "glass-gold"}`}>
              {t.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-gold text-black px-4 py-1.5 text-xs font-black tracking-wider uppercase shadow-gold">
                  <Crown className="h-3.5 w-3.5" /> Most Popular
                </div>
              )}
              <div className="text-white">
                <h3 className="text-2xl font-black uppercase tracking-wide">{t.name}</h3>
                <p className="text-white/60 text-sm mt-1">{t.tagline}</p>

                <div className="mt-6 space-y-2">
                  {t.sizes.map(s => (
                    <div key={s.size} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                      <span className="font-semibold text-white">{formatUSD(s.size)}</span>
                      <span className="text-gold font-bold">{formatUSD(s.fee)}</span>
                    </div>
                  ))}
                </div>

                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    `Profit Target: ${t.profitTargetP1}% / ${t.profitTargetP2}% (Phase 1 / 2)`,
                    `Max Daily Loss: ${t.maxDailyLoss}%`,
                    `Max Total Loss: ${t.maxTotalLoss}%`,
                    `Min Trading Days: ${t.minTradingDays}`,
                    `Leverage: ${t.leverage}`,
                    `Profit Split: ${t.profitSplit}%`,
                    "MT4/5, Binance, Bybit, BingX",
                  ].map(line => (
                    <li key={line} className="flex items-start gap-2.5 text-white/80">
                      <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" /> <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 space-y-2">
                {t.sizes.map(s => (
                  <Button key={s.size} disabled={loading === `${t.id}-${s.size}`} onClick={() => handleBuy(t.id, s.size)}
                    className={`w-full font-bold ${t.popular ? "bg-gradient-gold text-black hover:opacity-95 shadow-gold" : "bg-white/10 text-white border border-gold/40 hover:bg-gold/15"}`}>
                    {loading === `${t.id}-${s.size}` ? "Loading…" : `Get Started — ${formatUSD(s.size)}`}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
