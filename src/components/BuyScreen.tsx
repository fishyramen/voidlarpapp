import { useState, useEffect } from "react";
import { ArrowLeft, Search, ShoppingCart, Check } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { allCoins } from "@/data/coins";
import { toast } from "sonner";

const BuyScreen = () => {
  const { setActiveTab, setExploreBuySymbol, tokens, setTokens, addTransaction } = useWallet();
  const [search, setSearch] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [buying, setBuying] = useState<string | null>(null);
  const [justBought, setJustBought] = useState<string | null>(null);

  // Load saved amounts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("voidlarp_buy_amounts");
    if (saved) {
      try {
        setAmounts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved amounts:", e);
      }
    }
  }, []);

  // Save amounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("voidlarp_buy_amounts", JSON.stringify(amounts));
  }, [amounts]);

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

  const handleBuyAll = async () => {
    const entries = Object.entries(amounts).filter(([, val]) => parseFloat(val) > 0);
    if (entries.length === 0) {
      toast.error("Enter an amount to buy");
      return;
    }

    let successCount = 0;
    
    for (const [symbol, val] of entries) {
      const usdAmount = parseFloat(val);
      const coin = allCoins.find(c => c.symbol === symbol);
      if (!coin || usdAmount <= 0) continue;
      
      const tokenAmount = usdAmount / coin.price;
      
      setBuying(symbol);
      
      // Simulate brief delay for feedback
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setTokens(prev => {
        const exists = prev.find(t => t.symbol === symbol);
        if (exists) {
          return prev.map(t => 
            t.symbol === symbol 
              ? { ...t, balance: t.balance + tokenAmount } 
              : t
          );
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

      addTransaction({ 
        type: "buy", 
        toToken: symbol, 
        amount: tokenAmount, 
        value: usdAmount 
      });
      
      successCount++;
      setBuying(null);
      setJustBought(symbol);
      
      setTimeout(() => setJustBought(prev => prev === symbol ? null : prev), 1500);
    }

    if (successCount > 0) {
      toast.success(`Bought $${totalCost.toFixed(2)} of crypto`, {
        description: successCount === 1 
          ? `Added to your ${entries[0][0]} balance` 
          : `Added to ${successCount} tokens`
      });
    }
    
    // Keep amounts editable - DON'T clear them ✅
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button 
          onClick={() => { setExploreBuySymbol(""); setActiveTab("wallet"); }} 
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Buy Crypto</h2>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search tokens..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1" 
          />
        </div>
      </div>

      {/* Scrollable Token List */}
      <div className="flex-1 overflow-y-auto px-3 pb-24">
        {filtered.map(coin => {
          const usdVal = amounts[coin.symbol] || "";
          const parsedAmount = parseFloat(usdVal) || 0;
          const tokenAmount = parsedAmount > 0 ? parsedAmount / coin.price : 0;
          const held = tokens.find(t => t.symbol === coin.symbol);
          const currentBalance = held?.balance || 0;
          const isBuying = buying === coin.symbol;
          const wasJustBought = justBought === coin.symbol;

          return (
            <div 
              key={coin.symbol} 
              className={`mb-2 rounded-2xl bg-secondary p-3 transition-all ${
                wasJustBought ? 'ring-2 ring-success/50 bg-success/5' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center relative">
                    <img 
                      src={coin.logo} 
                      alt={coin.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        const el = e.target as HTMLImageElement; 
                        el.style.display = "none"; 
                        el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${coin.symbol.charAt(0)}</span>`; 
                      }} 
                    />
                    {isBuying && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {wasJustBought && !isBuying && (
                      <div className="absolute inset-0 bg-success/20 flex items-center justify-center rounded-full">
                        <Check className="w-5 h-5 text-success" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{coin.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(coin.price)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
                  </p>
                  {currentBalance > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      Owned: {currentBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    value={usdVal}
                    onChange={(e) => setAmount(coin.symbol, e.target.value)}
                    placeholder="0.00"
                    disabled={isBuying}
                    className="w-full py-2 pl-7 pr-3 rounded-xl bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground disabled:opacity-50"
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

      {/* Sticky Buy Button - Fixed at bottom, follows user */}
      {totalCost > 0 && (
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent z-10">
          <button 
            onClick={handleBuyAll}
            disabled={Object.values(amounts).every(v => !v || parseFloat(v) <= 0) || !!buying}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            {buying ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Buying...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Buy — ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyScreen;
