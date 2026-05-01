import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plug, Plus } from "lucide-react";
import { formatUSD } from "@/lib/tiers";

const PLATFORM_LABELS: Record<string, string> = { mt4: "MetaTrader 4", mt5: "MetaTrader 5", binance: "Binance", bybit: "Bybit", bingx: "BingX" };

const statusBadge = (s: string) => s === "active"
  ? "bg-success/15 text-success" : s === "passed" ? "bg-gold/15 text-gold" : "bg-destructive/15 text-destructive";

const Accounts = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<string | null>(null);
  const [platform, setPlatform] = useState<"mt4" | "mt5" | "binance" | "bybit" | "bingx">("mt5");
  const [form, setForm] = useState({ server: "", login: "", password: "", apiKey: "", apiSecret: "" });

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("challenges").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const submit = async () => {
    if (!user || !target) return;
    const isMt = platform === "mt4" || platform === "mt5";
    if (isMt && (!form.server || !form.login || !form.password)) { toast.error("Fill all MetaTrader fields"); return; }
    if (!isMt && (!form.apiKey || !form.apiSecret)) { toast.error("Fill API key & secret"); return; }
    const { error } = await supabase.from("account_credentials").insert({
      user_id: user.id, challenge_id: target, platform,
      server: isMt ? form.server : null, login_id: isMt ? form.login : null,
      password_secret: isMt ? form.password : null,
      api_key_secret: !isMt ? form.apiKey : null, api_secret_secret: !isMt ? form.apiSecret : null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Account connected successfully");
    setOpen(false); setForm({ server: "", login: "", password: "", apiKey: "", apiSecret: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">My Challenge Accounts</h1>
          <p className="text-white/60 mt-1">Manage your active and funded trading accounts.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.map(r => (
          <div key={r.id} className="rounded-2xl bg-card text-card-foreground border border-border p-5 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{r.id.slice(0, 8)}</div>
                <div className="text-2xl font-black mt-1">{formatUSD(Number(r.account_size))}</div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${statusBadge(r.status)}`}>{r.status}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div><div className="text-xs text-muted-foreground">Tier</div><div className="font-semibold capitalize">{r.tier}</div></div>
              <div><div className="text-xs text-muted-foreground">Phase</div><div className="font-semibold">{r.phase.replace("_", " ")}</div></div>
              <div><div className="text-xs text-muted-foreground">Profit</div><div className="font-bold text-success">+{r.profit_pct}%</div></div>
              <div><div className="text-xs text-muted-foreground">Drawdown</div><div className={`font-bold ${r.drawdown_pct > 4 ? "text-destructive" : r.drawdown_pct > 2.5 ? "text-warning" : "text-success"}`}>{r.drawdown_pct}%</div></div>
            </div>
            <Dialog open={open && target === r.id} onOpenChange={v => { setOpen(v); if (v) setTarget(r.id); }}>
              <DialogTrigger asChild>
                <Button onClick={() => { setTarget(r.id); setOpen(true); }} className="mt-5 w-full bg-gradient-gold text-black font-semibold"><Plug className="h-4 w-4 mr-1.5" /> Connect Account</Button>
              </DialogTrigger>
              <DialogContent className="bg-card text-card-foreground">
                <DialogHeader><DialogTitle>Connect trading platform</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={v => setPlatform(v as any)}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(PLATFORM_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {(platform === "mt4" || platform === "mt5") ? (
                    <>
                      <div><Label>Server</Label><Input value={form.server} onChange={e => setForm({ ...form, server: e.target.value })} placeholder="e.g. AxioFunded-Live01" className="mt-1.5" /></div>
                      <div><Label>Login ID</Label><Input value={form.login} onChange={e => setForm({ ...form, login: e.target.value })} className="mt-1.5" /></div>
                      <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="mt-1.5" /></div>
                    </>
                  ) : (
                    <>
                      <div><Label>API Key</Label><Input value={form.apiKey} onChange={e => setForm({ ...form, apiKey: e.target.value })} className="mt-1.5" /></div>
                      <div><Label>API Secret</Label><Input type="password" value={form.apiSecret} onChange={e => setForm({ ...form, apiSecret: e.target.value })} className="mt-1.5" /></div>
                    </>
                  )}
                  <Button onClick={submit} className="w-full bg-gradient-gold text-black font-bold">Connect</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
        {rows.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-white/60">
          <Plus className="h-8 w-8 mx-auto text-gold mb-3" /> No challenges yet. Visit the home page to start one.
        </div>}
      </div>
    </div>
  );
};
export default Accounts;
