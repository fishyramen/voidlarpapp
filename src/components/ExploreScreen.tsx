import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { allCoins } from "@/data/coins";
import phantomLogo from "@/assets/phantom-logo.png";

const ExploreScreen = () => {
  const { username, setActiveTab, setExploreBuySymbol } = useWallet();
  const [search, setSearch] = useState("");

  const filtered = allCoins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const trendingTokens = [...filtered].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 6);
  const trendingPerps = [...filtered].sort((a, b) => b.price - a.price).slice(0, 3);

  const formatPrice = (p: number) => {
    if (p >= 1) return "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return "$" + p.toFixed(8);
  };

  const handleTrade = (symbol: string) => {
    setExploreBuySymbol(symbol);
    setActiveTab("buy");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground text-sm font-bold shrink-0">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Sites, tokens, URL"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
        <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {/* Trending Tokens */}
        <div className="flex items-center gap-1 pt-3 pb-2">
          <h2 className="text-xl font-bold text-foreground">Trending Tokens</h2>
          <span className="text-muted-foreground text-xl">›</span>
        </div>
        <div className="bg-secondary rounded-2xl overflow-hidden mb-5">
          {trendingTokens.slice(0, 3).map((coin, i) => (
            <button
              key={coin.symbol}
              onClick={() => handleTrade(coin.symbol)}
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <img src={coin.logo} alt={coin.name} className="w-full h-full object-cover"
                      onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; }}
                    />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-gray-400 text-black" : "bg-orange-600 text-white"
                  }`}>
                    {i + 1}
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">{coin.name}</p>
                  <p className="text-xs text-muted-foreground">{coin.marketCap} MC</p>
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
        </div>

        {/* Trending Perps */}
        <div className="flex items-center gap-1 pb-2">
          <h2 className="text-xl font-bold text-foreground">Trending Perps</h2>
          <span className="text-muted-foreground text-xl">›</span>
        </div>
        <div className="bg-secondary rounded-2xl overflow-hidden mb-5">
          {trendingPerps.map((coin, i) => (
            <button
              key={coin.symbol + "-perp"}
              onClick={() => handleTrade(coin.symbol)}
              className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <img src={coin.logo} alt={coin.name} className="w-full h-full object-cover"
                      onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; }}
                    />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-gray-400 text-black" : "bg-orange-600 text-white"
                  }`}>
                    {i + 1}
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">
                    {coin.symbol}
                    <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium">25x</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{coin.marketCap} Vol</p>
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
        </div>

        {/* Top Lists */}
        <div className="flex items-center gap-1 pb-4">
          <h2 className="text-xl font-bold text-foreground">Top Lists</h2>
          <span className="text-muted-foreground text-xl">›</span>
        </div>
      </div>
    </div>
  );
};

export default ExploreScreen;
