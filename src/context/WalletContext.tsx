import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { allCoins } from "@/data/coins";
import { LicenseData, calculateExpiration, isLicenseExpired, getDaysUntilExpiry } from "@/lib/utils";

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
  type: "send" | "receive" | "swap" | "buy";
  fromToken?: string;
  toToken?: string;
  amount: number;
  value: number;
  timestamp: number;
  address?: string;
}

interface UserAccount {
  username: string;
  password: string;
  tokens: Token[];
  transactions: Transaction[];
  currency: string;
}

interface WalletState {
    // === LICENSE FIELDS (NEW) ===
  license: LicenseData | null;
  setLicense: (license: LicenseData | null) => void;
  isLicenseValid: boolean;
  daysUntilExpiry: number | null;
  // === END LICENSE FIELDS ===
  username: string;
  setUsername: (name: string) => void;
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  totalBalance: number;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
  swapTokens: (fromSymbol: string, toSymbol: string, fromAmount: number) => void;
  sellToken: (symbol: string, tokenAmount: number) => void;
  sendToUser: (toUsername: string, symbol: string, amount: number) => { success: boolean; error?: string };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  exploreBuySymbol: string;
  setExploreBuySymbol: (s: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
  logout: () => void;
}

const defaultTokens: Token[] = allCoins.map(coin => ({
  symbol: coin.symbol,
  name: coin.name,
  balance: 0,
  priceUsd: coin.price,
  change: coin.change,
  logo: coin.logo,
}));

function getAccounts(): Record<string, UserAccount> {
  const raw = localStorage.getItem("phantom_accounts");
  return raw ? JSON.parse(raw) : {};
}

function saveAccount(account: UserAccount) {
  const accounts = getAccounts();
  accounts[account.username.toLowerCase()] = account;
  localStorage.setItem("phantom_accounts", JSON.stringify(accounts));
}

const WalletContext = createContext<WalletState | null>(null);

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};

export const signUp = (username: string, password: string): { success: boolean; error?: string } => {
  const accounts = getAccounts();
  const key = username.toLowerCase();
  if (accounts[key]) return { success: false, error: "Username already taken" };
  const account: UserAccount = {
    username,
    password,
    tokens: defaultTokens.map(t => ({ ...t })),
    transactions: [],
    currency: "USD",
  };
  saveAccount(account);
  return { success: true };
};

export const signIn = (username: string, password: string): { success: boolean; error?: string } => {
  const accounts = getAccounts();
  const account = accounts[username.toLowerCase()];
  if (!account) return { success: false, error: "User not found" };
  if (account.password !== password) return { success: false, error: "Incorrect password" };
  return { success: true };
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    // === LICENSE STATE (NEW) ===
  const [license, setLicenseState] = useState<LicenseData | null>(() => {
    const raw = localStorage.getItem("voidlarp_license");
    return raw ? JSON.parse(raw) : null;
  });

  const setLicense = (license: LicenseData | null) => {
    setLicenseState(license);
    if (license) {
      localStorage.setItem("voidlarp_license", JSON.stringify(license));
    } else {
      localStorage.removeItem("voidlarp_license");
    }
  };

  const isLicenseValid = !license || !isLicenseExpired(license.expirationDate);
  const daysUntilExpiry = license ? getDaysUntilExpiry(license.expirationDate) : null;
  // === END LICENSE STATE ===
  const [username, setUsernameState] = useState(() => localStorage.getItem("phantom_current_user") || "");
  const [hasOnboarded, setHasOnboardedState] = useState(() => !!localStorage.getItem("phantom_current_user"));
  const [activeTab, setActiveTab] = useState("wallet");
  const [exploreBuySymbol, setExploreBuySymbol] = useState("");

  const loadAccount = (): UserAccount | null => {
    if (!username) return null;
    const accounts = getAccounts();
    return accounts[username.toLowerCase()] || null;
  };

  const [tokens, setTokens] = useState<Token[]>(() => loadAccount()?.tokens || defaultTokens.map(t => ({ ...t })));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadAccount()?.transactions || []);
  const [currency, setCurrencyState] = useState(() => loadAccount()?.currency || "USD");

  const setUsername = (name: string) => {
    setUsernameState(name);
    localStorage.setItem("phantom_current_user", name);
    const accounts = getAccounts();
    const account = accounts[name.toLowerCase()];
    if (account) {
      setTokens(account.tokens);
      setTransactions(account.transactions);
      setCurrencyState(account.currency || "USD");
    }
  };

  const setHasOnboarded = (v: boolean) => {
    setHasOnboardedState(v);
    if (!v) localStorage.removeItem("phantom_current_user");
  };

  const setCurrency = (c: string) => {
    setCurrencyState(c);
  };

  useEffect(() => {
    if (!username) return;
    const accounts = getAccounts();
    const account = accounts[username.toLowerCase()];
    if (account) {
      account.tokens = tokens;
      account.transactions = transactions;
      account.currency = currency;
      saveAccount(account);
    }
  }, [tokens, transactions, username, currency]);

  const totalBalance = tokens.reduce((sum, t) => sum + t.balance * t.priceUsd, 0);

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

  const sellToken = (symbol: string, tokenAmount: number) => {
    const token = tokens.find(t => t.symbol === symbol);
    if (!token || token.balance < tokenAmount) return;
    const usdValue = tokenAmount * token.priceUsd;
    setTokens(prev => prev.map(t =>
      t.symbol === symbol ? { ...t, balance: t.balance - tokenAmount } : t
    ));
    addTransaction({ type: "swap", fromToken: symbol, toToken: "USD", amount: tokenAmount, value: usdValue });
  };

  const sendToUser = (toUsername: string, symbol: string, amount: number): { success: boolean; error?: string } => {
    const accounts = getAccounts();
    const recipient = accounts[toUsername.toLowerCase()];
    if (!recipient) return { success: false, error: "User not found" };
    if (toUsername.toLowerCase() === username.toLowerCase()) return { success: false, error: "Cannot send to yourself" };

    const senderToken = tokens.find(t => t.symbol === symbol);
    if (!senderToken || senderToken.balance < amount) return { success: false, error: "Insufficient balance" };
    const usdValue = amount * senderToken.priceUsd;
    setTokens(prev => prev.map(t =>
      t.symbol === symbol ? { ...t, balance: t.balance - amount } : t
    ));
    const recipientToken = recipient.tokens.find((t: Token) => t.symbol === symbol);
    if (recipientToken) recipientToken.balance += amount;
    recipient.transactions = [{
      id: Math.random().toString(36).slice(2), timestamp: Date.now(),
      type: "receive", toToken: symbol, amount, value: usdValue, address: username,
    }, ...recipient.transactions];
    saveAccount(recipient);
    addTransaction({ type: "send", fromToken: symbol, amount, value: usdValue, address: toUsername });
    return { success: true };
  };

  const logout = () => {
    setHasOnboarded(false);
    setUsernameState("");
    setTokens(defaultTokens.map(t => ({ ...t })));
    setTransactions([]);
    setActiveTab("wallet");
    setCurrencyState("USD");
    localStorage.removeItem("phantom_current_user");
  };

  return (
    <WalletContext.Provider value={{
      username, setUsername, hasOnboarded, setHasOnboarded,
      tokens, setTokens, totalBalance,
      transactions, addTransaction, swapTokens, sellToken, sendToUser,
      activeTab, setActiveTab, exploreBuySymbol, setExploreBuySymbol,
      currency, setCurrency, logout,
    }}>
      {children}
    </WalletContext.Provider>
  );
};
