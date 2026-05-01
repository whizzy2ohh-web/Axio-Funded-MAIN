import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/landing/Logo";
import { toast } from "sonner";

const ResetPassword = () => {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Min 8 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    nav("/login");
  };
  return (
    <div className="min-h-screen surface-dark flex items-center justify-center px-4 bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo dark /></div>
        <div className="rounded-2xl glass-gold p-8">
          <h1 className="text-2xl font-black text-white">Set a new password</h1>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label className="text-white/80">New password</Label><Input type="password" value={pw} onChange={e => setPw(e.target.value)} className="bg-black/40 border-white/10 text-white mt-1.5" required /></div>
            <Button disabled={loading} className="w-full bg-gradient-gold text-black font-bold h-11 shadow-gold">{loading ? "Updating…" : "Update password"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
