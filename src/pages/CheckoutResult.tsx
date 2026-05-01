import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { Logo } from "@/components/landing/Logo";

const CheckoutResult = ({ kind }: { kind: "success" | "cancel" }) => {
  const [params] = useSearchParams();
  return (
    <div className="min-h-screen surface-dark bg-gradient-hero flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center rounded-2xl glass-gold p-10">
        <Logo dark className="justify-center mb-6" />
        {kind === "success" ? (
          <><CheckCircle2 className="h-14 w-14 mx-auto text-success" />
          <h1 className="mt-6 text-2xl font-black text-white">Payment received</h1>
          <p className="mt-2 text-white/60">Your challenge account is being provisioned. It will appear in your dashboard shortly.</p></>
        ) : (
          <><XCircle className="h-14 w-14 mx-auto text-destructive" />
          <h1 className="mt-6 text-2xl font-black text-white">Checkout cancelled</h1>
          <p className="mt-2 text-white/60">No payment was processed. You can pick a tier any time from your dashboard.</p></>
        )}
        <Button asChild className="mt-8 w-full bg-gradient-gold text-black font-bold"><Link to="/app">Go to dashboard</Link></Button>
      </div>
    </div>
  );
};
export default CheckoutResult;
