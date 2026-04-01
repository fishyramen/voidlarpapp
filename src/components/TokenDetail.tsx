import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { allCoins } from "@/data/coins";

interface TokenDetailProps {
  symbol: string;
  onClose: () => void;
}

const TokenDetail = ({ symbol, onClose }: TokenDetailProps) => {
  const { tokens, setTokens, addTransaction, sellToken } = useWallet();
  const [mode, setMode] = useState<"info" | "buy" | "sell">("info");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState("");

  const coin = allCoins.find(c => c.symbol === symbol);
  const token = tokens.find(t => t.symbol === symbol);
  if (!coin) return null;

  const balance = token?.balance || 0;
  const balanceUsd = balance * coin.price;
  const parsedAmount = parseFloat(amount) || 0;

  const formatPrice = (p: number) => {
    if (p >= 1) return "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return "$" + p.toFixed(8);
  };

  const handleBuy = () => {
    if (parsedAmount <= 0) return;
    const tokenAmount = parsedAmount / coin.price;
    setTokens(prev => prev.map(t =>
      t.symbol === symbol ? { ...t, balance: t.balance + tokenAmount } : t
    ));
    addTransaction({ type: "buy", toToken: symbol, amount: tokenAmount, value: parsedAmount });
    setSuccess(`Bought ${tokenAmount.toFixed(6)} ${symbol}`);
    // Keep amount in the input — don't clear it
    setTimeout(() => setSuccess(""), 2000);
    setMode("info");
  };

  const handleSell = () => {
    if (parsedAmount <= 0 || parsedAmount > balanceUsd) return;
    const tokenAmount = parsedAmount / coin.price;
    sellToken(symbol, tokenAmount);
    setSuccess(`Sold ${tokenAmount.toFixed(6)} ${symbol}`);
    setTimeout(() => setSuccess(""), 2000);
    setMode("info");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-secondary">
            <img src={coin.logo} alt={coin.name} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <h2 className="text-base font-semibold text-foreground">{coin.name}</h2>
        </div>
      </div>

      {/* Price section */}
      <div className="px-5 pt-4 pb-6">
        <p className="text-3xl font-bold text-foreground">{formatPrice(coin.price)}</p>
        <div className="flex items-center gap-1.5 mt-1">
          {coin.change >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-success" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-destructive" />
          )}
          <p className={`text-sm font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
            {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
          </p>
          <span className="text-xs text-muted-foreground ml-1">24h</span>
        </div>
      </div>

      {/* Balance card */}
      <div className="mx-4 rounded-2xl bg-secondary p-4 mb-4">
        <p className="text-xs text-muted-foreground mb-1">Your Balance</p>
        <p className="text-lg font-bold text-foreground">
          {balance > 0 ? balance.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0"} {symbol}
        </p>
        <p className="text-sm text-muted-foreground">
          ≈ ${balanceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Info */}
      <div className="mx-4 rounded-2xl bg-secondary p-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Market Cap</span>
          <span className="text-foreground font-medium">{coin.marketCap}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Symbol</span>
          <span className="text-foreground font-medium">{coin.symbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">24h Change</span>
          <span className={`font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
            {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
          </span>
        </div>
      </div>

      {success && (
        <div className="mx-4 mb-3 bg-success/15 text-success text-xs font-medium px-3 py-2 rounded-lg text-center">
          {success}
        </div>
      )}

      {/* Buy/Sell input */}
      {(mode === "buy" || mode === "sell") && (
        <div className="mx-4 mb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="w-full py-3 pl-7 pr-4 rounded-xl bg-secondary text-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
          {parsedAmount > 0 && (
            <p className="text-xs text-muted-foreground mt-1.5 px-1">
              ≈ {(parsedAmount / coin.price).toLocaleString(undefined, { maximumFractionDigits: 6 })} {symbol}
            </p>
          )}
          {mode === "sell" && parsedAmount > balanceUsd && (
            <p className="text-xs text-destructive mt-1 px-1">Insufficient balance</p>
          )}
        </div>
      )}

      <div className="flex-1" />

      {/* Action buttons */}
      <div className="p-4 space-y-2">
        {mode === "info" && (
          <div className="flex gap-3">
            <button
              onClick={() => setMode("buy")}
              className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
            >
              Buy
            </button>
            <button
              onClick={() => { if (balance > 0) setMode("sell"); }}
              disabled={balance <= 0}
              className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-semibold text-sm disabled:opacity-30"
            >
              Sell
            </button>
          </div>
        )}
        {mode === "buy" && (
          <div className="flex gap-3">
            <button onClick={() => setMode("info")}
              className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-semibold text-sm">
              Cancel
            </button>
            <button onClick={handleBuy} disabled={parsedAmount <= 0}
              className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30">
              Confirm Buy
            </button>
          </div>
        )}
        {mode === "sell" && (
          <div className="flex gap-3">
            <button onClick={() => setMode("info")}
              className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-semibold text-sm">
              Cancel
            </button>
            <button onClick={handleSell} disabled={parsedAmount <= 0 || parsedAmount > balanceUsd}
              className="flex-1 py-3 rounded-2xl bg-destructive text-destructive-foreground font-semibold text-sm disabled:opacity-30">
              Confirm Sell
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDetail;
