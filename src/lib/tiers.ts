export type TierId = "starter" | "pro" | "elite";

export interface TierSize {
  size: number;
  fee: number;
}

export interface Tier {
  id: TierId;
  name: string;
  tagline: string;
  sizes: TierSize[];
  profitTargetP1: number;
  profitTargetP2: number;
  maxDailyLoss: number;
  maxTotalLoss: number;
  minTradingDays: number;
  leverage: string;
  profitSplit: number;
  popular?: boolean;
}

export const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Begin your funded journey",
    sizes: [
      { size: 5000, fee: 49 },
      { size: 10000, fee: 89 },
    ],
    profitTargetP1: 8,
    profitTargetP2: 5,
    maxDailyLoss: 4,
    maxTotalLoss: 8,
    minTradingDays: 5,
    leverage: "1:10",
    profitSplit: 90,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For serious, consistent traders",
    sizes: [
      { size: 25000, fee: 199 },
      { size: 50000, fee: 299 },
    ],
    profitTargetP1: 8,
    profitTargetP2: 5,
    maxDailyLoss: 5,
    maxTotalLoss: 10,
    minTradingDays: 5,
    leverage: "1:20",
    profitSplit: 90,
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Maximum capital, maximum reward",
    sizes: [
      { size: 100000, fee: 499 },
    ],
    profitTargetP1: 8,
    profitTargetP2: 5,
    maxDailyLoss: 5,
    maxTotalLoss: 10,
    minTradingDays: 5,
    leverage: "1:50",
    profitSplit: 90,
  },
];

export const getTier = (id: TierId) => TIERS.find(t => t.id === id)!;

export const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
