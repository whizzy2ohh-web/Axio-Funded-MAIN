import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.105.1/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return new Response(JSON.stringify({
    error: "Stripe checkout is not yet enabled. Please configure Lovable Payments to enable purchases."
  }), { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
