import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { allCoins } from "@/data/coins";

interface BuyScreenProps {
  initialSymbol?: string;
  mode?: "buy" | "sell";
}

const BuyScreen = ({ initialSymbol, mode: initialMode }: BuyScreenProps) => {
  const { tokens, cashBalance, buyToken, sellToken, setActiveTab } = useWallet();
  const [mode, setMode] = useState<"buy" | "sell">(initialMode || "buy");
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol || "");
  const [usdAmount, setUsdAmount] = useState("");
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedCoin = allCoins.find(c => c.symbol === selectedSymbol);
  const walletToken = tokens.find(t => t.symbol === selectedSymbol);
  const amount = parseFloat(usdAmount) || 0;
  const tokenAmount = selectedCoin ? amount / selectedCoin.price : 0;

  const filteredCoins = allCoins.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) ||
         c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const canExecute = () => {
    if (amount <= 0) return false;
    if (mode === "buy") return amount <= cashBalance;
    if (mode === "sell") return walletToken ? tokenAmount <= walletToken.balance : false;
    return false;
  };

  const handleExecute = () => {
    if (!canExecute() || !selectedCoin) return;
    if (mode === "buy") {
      buyToken(selectedSymbol, amount);
    } else {
      sellToken(selectedSymbol, tokenAmount);
    }
    setSuccess(true);
    setTimeout(() => { setActiveTab("wallet"); setSuccess(false); }, 1500);
  };

  const presets = [10, 50, 100, 500];

  const formatPrice = (p: number) => {
    if (p >= 1) return "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return "$" + p.toFixed(6);
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <span className="text-success text-2xl">✓</span>
        </div>
        <p className="text-foreground font-semibold text-lg">{mode === "buy" ? "Purchased!" : "Sold!"}</p>
        <p className="text-muted-foreground text-sm mt-1">
          {tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedSymbol}
        </p>
      </div>
    );
  }

  // Token selection screen
  if (!selectedSymbol) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <button onClick={() => setActiveTab("wallet")} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base font-semibold text-foreground">Select Token</h2>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          {filteredCoins.map(coin => (
            <button
              key={coin.symbol}
              onClick={() => setSelectedSymbol(coin.symbol)}
              className="w-full flex items-center justify-between py-3 px-2 rounded-xl hover:bg-secondary/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                  <img src={coin.logo} alt={coin.name} className="w-full h-full object-cover"
                    onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${coin.symbol.charAt(0)}</span>`; }}
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{coin.name}</p>
                  <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{formatPrice(coin.price)}</p>
                <p className={`text-xs font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
                </p>
              </div>
            </button>
          ))}
          {filteredCoins.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">No tokens found</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Amount entry screen
  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={() => setSelectedSymbol("")} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">{mode === "buy" ? "Buy" : "Sell"} {selectedSymbol}</h2>
      </div>

      <div className="flex-1 px-4 space-y-4 pt-2">
        {/* Mode toggle */}
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => setMode("buy")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "buy" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Buy
          </button>
          <button
            onClick={() => setMode("sell")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "sell" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Sell
          </button>
        </div>

        {/* Selected token info */}
        <div className="flex items-center gap-3 bg-secondary rounded-2xl p-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            <img src={selectedCoin?.logo} alt="" className="w-full h-full object-cover"
              onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; }}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{selectedCoin?.name}</p>
            <p className="text-xs text-muted-foreground">{formatPrice(selectedCoin?.price || 0)}</p>
          </div>
          <div className="text-right">
            {mode === "buy" ? (
              <div>
                <p className="text-xs text-muted-foreground">Cash</p>
                <p className="text-sm font-semibold text-foreground">${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground">Holdings</p>
                <p className="text-sm font-semibold text-foreground">{(walletToken?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
              </div>
            )}
          </div>
        </div>

        {/* Amount input */}
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-2 block uppercase tracking-wide">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg font-medium">$</span>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="0.00"
              className="w-full py-3 pl-8 pr-4 rounded-xl bg-secondary text-foreground text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {presets.map(p => (
              <button
                key={p}
                onClick={() => setUsdAmount(String(p))}
                className="flex-1 py-2 rounded-xl bg-secondary text-foreground text-xs font-medium hover:bg-muted transition-colors"
              >
                ${p}
              </button>
            ))}
          </div>
          {amount > 0 && selectedCoin && (
            <p className="text-xs text-muted-foreground mt-2">
              ≈ {tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedSymbol}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleExecute}
          disabled={!canExecute()}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30 transition-opacity"
        >
          {mode === "buy"
            ? (amount > cashBalance ? "Insufficient funds" : `Buy ${selectedSymbol}`)
            : (walletToken && tokenAmount > walletToken.balance ? "Insufficient balance" : `Sell ${selectedSymbol}`)
          }
        </button>
      </div>
    </div>
  );
};

export default BuyScreen;
