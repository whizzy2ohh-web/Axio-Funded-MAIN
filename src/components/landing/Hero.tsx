import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ParticleField } from "./ParticleField";

export const Hero = () => (
  <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-hero text-white pt-16">
    <ParticleField />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(201,168,76,0.15),_transparent_70%)]" />
    <div className="container mx-auto relative z-10 py-20">
      <div className="max-w-4xl mx-auto text-center animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-gold uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          Now funding traders globally
        </span>
        <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
          <span className="text-white">TRADE.</span>{" "}
          <span className="text-gradient-gold">GROW.</span>{" "}
          <span className="text-white">GET FUNDED.</span>
        </h1>
        <p className="mt-7 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          Join the next generation of funded traders. Prove your skill, get funded up to $100,000, and keep 90% of your profits.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-gold text-black hover:opacity-95 font-bold text-base px-8 h-14 shadow-gold-strong">
            <Link to="/signup">Start Your Challenge <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-gold/60 text-gold hover:bg-gold/10 font-semibold text-base px-8 h-14 bg-transparent">
            <a href="#pricing">View Pricing</a>
          </Button>
        </div>
      </div>

      <div className="mt-20 mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/15 rounded-2xl overflow-hidden glass-gold">
          {[
            { v: "90%", l: "Profit Split" },
            { v: "$100K", l: "Max Funding" },
            { v: "5+", l: "Platforms Supported" },
            { v: "3", l: "Challenge Tiers" },
          ].map(s => (
            <div key={s.l} className="bg-[hsl(0_0%_4%)] p-6 text-center">
              <div className="text-3xl md:text-4xl font-black text-gradient-gold">{s.v}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-white/60">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 overflow-hidden">
          <div className="marquee flex gap-12 text-white/40 text-sm whitespace-nowrap">
            {[..."MetaTrader 4 · MetaTrader 5 · Binance · Bybit · BingX · MetaTrader 4 · MetaTrader 5 · Binance · Bybit · BingX · ".split(" · ")].map((t, i) => (
              <span key={i} className="tracking-widest uppercase">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
    <a href="#how" aria-label="Scroll" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gold animate-bounce">
      <ChevronDown className="h-6 w-6" />
    </a>
  </section>
);
