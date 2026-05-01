
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.challenge_tier AS ENUM ('starter', 'pro', 'elite');
CREATE TYPE public.challenge_phase AS ENUM ('phase_1', 'phase_2', 'funded');
CREATE TYPE public.challenge_status AS ENUM ('active', 'passed', 'breached');
CREATE TYPE public.trade_side AS ENUM ('buy', 'sell');
CREATE TYPE public.trade_status AS ENUM ('open', 'closed');
CREATE TYPE public.platform_kind AS ENUM ('mt4', 'mt5', 'binance', 'bybit', 'bingx');
CREATE TYPE public.payout_method AS ENUM ('bank', 'usdt_trc20', 'usdt_erc20', 'btc');
CREATE TYPE public.payout_status AS ENUM ('pending', 'approved', 'paid', 'rejected');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT,
  country TEXT,
  referral_code TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable by signed-in" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile + default role on new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, country, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    NEW.raw_user_meta_data->>'referral_code'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Challenges
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier public.challenge_tier NOT NULL,
  account_size NUMERIC(14,2) NOT NULL,
  phase public.challenge_phase NOT NULL DEFAULT 'phase_1',
  status public.challenge_status NOT NULL DEFAULT 'active',
  profit_pct NUMERIC(8,2) NOT NULL DEFAULT 0,
  drawdown_pct NUMERIC(8,2) NOT NULL DEFAULT 0,
  available_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER challenges_set_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Users read own challenges" ON public.challenges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own challenges" ON public.challenges FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own challenges" ON public.challenges FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own challenges" ON public.challenges FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Account credentials
CREATE TABLE public.account_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  platform public.platform_kind NOT NULL,
  server TEXT,
  login_id TEXT,
  password_secret TEXT,
  api_key_secret TEXT,
  api_secret_secret TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.account_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own credentials" ON public.account_credentials FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own credentials" ON public.account_credentials FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own credentials" ON public.account_credentials FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own credentials" ON public.account_credentials FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trades
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  symbol TEXT NOT NULL,
  side public.trade_side NOT NULL,
  lots NUMERIC(12,4) NOT NULL,
  entry_price NUMERIC(18,6) NOT NULL,
  exit_price NUMERIC(18,6),
  pnl NUMERIC(14,2) NOT NULL DEFAULT 0,
  status public.trade_status NOT NULL DEFAULT 'open',
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own trades" ON public.trades FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own trades" ON public.trades FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own trades" ON public.trades FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own trades" ON public.trades FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Payouts
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL,
  method public.payout_method NOT NULL,
  destination TEXT NOT NULL,
  status public.payout_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own payouts" ON public.payouts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payouts" ON public.payouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own payouts" ON public.payouts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
