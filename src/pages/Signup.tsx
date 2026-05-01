import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/landing/Logo";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COUNTRIES = ["United States","United Kingdom","Canada","Germany","France","Spain","Italy","Netherlands","Switzerland","UAE","Saudi Arabia","India","Singapore","Australia","Japan","Brazil","Mexico","South Africa","Nigeria","Other"];

const schema = z.object({
  fullName: z.string().trim().min(2, "Full name required").max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  confirm: z.string(),
  country: z.string().min(1, "Select a country"),
  referral: z.string().max(50).optional(),
}).refine(d => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

const Signup = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "", country: "", referral: "" });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) { toast.error("You must accept the Terms"); return; }
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: { full_name: parsed.data.fullName, country: parsed.data.country, referral_code: parsed.data.referral || null },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created. Check your email to confirm.");
    nav("/login");
  };

  return (
    <div className="min-h-screen surface-dark flex items-center justify-center px-4 py-10 bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><Link to="/"><Logo dark /></Link></div>
        <div className="rounded-2xl glass-gold p-8">
          <h1 className="text-2xl font-black text-white">Create your trader account</h1>
          <p className="text-white/60 text-sm mt-1">Start your funded journey today</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label className="text-white/80">Full name</Label><Input value={form.fullName} onChange={e => set("fullName", e.target.value)} className="bg-black/40 border-white/10 text-white mt-1.5" required /></div>
            <div><Label className="text-white/80">Email</Label><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="bg-black/40 border-white/10 text-white mt-1.5" required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-white/80">Password</Label><Input type="password" value={form.password} onChange={e => set("password", e.target.value)} className="bg-black/40 border-white/10 text-white mt-1.5" required /></div>
              <div><Label className="text-white/80">Confirm</Label><Input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} className="bg-black/40 border-white/10 text-white mt-1.5" required /></div>
            </div>
            <div>
              <Label className="text-white/80">Country</Label>
              <Select value={form.country} onValueChange={v => set("country", v)}>
                <SelectTrigger className="bg-black/40 border-white/10 text-white mt-1.5"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-white/80">Referral code <span className="text-white/40">(optional)</span></Label><Input value={form.referral} onChange={e => set("referral", e.target.value)} className="bg-black/40 border-white/10 text-white mt-1.5" /></div>
            <label className="flex items-start gap-2 text-sm text-white/70">
              <Checkbox checked={agree} onCheckedChange={v => setAgree(!!v)} className="mt-0.5 border-white/30 data-[state=checked]:bg-gold data-[state=checked]:text-black" />
              <span>I agree to the <a href="#" className="text-gold hover:underline">Terms & Conditions</a></span>
            </label>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-gold text-black font-bold h-11 shadow-gold">{loading ? "Creating…" : "Create Account"}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-white/60">Already have an account? <Link to="/login" className="text-gold font-semibold hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Signup;
