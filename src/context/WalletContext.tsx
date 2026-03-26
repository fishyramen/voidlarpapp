import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Token {
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  change: number;
  logo: string;
}

export interface Transaction {
  id: string;
  type: "send" | "receive" | "swap";
  fromToken?: string;
  toToken?: string;
  amount: number;
  value: number;
  timestamp: number;
  address?: string;
}

interface WalletState {
  username: string;
  setUsername: (name: string) => void;
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  totalBalance: number;
  cashBalance: number;
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
  swapTokens: (fromSymbol: string, toSymbol: string, fromAmount: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const defaultTokens: Token[] = [
  { symbol: "SOL", name: "Solana", balance: 30.41, priceUsd: 135.30, change: 5.61, logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" },
  { symbol: "ETH", name: "Ethereum", balance: 0.7932, priceUsd: 3714.50, change: -2.10, logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { symbol: "BTC", name: "Bitcoin", balance: 0.02093, priceUsd: 101900.00, change: 1.05, logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { symbol: "USDC", name: "USD Coin", balance: 1250.00, priceUsd: 1.00, change: 0.01, logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png" },
  { symbol: "BONK", name: "Bonk", balance: 24500000, priceUsd: 0.000025, change: -1.23, logo: "https://assets.coingecko.com/coins/images/28600/small/bonk.jpg" },
  { symbol: "RAY", name: "Raydium", balance: 45.20, priceUsd: 3.60, change: 5.67, logo: "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg" },
  { symbol: "JTO", name: "Jito", balance: 32.00, priceUsd: 3.13, change: -0.45, logo: "https://assets.coingecko.com/coins/images/33228/small/jto.png" },
];

const WalletContext = createContext<WalletState | null>(null);

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsernameState] = useState(() => localStorage.getItem("phantom_username") || "");
  const [hasOnboarded, setHasOnboardedState] = useState(() => localStorage.getItem("phantom_onboarded") === "true");
  const [activeTab, setActiveTab] = useState("wallet");
  const [cashBalance, setCashBalance] = useState(() => {
    const saved = localStorage.getItem("phantom_cash");
    return saved ? parseFloat(saved) : 0;
  });
  const [tokens, setTokens] = useState<Token[]>(() => {
    const saved = localStorage.getItem("phantom_tokens");
    return saved ? JSON.parse(saved) : defaultTokens;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("phantom_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const setUsername = (name: string) => {
    setUsernameState(name);
    localStorage.setItem("phantom_username", name);
  };

  const setHasOnboarded = (v: boolean) => {
    setHasOnboardedState(v);
    localStorage.setItem("phantom_onboarded", String(v));
  };

  useEffect(() => { localStorage.setItem("phantom_tokens", JSON.stringify(tokens)); }, [tokens]);
  useEffect(() => { localStorage.setItem("phantom_transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("phantom_cash", String(cashBalance)); }, [cashBalance]);

  const totalBalance = tokens.reduce((sum, t) => sum + t.balance * t.priceUsd, 0) + cashBalance;

  const addTransaction = (tx: Omit<Transaction, "id" | "timestamp">) => {
    setTransactions(prev => [{
      ...tx,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    }, ...prev]);
  };

  const swapTokens = (fromSymbol: string, toSymbol: string, fromAmount: number) => {
    const fromToken = tokens.find(t => t.symbol === fromSymbol);
    const toToken = tokens.find(t => t.symbol === toSymbol);
    if (!fromToken || !toToken || fromToken.balance < fromAmount) return;

    const usdValue = fromAmount * fromToken.priceUsd;
    const toAmount = usdValue / toToken.priceUsd;

    setTokens(prev => prev.map(t => {
      if (t.symbol === fromSymbol) return { ...t, balance: t.balance - fromAmount };
      if (t.symbol === toSymbol) return { ...t, balance: t.balance + toAmount };
      return t;
    }));

    addTransaction({ type: "swap", fromToken: fromSymbol, toToken: toSymbol, amount: fromAmount, value: usdValue });
  };

  return (
    <WalletContext.Provider value={{
      username, setUsername, hasOnboarded, setHasOnboarded,
      tokens, setTokens, totalBalance, cashBalance, setCashBalance,
      transactions, addTransaction, swapTokens, activeTab, setActiveTab,
    }}>
      {children}
    </WalletContext.Provider>
  );
};
