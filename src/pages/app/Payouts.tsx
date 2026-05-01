import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { formatUSD } from "@/lib/tiers";

const METHOD_LABELS: Record<string, string> = { bank: "Bank Transfer", usdt_trc20: "USDT (TRC20)", usdt_erc20: "USDT (ERC20)", btc: "Bitcoin" };
const STATUS_BADGE: Record<string, string> = { pending: "bg-warning/15 text-warning", approved: "bg-gold/15 text-gold", paid: "bg-success/15 text-success", rejected: "bg-destructive/15 text-destructive" };

const schema = z.object({
  challenge_id: z.string().uuid(),
  amount: z.number().positive().max(1_000_000),
  method: z.enum(["bank", "usdt_trc20", "usdt_erc20", "btc"]),
  destination: z.string().trim().min(4).max(200),
});

const Payouts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [accId, setAccId] = useState(""); const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>("usdt_trc20"); const [dest, setDest] = useState("");

  const load = async () => {
    if (!user) return;
    const [{ data: ch }, { data: po }] = await Promise.all([
      supabase.from("challenges").select("*").eq("user_id", user.id),
      supabase.from("payouts").select("*").eq("user_id", user.id).order("requested_at", { ascending: false }),
    ]);
    setAccounts(ch || []); setHistory(po || []);
    if (!accId && ch?.[0]) setAccId(ch[0].id);
  };
  useEffect(() => { load(); }, [user]);

  const balance = accounts.find(a => a.id === accId)?.available_balance ?? 0;

  const submit = async () => {
    if (!user) return;
    const parsed = schema.safeParse({ challenge_id: accId, amount: parseFloat(amount), method, destination: dest });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    if (parsed.data.amount > Number(balance)) { toast.error("Amount exceeds available balance"); return; }
    const { error } = await supabase.from("payouts").insert({ user_id: user.id, ...parsed.data });
    if (error) { toast.error(error.message); return; }
    toast.success("Payout request submitted");
    setAmount(""); setDest(""); load();
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">REQUEST A <span className="text-gradient-gold">PAYOUT</span></h1><p className="text-white/60 mt-1">Withdraw your earned profits in your preferred method.</p></div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card text-card-foreground border border-border p-6 space-y-4">
          <div>
            <Label>Account</Label>
            <Select value={accId} onValueChange={setAccId}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select account" /></SelectTrigger>
              <SelectContent>{accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.tier.toUpperCase()} · {formatUSD(Number(a.account_size))}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Available balance</Label>
            <div className="mt-1.5 rounded-md border border-border bg-muted/40 px-3 py-2 font-bold text-success">{formatUSD(Number(balance))}</div>
          </div>
          <div><Label>Amount to withdraw</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1.5" placeholder="0.00" /></div>
          <div>
            <Label>Withdrawal method</Label>
            <Select value={method} onValueChange={setMethod}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(METHOD_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>{method === "bank" ? "Bank account details" : "Wallet address"}</Label>
            <Input value={dest} onChange={e => setDest(e.target.value)} className="mt-1.5" placeholder={method === "bank" ? "IBAN / SWIFT / Account #" : "Wallet address"} />
          </div>
          <Button onClick={submit} className="w-full bg-gradient-gold text-black font-bold h-11 shadow-gold">Submit Request</Button>
        </div>

        <div className="rounded-2xl bg-card text-card-foreground border border-border p-6">
          <h3 className="font-bold text-lg mb-4">Payout history</h3>
          <div className="space-y-2">
            {history.map(p => (
              <div key={p.id} className="rounded-lg border border-border p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{formatUSD(Number(p.amount))}</div>
                  <div className="text-xs text-muted-foreground">{METHOD_LABELS[p.method]} · {new Date(p.requested_at).toLocaleDateString()}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${STATUS_BADGE[p.status]}`}>{p.status}</span>
              </div>
            ))}
            {history.length === 0 && <div className="text-center text-muted-foreground py-8">No payout requests yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Payouts;
