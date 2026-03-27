import { useState } from "react";
import { Search } from "lucide-react";

interface ExploreCoin {
  symbol: string;
  name: string;
  price: number;
  change: number;
  logo: string;
  marketCap: string;
}

const allCoins: ExploreCoin[] = [
  { symbol: "BTC", name: "Bitcoin", price: 101900.00, change: 1.05, logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png", marketCap: "$2.0T" },
  { symbol: "ETH", name: "Ethereum", price: 3714.50, change: -2.10, logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", marketCap: "$447B" },
  { symbol: "SOL", name: "Solana", price: 135.30, change: 5.61, logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png", marketCap: "$63B" },
  { symbol: "USDC", name: "USD Coin", price: 1.00, change: 0.01, logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png", marketCap: "$33B" },
  { symbol: "USDT", name: "Tether", price: 1.00, change: 0.00, logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png", marketCap: "$112B" },
  { symbol: "BNB", name: "BNB", price: 608.40, change: 1.22, logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png", marketCap: "$91B" },
  { symbol: "XRP", name: "XRP", price: 2.18, change: -0.85, logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png", marketCap: "$125B" },
  { symbol: "ADA", name: "Cardano", price: 0.68, change: 3.40, logo: "https://assets.coingecko.com/coins/images/975/small/cardano.png", marketCap: "$24B" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.155, change: -1.50, logo: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png", marketCap: "$22B" },
  { symbol: "AVAX", name: "Avalanche", price: 35.20, change: 2.80, logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png", marketCap: "$14B" },
  { symbol: "DOT", name: "Polkadot", price: 7.10, change: -0.32, logo: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png", marketCap: "$10B" },
  { symbol: "MATIC", name: "Polygon", price: 0.58, change: 1.90, logo: "https://assets.coingecko.com/coins/images/4713/small/polygon.png", marketCap: "$5.4B" },
  { symbol: "LINK", name: "Chainlink", price: 14.80, change: 4.20, logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png", marketCap: "$8.7B" },
  { symbol: "BONK", name: "Bonk", price: 0.000025, change: -1.23, logo: "https://assets.coingecko.com/coins/images/28600/small/bonk.jpg", marketCap: "$1.6B" },
  { symbol: "RAY", name: "Raydium", price: 3.60, change: 5.67, logo: "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg", marketCap: "$530M" },
  { symbol: "JTO", name: "Jito", price: 3.13, change: -0.45, logo: "https://assets.coingecko.com/coins/images/33228/small/jto.png", marketCap: "$370M" },
  { symbol: "JUP", name: "Jupiter", price: 0.82, change: 3.10, logo: "https://assets.coingecko.com/coins/images/34188/small/jup.png", marketCap: "$1.1B" },
  { symbol: "WIF", name: "dogwifhat", price: 2.45, change: 8.30, logo: "https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg", marketCap: "$2.4B" },
  { symbol: "RENDER", name: "Render", price: 7.85, change: 2.15, logo: "https://assets.coingecko.com/coins/images/11636/small/rndr.png", marketCap: "$3.0B" },
  { symbol: "ARB", name: "Arbitrum", price: 1.12, change: -0.78, logo: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg", marketCap: "$2.8B" },
];

type Category = "trending" | "top" | "new";

const ExploreScreen = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("trending");

  const filtered = allCoins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (category === "trending") return Math.abs(b.change) - Math.abs(a.change);
    if (category === "top") return b.price * 1000 - a.price * 1000; // proxy for mcap
    return 0; // "new" just keeps order
  });

  const formatPrice = (p: number) => {
    if (p >= 1) return "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return "$" + p.toFixed(6);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
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

      {/* Category tabs */}
      <div className="flex items-center gap-2 px-4 pb-3">
        {([
          { id: "trending" as Category, label: "🔥 Trending" },
          { id: "top" as Category, label: "💎 Top" },
          { id: "new" as Category, label: "✨ New" },
        ]).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              category === cat.id
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Token list */}
      <div className="flex-1 overflow-y-auto px-3">
        {sorted.map((coin) => (
          <div
            key={coin.symbol}
            className="flex items-center justify-between py-3 px-1"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
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
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{coin.name}</p>
                <p className="text-xs text-muted-foreground">{coin.symbol} · {coin.marketCap}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{formatPrice(coin.price)}</p>
              <p className={`text-xs font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No tokens found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreScreen;
