import { X, Search } from "lucide-react";
import { useState } from "react";
import { allCoins } from "@/data/coins";
import { useWallet } from "@/context/WalletContext";

interface SearchOverlayProps {
  onClose: () => void;
}

const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
  const { setActiveTab } = useWallet();
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? allCoins.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.symbol.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const formatPrice = (p: number) => p >= 1 ? "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "$" + p.toFixed(6);

  const handleSelect = (symbol: string) => {
    setActiveTab("buy");
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search tokens..." value={query} onChange={(e) => setQuery(e.target.value)} autoFocus
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1" />
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        {query.trim() === "" ? (
          <div className="flex flex-col items-center justify-center py-16"><p className="text-sm text-muted-foreground">Search for tokens by name or symbol</p></div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16"><p className="text-sm text-muted-foreground">No results for "{query}"</p></div>
        ) : (
          results.map(coin => (
            <button key={coin.symbol} onClick={() => handleSelect(coin.symbol)}
              className="w-full flex items-center justify-between py-3 px-2 rounded-xl hover:bg-secondary/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                  <img src={coin.logo} alt={coin.name} className="w-full h-full object-cover"
                    onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${coin.symbol.charAt(0)}</span>`; }} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{coin.name}</p>
                  <p className="text-xs text-muted-foreground">{coin.symbol} · {coin.marketCap}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{formatPrice(coin.price)}</p>
                <p className={`text-xs font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>{coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
