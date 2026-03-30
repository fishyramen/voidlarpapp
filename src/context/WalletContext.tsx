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
  cashBalance: number;
  transactions: Transaction[];
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
  buyToken: (symbol: string, usdAmount: number) => void;
  sellToken: (symbol: string, tokenAmount: number) => void;
  sendToUser: (toUsername: string, symbol: string, amount: number) => { success: boolean; error?: string };
  addToBalance: (amount: number) => void;
  removeFromBalance: (amount: number) => boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  exploreBuySymbol: string;
  setExploreBuySymbol: (s: string) => void;
  logout: () => void;
}

export const defaultTokens: Token[] = [
  { symbol: "SOL", name: "Solana", balance: 0, priceUsd: 135.30, change: 5.61, logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" },
  { symbol: "ETH", name: "Ethereum", balance: 0, priceUsd: 3714.50, change: -2.10, logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { symbol: "BTC", name: "Bitcoin", balance: 0, priceUsd: 101900.00, change: 1.05, logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { symbol: "USDC", name: "USD Coin", balance: 0, priceUsd: 1.00, change: 0.01, logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png" },
  { symbol: "BONK", name: "Bonk", balance: 0, priceUsd: 0.000025, change: -1.23, logo: "https://assets.coingecko.com/coins/images/28600/small/bonk.jpg" },
  { symbol: "RAY", name: "Raydium", balance: 0, priceUsd: 3.60, change: 5.67, logo: "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg" },
  { symbol: "JTO", name: "Jito", balance: 0, priceUsd: 3.13, change: -0.45, logo: "https://assets.coingecko.com/coins/images/33228/small/jto.png" },
];

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
    cashBalance: 0,
    transactions: [],
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
  const [username, setUsernameState] = useState(() => localStorage.getItem("phantom_current_user") || "");
  const [hasOnboarded, setHasOnboardedState] = useState(() => !!localStorage.getItem("phantom_current_user"));
  const [activeTab, setActiveTab] = useState("wallet");
  const [exploreBuySymbol, setExploreBuySymbol] = useState("");

  const loadAccount = (): UserAccount | null => {
    if (!username) return null;
    const accounts = getAccounts();
    return accounts[username.toLowerCase()] || null;
  };

  const [cashBalance, setCashBalance] = useState(() => loadAccount()?.cashBalance || 0);
  const [tokens, setTokens] = useState<Token[]>(() => loadAccount()?.tokens || defaultTokens.map(t => ({ ...t })));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadAccount()?.transactions || []);

  const setUsername = (name: string) => {
    setUsernameState(name);
    localStorage.setItem("phantom_current_user", name);
    const accounts = getAccounts();
    const account = accounts[name.toLowerCase()];
    if (account) {
      setTokens(account.tokens);
      setCashBalance(account.cashBalance);
      setTransactions(account.transactions);
    }
  };

  const setHasOnboarded = (v: boolean) => {
    setHasOnboardedState(v);
    if (!v) localStorage.removeItem("phantom_current_user");
  };

  useEffect(() => {
    if (!username) return;
    const accounts = getAccounts();
    const account = accounts[username.toLowerCase()];
    if (account) {
      account.tokens = tokens;
      account.cashBalance = cashBalance;
      account.transactions = transactions;
      saveAccount(account);
    }
  }, [tokens, cashBalance, transactions, username]);

  const totalBalance = tokens.reduce((sum, t) => sum + t.balance * t.priceUsd, 0) + cashBalance;

  const addTransaction = (tx: Omit<Transaction, "id" | "timestamp">) => {
    setTransactions(prev => [{
      ...tx,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    }, ...prev]);
  };

  const addToBalance = (amount: number) => {
    if (amount <= 0) return;
    setCashBalance(prev => prev + amount);
  };

  const removeFromBalance = (amount: number): boolean => {
    if (amount <= 0) return false;
    if (amount > totalBalance) return false;

    let remaining = amount;

    // First take from cash
    const cashTaken = Math.min(cashBalance, remaining);
    if (cashTaken > 0) {
      setCashBalance(prev => prev - cashTaken);
      remaining -= cashTaken;
    }

    // Then sell tokens proportionally
    if (remaining > 0) {
      const holdingsValue = tokens.reduce((sum, t) => sum + t.balance * t.priceUsd, 0);
      if (holdingsValue < remaining) return false;
      setTokens(prev => prev.map(t => {
        const tokenValue = t.balance * t.priceUsd;
        if (tokenValue <= 0) return t;
        const proportion = tokenValue / holdingsValue;
        const toSell = (remaining * proportion) / t.priceUsd;
        return { ...t, balance: Math.max(0, t.balance - toSell) };
      }));
    }
    return true;
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

  const buyToken = (symbol: string, usdAmount: number) => {
    if (usdAmount <= 0 || usdAmount > cashBalance) return;
    const token = tokens.find(t => t.symbol === symbol);
    if (!token) return;
    const tokenAmount = usdAmount / token.priceUsd;
    setCashBalance(prev => prev - usdAmount);
    setTokens(prev => prev.map(t =>
      t.symbol === symbol ? { ...t, balance: t.balance + tokenAmount } : t
    ));
    addTransaction({ type: "buy", toToken: symbol, amount: tokenAmount, value: usdAmount });
  };

  const sellToken = (symbol: string, tokenAmount: number) => {
    const token = tokens.find(t => t.symbol === symbol);
    if (!token || token.balance < tokenAmount) return;
    const usdValue = tokenAmount * token.priceUsd;
    setTokens(prev => prev.map(t =>
      t.symbol === symbol ? { ...t, balance: t.balance - tokenAmount } : t
    ));
    setCashBalance(prev => prev + usdValue);
    addTransaction({ type: "swap", fromToken: symbol, toToken: "CASH", amount: tokenAmount, value: usdValue });
  };

  const sendToUser = (toUsername: string, symbol: string, amount: number): { success: boolean; error?: string } => {
    const accounts = getAccounts();
    const recipient = accounts[toUsername.toLowerCase()];
    if (!recipient) return { success: false, error: "User not found" };
    if (toUsername.toLowerCase() === username.toLowerCase()) return { success: false, error: "Cannot send to yourself" };

    if (symbol === "CASH") {
      if (amount > cashBalance) return { success: false, error: "Insufficient balance" };
      setCashBalance(prev => prev - amount);
      recipient.cashBalance = (recipient.cashBalance || 0) + amount;
      recipient.transactions = [{
        id: Math.random().toString(36).slice(2), timestamp: Date.now(),
        type: "receive", toToken: "CASH", amount, value: amount, address: username,
      }, ...recipient.transactions];
      saveAccount(recipient);
      addTransaction({ type: "send", fromToken: "CASH", amount, value: amount, address: toUsername });
      return { success: true };
    }

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
    setCashBalance(0);
    setTransactions([]);
    setActiveTab("wallet");
    localStorage.removeItem("phantom_current_user");
  };

  return (
    <WalletContext.Provider value={{
      username, setUsername, hasOnboarded, setHasOnboarded,
      tokens, setTokens, totalBalance, cashBalance, setCashBalance,
      transactions, addTransaction, swapTokens, buyToken, sellToken, sendToUser,
      addToBalance, removeFromBalance,
      activeTab, setActiveTab, exploreBuySymbol, setExploreBuySymbol, logout,
    }}>
      {children}
    </WalletContext.Provider>
  );
};
