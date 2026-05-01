import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/landing/Logo";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back");
    nav("/app");
  };

  const reset = async () => {
    if (!email) { toast.error("Enter your email first"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message); else toast.success("Reset email sent");
  };

  return (
    <div className="min-h-screen surface-dark flex items-center justify-center px-4 bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><Link to="/"><Logo dark /></Link></div>
        <div className="rounded-2xl glass-gold p-8">
          <h1 className="text-2xl font-black text-white">Welcome back</h1>
          <p className="text-white/60 text-sm mt-1">Log in to your trader dashboard</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label className="text-white/80">Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-black/40 border-white/10 text-white mt-1.5" required />
            </div>
            <div>
              <div className="flex justify-between items-baseline">
                <Label className="text-white/80">Password</Label>
                <button type="button" onClick={reset} className="text-xs text-gold hover:underline">Forgot password?</button>
              </div>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-black/40 border-white/10 text-white mt-1.5" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-gold text-black font-bold h-11 shadow-gold">
              {loading ? "Signing in…" : "Login"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-white/60">
            New here? <Link to="/signup" className="text-gold font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
