import { Search, TrendingUp, Star } from "lucide-react";
import { useState } from "react";

interface TrendingToken {
  symbol: string;
  name: string;
  price: string;
  change: number;
  logo: string;
  marketCap: string;
}

const trendingTokens: TrendingToken[] = [
  { symbol: "SOL", name: "Solana", price: "$135.30", change: 5.61, logo: "https://cryptologos.cc/logos/solana-sol-logo.png", marketCap: "$65.2B" },
  { symbol: "BTC", name: "Bitcoin", price: "$101,900", change: 1.05, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", marketCap: "$2.0T" },
  { symbol: "ETH", name: "Ethereum", price: "$3,714.50", change: -2.10, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png", marketCap: "$447B" },
  { symbol: "USDC", name: "USD Coin", price: "$1.00", change: 0.01, logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", marketCap: "$33.5B" },
  { symbol: "BONK", name: "Bonk", price: "$0.000025", change: -1.23, logo: "https://cryptologos.cc/logos/bonk1-bonk-logo.png", marketCap: "$1.7B" },
  { symbol: "RAY", name: "Raydium", price: "$3.60", change: 5.67, logo: "https://cryptologos.cc/logos/raydium-ray-logo.png", marketCap: "$1.0B" },
  { symbol: "JTO", name: "Jito", price: "$3.13", change: -0.45, logo: "https://cryptologos.cc/logos/jito-jto-logo.png", marketCap: "$380M" },
  { symbol: "JUP", name: "Jupiter", price: "$1.05", change: 3.22, logo: "https://cryptologos.cc/logos/jupiter-ag-jup-logo.png", marketCap: "$1.4B" },
  { symbol: "RNDR", name: "Render", price: "$10.45", change: 7.80, logo: "https://cryptologos.cc/logos/render-token-rndr-logo.png", marketCap: "$5.4B" },
  { symbol: "DOGE", name: "Dogecoin", price: "$0.165", change: -0.88, logo: "https://cryptologos.cc/logos/dogecoin-doge-logo.png", marketCap: "$23.5B" },
  { symbol: "AVAX", name: "Avalanche", price: "$42.10", change: 2.34, logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png", marketCap: "$17.1B" },
  { symbol: "LINK", name: "Chainlink", price: "$18.90", change: 1.12, logo: "https://cryptologos.cc/logos/chainlink-link-logo.png", marketCap: "$11.8B" },
];

const categories = ["Trending", "Top Gainers", "New"];

const ExploreScreen = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Trending");

  const filtered = trendingTokens.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (activeCategory === "Top Gainers") return b.change - a.change;
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-semibold text-foreground mb-3">Explore</h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary text-foreground text-sm rounded-xl py-2.5 pl-9 pr-4 placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 mb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                activeCategory === cat
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex items-center gap-1.5 mb-2 mt-1">
          {activeCategory === "Trending" && <TrendingUp className="w-3.5 h-3.5 text-primary" />}
          {activeCategory === "Top Gainers" && <Star className="w-3.5 h-3.5 text-warning" />}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{activeCategory}</span>
        </div>

        {sorted.map((token, i) => (
          <div
            key={token.symbol}
            className="flex items-center justify-between py-3 px-1"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                  <img
                    src={token.logo}
                    alt={token.name}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${token.symbol.charAt(0)}</span>`;
                    }}
                  />
                </div>
                {activeCategory === "Trending" && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card text-[9px] font-bold text-muted-foreground flex items-center justify-center">
                    {i + 1}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{token.name}</p>
                <p className="text-xs text-muted-foreground">{token.symbol} · {token.marketCap}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{token.price}</p>
              <p className={`text-xs font-medium ${token.change >= 0 ? "text-success" : "text-destructive"}`}>
                {token.change >= 0 ? "+" : ""}{token.change.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-sm">No tokens found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreScreen;
