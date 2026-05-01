import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "What platforms are supported?", a: "Axio Funded supports MetaTrader 4, MetaTrader 5, Binance, Bybit, and BingX. You can connect via API keys (crypto exchanges) or server / login credentials (MetaTrader)." },
  { q: "How do payouts work?", a: "Once you receive your funded account, profits are split 90/10 in your favor. Starter and Pro accounts pay out bi-weekly; Elite accounts qualify for weekly payouts. Withdrawals are available via bank transfer, USDT (TRC20/ERC20), and BTC." },
  { q: "Can I trade crypto?", a: "Yes. You can trade major spot and perpetual pairs on Binance, Bybit, and BingX, in addition to FX, indices, and metals on MetaTrader." },
  { q: "What happens if I fail the challenge?", a: "If you breach the daily or total drawdown rules your challenge ends. You can retake it at a discounted reset fee or sign up for a new challenge at any time." },
  { q: "How long does evaluation take?", a: "There's no maximum time limit — only a 5 trading-day minimum per phase. Most traders pass Phase 1 within 2–4 weeks." },
];

export const FAQ = () => (
  <section id="faq" className="py-28 surface-dark">
    <div className="container mx-auto max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-gold font-semibold">FAQ</p>
        <h2 className="mt-3 text-4xl md:text-5xl font-black text-white">Questions, <span className="text-gradient-gold">answered</span></h2>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`f-${i}`} className="rounded-xl glass-gold border-gold/20 px-5 data-[state=open]:border-gold/50">
            <AccordionTrigger className="text-left text-white hover:text-gold py-5 font-semibold">{f.q}</AccordionTrigger>
            <AccordionContent className="text-white/70 pb-5">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
