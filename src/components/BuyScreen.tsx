import { useState } from "react";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { allCoins } from "@/data/coins";

const BuyScreen = () => {
  const { setActiveTab, setExploreBuySymbol } = useWallet();
  const [search, setSearch] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const { tokens, setTokens, addTransaction } = useWallet();

  const filtered = allCoins.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) ||
         c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (p: number) => {
    if (p >= 1) return "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return "$" + p.toFixed(6);
  };

  const setAmount = (symbol: string, val: string) => {
    setAmounts(prev => ({ ...prev, [symbol]: val }));
  };

  const totalCost = Object.entries(amounts).reduce((sum, [, val]) => sum + (parseFloat(val) || 0), 0);

  const handleBuyAll = () => {
    const entries = Object.entries(amounts).filter(([, val]) => parseFloat(val) > 0);
    if (entries.length === 0) return;

    entries.forEach(([symbol, val]) => {
      const usdAmount = parseFloat(val);
      const coin = allCoins.find(c => c.symbol === symbol);
      if (!coin || usdAmount <= 0) return;
      const tokenAmount = usdAmount / coin.price;

      setTokens(prev => {
        const exists = prev.find(t => t.symbol === symbol);
        if (exists) {
          return prev.map(t => t.symbol === symbol ? { ...t, balance: t.balance + tokenAmount } : t);
        }
        return [...prev, {
          symbol: coin.symbol,
          name: coin.name,
          balance: tokenAmount,
          priceUsd: coin.price,
          change: coin.change,
          logo: coin.logo,
        }];
      });

      addTransaction({ type: "buy", toToken: symbol, amount: tokenAmount, value: usdAmount });
    });

    setSuccess(true);
    setTimeout(() => {
      setActiveTab("wallet");
      setSuccess(false);
      setExploreBuySymbol("");
      setAmounts({});
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <span className="text-success text-2xl">✓</span>
        </div>
        <p className="text-foreground font-semibold text-lg">Purchase Complete!</p>
        <p className="text-muted-foreground text-sm mt-1">
          ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })} total
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={() => { setExploreBuySymbol(""); setActiveTab("wallet"); }} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Buy Crypto</h2>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search tokens..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-20">
        {filtered.map(coin => {
          const usdVal = amounts[coin.symbol] || "";
          const parsedAmount = parseFloat(usdVal) || 0;
          const tokenAmount = parsedAmount > 0 ? parsedAmount / coin.price : 0;

          return (
            <div key={coin.symbol} className="mb-2 rounded-2xl bg-secondary p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    <img src={coin.logo} alt={coin.name} className="w-full h-full object-cover"
                      onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${coin.symbol.charAt(0)}</span>`; }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{coin.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(coin.price)}</p>
                  </div>
                </div>
                <p className={`text-xs font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    value={usdVal}
                    onChange={(e) => setAmount(coin.symbol, e.target.value)}
                    placeholder="0.00"
                    className="w-full py-2 pl-7 pr-3 rounded-xl bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                  />
                </div>
                {tokenAmount > 0 && (
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    ≈ {tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {coin.symbol}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No tokens found</p>
          </div>
        )}
      </div>

      {totalCost > 0 && (
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
          <button onClick={handleBuyAll}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Buy — ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyScreen;
