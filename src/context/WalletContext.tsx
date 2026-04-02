import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { allCoins } from "@/data/coins";
import { isExpired, getDaysRemaining, getPlanLabel } from "@/lib/license";
import { toast } from "sonner";

interface Token {
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  change: number;
  logo: string;
}

interface Transaction {
  id: string;
  type: "send" | "receive" | "swap" | "buy";
  fromToken?: string;
  toToken?: string;
  amount: number;
  value: number;
  timestamp: number;
  address?: string;
}

export interface StoredLicense {
  key: string;
  planType: "7days" | "1month" | "lifetime";
  activationDate: string;
  expirationDate: string | null;
}

interface WalletContextType {
  tokens: Token[];
  transactions: Transaction[];
  totalBalance: number;
  hasOnboarded: boolean;
  activeTab: string;
  currency: string;
  username: string;
  license: StoredLicense | null;
  isLicenseExpired: boolean;
  daysUntilExpiry: number | null;
  setActiveTab: (tab: string) => void;
  completeOnboarding: () => void;
  setCurrency: (c: string) => void;
  setUsername: (u: string) => void;
  setLicenseData: (data: StoredLicense) => void;
  clearLicense: () => void;
  logout: () => void;
  buyToken: (symbol: string, amountUsd: number) => void;
  sellToken: (symbol: string, amountUsd: number) => void;
  sendToken: (symbol: string, amount: number, address: string) => void;
  sendToUser: (recipient: string, symbol: string, amount: number) => { success: boolean; error?: string };
  swapTokens: (from: string, to: string, amount: number) => void;
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
  setExploreBuySymbol: (s: string) => void;
  exploreBuySymbol: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [hasOnboarded, setHasOnboarded] = useState(() => localStorage.getItem("voidlarp_onboarded") === "true");
  const [activeTab, setActiveTab] = useState("home");
  const [currency, setCurrencyState] = useState(() => localStorage.getItem("voidlarp_currency") || "USD");
  const [username, setUsernameState] = useState(() => localStorage.getItem("voidlarp_username") || "User");
  const [exploreBuySymbol, setExploreBuySymbol] = useState("");
  const [license, setLicense] = useState<StoredLicense | null>(() => {
    const stored = localStorage.getItem("voidlarp_license");
    return stored ? JSON.parse(stored) : null;
  });
  const [tokens, setTokens] = useState<Token[]>(() => {
    const stored = localStorage.getItem("voidlarp_tokens");
    if (stored) return JSON.parse(stored);
    return allCoins.map((c) => ({ symbol: c.symbol, name: c.name, balance: 0, priceUsd: c.price, change: c.change, logo: c.logo }));
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem("voidlarp_transactions");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => { localStorage.setItem("voidlarp_tokens", JSON.stringify(tokens)); }, [tokens]);
  useEffect(() => { localStorage.setItem("voidlarp_transactions", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { if (license) localStorage.setItem("voidlarp_license", JSON.stringify(license)); }, [license]);
  useEffect(() => { localStorage.setItem("voidlarp_currency", currency); }, [currency]);
  useEffect(() => { localStorage.setItem("voidlarp_username", username); }, [username]);

  const isLicenseExpired = license ? isExpired(license.expirationDate) : false;
  const daysUntilExpiry = license ? getDaysRemaining(license.expirationDate) : null;
  const totalBalance = tokens.reduce((sum, t) => sum + t.balance * t.priceUsd, 0);

  const completeOnboarding = () => { setHasOnboarded(true); localStorage.setItem("voidlarp_onboarded", "true"); };
  const setCurrency = (c: string) => setCurrencyState(c);
  const setUsername = (u: string) => setUsernameState(u);

  const setLicenseData = (data: StoredLicense) => {
    setLicense(data);
    toast.success(`License activated: ${getPlanLabel(data.planType)}`);
  };

  const clearLicense = () => {
    setLicense(null);
    localStorage.removeItem("voidlarp_license");
    localStorage.removeItem("voidlarp_onboarded");
    localStorage.removeItem("voidlarp_tokens");
    localStorage.removeItem("voidlarp_transactions");
    localStorage.removeItem("voidlarp_username");
    setHasOnboarded(false);
    setTokens(allCoins.map((c) => ({ symbol: c.symbol, name: c.name, balance: 0, priceUsd: c.price, change: c.change, logo: c.logo })));
    setTransactions([]);
  };

  const logout = () => {
    localStorage.removeItem("voidlarp_onboarded");
    localStorage.removeItem("voidlarp_username");
    setHasOnboarded(false);
    setUsernameState("User");
    toast.success("Logged out");
  };

  const addTransaction = (tx: Omit<Transaction, "id" | "timestamp">) => {
    const newTx: Transaction = { ...tx, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const buyToken = (symbol: string, amountUsd: number) => {
    setTokens((prev) => prev.map((t) => {
      if (t.symbol === symbol) return { ...t, balance: t.balance + amountUsd / t.priceUsd };
      return t;
    }));
    addTransaction({ type: "buy", toToken: symbol, amount: amountUsd, value: amountUsd });
    toast.success(`Bought $${amountUsd.toFixed(2)} of ${symbol}`);
  };

  const sellToken = (symbol: string, amountUsd: number) => {
    setTokens((prev) => prev.map((t) => {
      if (t.symbol === symbol) return { ...t, balance: Math.max(0, t.balance - amountUsd / t.priceUsd) };
      return t;
    }));
    addTransaction({ type: "send", fromToken: symbol, amount: amountUsd, value: amountUsd });
    toast.success(`Sold $${amountUsd.toFixed(2)} of ${symbol}`);
  };

  const sendToken = (symbol: string, amount: number, address: string) => {
    const token = tokens.find((t) => t.symbol === symbol);
    if (!token || token.balance < amount) { toast.error("Insufficient balance"); return; }
    setTokens((prev) => prev.map((t) => t.symbol === symbol ? { ...t, balance: t.balance - amount } : t));
    addTransaction({ type: "send", fromToken: symbol, amount, value: amount * (token?.priceUsd || 0), address });
    toast.success(`Sent ${amount} ${symbol}`);
  };

  const sendToUser = (recipient: string, symbol: string, amount: number) => {
    const token = tokens.find((t) => t.symbol === symbol);
    if (!token || token.balance < amount) return { success: false, error: "Insufficient balance" };
    setTokens((prev) => prev.map((t) => t.symbol === symbol ? { ...t, balance: t.balance - amount } : t));
    addTransaction({ type: "send", fromToken: symbol, amount, value: amount * (token?.priceUsd || 0), address: `@${recipient}` });
    toast.success(`Sent ${amount} ${symbol} to @${recipient}`);
    return { success: true };
  };

  const swapTokens = (from: string, to: string, amount: number) => {
    const fromToken = tokens.find((t) => t.symbol === from);
    const toToken = tokens.find((t) => t.symbol === to);
    if (!fromToken || !toToken || fromToken.balance < amount) { toast.error("Insufficient balance"); return; }
    const usdValue = amount * fromToken.priceUsd;
    const toAmount = usdValue / toToken.priceUsd;
    setTokens((prev) => prev.map((t) => {
      if (t.symbol === from) return { ...t, balance: t.balance - amount };
      if (t.symbol === to) return { ...t, balance: t.balance + toAmount };
      return t;
    }));
    addTransaction({ type: "swap", fromToken: from, toToken: to, amount, value: usdValue });
    toast.success(`Swapped ${amount} ${from} → ${toAmount.toFixed(6)} ${to}`);
  };

  return (
    <WalletContext.Provider value={{
      tokens, transactions, totalBalance, hasOnboarded, activeTab, currency, username,
      license, isLicenseExpired, daysUntilExpiry, setActiveTab, completeOnboarding,
      setCurrency, setUsername, setLicenseData, clearLicense, logout, buyToken, sellToken,
      sendToken, sendToUser, swapTokens, setTokens, addTransaction, setExploreBuySymbol, exploreBuySymbol,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
