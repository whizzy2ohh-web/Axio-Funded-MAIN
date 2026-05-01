import { Logo } from "./Logo";
import { Twitter, Send, Instagram, Youtube } from "lucide-react";

export const Footer = () => (
  <footer className="surface-dark border-t border-white/5">
    <div className="container mx-auto py-16">
      <div className="grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="mt-4 text-white/60 max-w-sm">Trade. Grow. Get Funded. The premium prop trading firm built for serious traders across forex, crypto, and indices.</p>
          <div className="mt-6 flex gap-3">
            {[Twitter, Send, Instagram, Youtube].map((I, i) => (
              <a key={i} href="#" className="h-10 w-10 rounded-full border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center text-white/60 transition-colors">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Product</div>
          <ul className="space-y-2 text-white/60 text-sm">
            <li><a href="#pricing" className="hover:text-gold">Pricing</a></li>
            <li><a href="#how" className="hover:text-gold">How it works</a></li>
            <li><a href="#leaderboard" className="hover:text-gold">Leaderboard</a></li>
            <li><a href="#faq" className="hover:text-gold">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-white/60 text-sm">
            <li><a href="#" className="hover:text-gold">About</a></li>
            <li><a href="#" className="hover:text-gold">Contact</a></li>
            <li><a href="#" className="hover:text-gold">Terms</a></li>
            <li><a href="#" className="hover:text-gold">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-sm text-white/40">
        <div>© 2025 Axio Funded. All rights reserved.</div>
        <div>Trading involves substantial risk. Past performance is not indicative of future results.</div>
      </div>
    </div>
  </footer>
);
