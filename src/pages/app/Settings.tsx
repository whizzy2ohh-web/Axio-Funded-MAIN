import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data));
  }, [user]);

  const save = async () => {
    if (!user || !profile) return;
    const { error } = await supabase.from("profiles").update({ full_name: profile.full_name, country: profile.country }).eq("id", user.id);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-3xl font-black">Settings</h1><p className="text-white/60 mt-1">Manage your profile and account preferences.</p></div>
      <div className="rounded-2xl bg-card text-card-foreground border border-border p-6 space-y-4">
        <div><Label>Email</Label><Input value={user?.email || ""} disabled className="mt-1.5" /></div>
        <div><Label>Full name</Label><Input value={profile?.full_name || ""} onChange={e => setProfile({ ...profile, full_name: e.target.value })} className="mt-1.5" /></div>
        <div><Label>Country</Label><Input value={profile?.country || ""} onChange={e => setProfile({ ...profile, country: e.target.value })} className="mt-1.5" /></div>
        <Button onClick={save} className="bg-gradient-gold text-black font-bold">Save changes</Button>
      </div>
    </div>
  );
};
export default Settings;
