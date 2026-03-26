import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Token {
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  change: number;
  logo: string;
}

interface WalletState {
  username: string;
  setUsername: (name: string) => void;
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  totalBalance: number;
  addFunds: (amount: number) => void;
  removeFunds: (amount: number) => void;
}

const defaultTokens: Token[] = [
  { symbol: "SOL", name: "Solana", balance: 12.4821, priceUsd: 172.76, change: 3.42, logo: "https://cryptologos.cc/logos/solana-sol-logo.png?v=040" },
  { symbol: "ETH", name: "Ethereum", balance: 0.7932, priceUsd: 3714.50, change: -2.10, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040" },
  { symbol: "BTC", name: "Bitcoin", balance: 0.02093, priceUsd: 101900.00, change: 1.05, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" },
  { symbol: "USDC", name: "USD Coin", balance: 1250.00, priceUsd: 1.00, change: 0.01, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040" },
  { symbol: "BONK", name: "Bonk", balance: 24500000, priceUsd: 0.000025, change: -1.23, logo: "https://cryptologos.cc/logos/bonk1-bonk-logo.png?v=040" },
  { symbol: "RAY", name: "Raydium", balance: 45.20, priceUsd: 3.60, change: 5.67, logo: "https://cryptologos.cc/logos/raydium-ray-logo.png?v=040" },
  { symbol: "JTO", name: "Jito", balance: 32.00, priceUsd: 3.13, change: -0.45, logo: "https://cryptologos.cc/logos/jito-jto-logo.png?v=040" },
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
  const [tokens, setTokens] = useState<Token[]>(() => {
    const saved = localStorage.getItem("phantom_tokens");
    return saved ? JSON.parse(saved) : defaultTokens;
  });

  const setUsername = (name: string) => {
    setUsernameState(name);
    localStorage.setItem("phantom_username", name);
  };

  const setHasOnboarded = (v: boolean) => {
    setHasOnboardedState(v);
    localStorage.setItem("phantom_onboarded", String(v));
  };

  useEffect(() => {
    localStorage.setItem("phantom_tokens", JSON.stringify(tokens));
  }, [tokens]);

  const totalBalance = tokens.reduce((sum, t) => sum + t.balance * t.priceUsd, 0);

  const addFunds = (amount: number) => {
    // Add as SOL by default
    setTokens(prev => prev.map(t =>
      t.symbol === "SOL" ? { ...t, balance: t.balance + amount / t.priceUsd } : t
    ));
  };

  const removeFunds = (amount: number) => {
    setTokens(prev => prev.map(t =>
      t.symbol === "SOL" ? { ...t, balance: Math.max(0, t.balance - amount / t.priceUsd) } : t
    ));
  };

  return (
    <WalletContext.Provider value={{ username, setUsername, hasOnboarded, setHasOnboarded, tokens, setTokens, totalBalance, addFunds, removeFunds }}>
      {children}
    </WalletContext.Provider>
  );
};
