import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth-context";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#how", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#leaderboard", label: "Leaderboard" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[hsl(0_0%_4%/0.85)] backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center"><Logo dark /></Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-white/70 hover:text-gold transition-colors">{l.label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button onClick={() => nav("/app")} className="bg-gradient-gold text-black hover:opacity-90 font-semibold">Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5" onClick={() => nav("/login")}>Log in</Button>
              <Button onClick={() => nav("/signup")} className="bg-gradient-gold text-black hover:opacity-90 font-semibold shadow-gold">Get Funded</Button>
            </>
          )}
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[hsl(0_0%_4%)] px-6 py-4 flex flex-col gap-3">
          {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-white/80 py-2">{l.label}</a>)}
          {user ? (
            <Button onClick={() => { setOpen(false); nav("/app"); }} className="bg-gradient-gold text-black font-semibold">Dashboard</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => { setOpen(false); nav("/login"); }} className="border-gold text-gold">Log in</Button>
              <Button onClick={() => { setOpen(false); nav("/signup"); }} className="bg-gradient-gold text-black font-semibold">Get Funded</Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
