import { useState } from "react";
import { Search } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { allCoins } from "@/data/coins";

const ExploreScreen = () => {
  const { setActiveTab, setExploreBuySymbol } = useWallet();
  const [search, setSearch] = useState("");

  const filtered = allCoins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (p: number) => {
    if (p >= 1) return "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return "$" + p.toFixed(6);
  };

  const handleTrade = (symbol: string) => {
    setExploreBuySymbol(symbol);
    setActiveTab("buy");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {filtered.map((coin) => (
          <div key={coin.symbol} className="flex items-center justify-between py-3 px-1">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                <img src={coin.logo} alt={coin.name} className="w-full h-full object-cover"
                  onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${coin.symbol.charAt(0)}</span>`; }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{coin.name}</p>
                <p className="text-xs text-muted-foreground">{coin.symbol} · {coin.marketCap}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{formatPrice(coin.price)}</p>
                <p className={`text-xs font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
                </p>
              </div>
              <button
                onClick={() => handleTrade(coin.symbol)}
                className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold hover:bg-primary/30 transition-colors"
              >
                Trade
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No tokens found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreScreen;
