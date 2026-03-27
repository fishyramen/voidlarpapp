import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { allCoins } from "@/data/coins";
import { featuredCollections, sampleCollectibles } from "@/data/collectibles";

type ExploreTab = "tokens" | "collections";

const ExploreScreen = () => {
  const { setActiveTab, setExploreBuySymbol } = useWallet();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ExploreTab>("tokens");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filtered = allCoins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Sort by absolute change for trending
  const trending = [...allCoins].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 8);

  const formatPrice = (p: number) => {
    if (p >= 1) return "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return "$" + p.toFixed(8);
  };

  const handleTrade = (symbol: string) => {
    setExploreBuySymbol(symbol);
    setActiveTab("buy");
  };

  const featured = featuredCollections[featuredIndex];

  const isSearching = search.length > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Tokens, Collections"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <button
          onClick={() => setTab("tokens")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-colors ${
            tab === "tokens"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-primary/30 flex items-center justify-center text-[8px]">◎</span>
          Tokens
        </button>
        <button
          onClick={() => setTab("collections")}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-colors ${
            tab === "collections"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="text-[10px]">🖼</span>
          Collections
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          /* Search results */
          <div className="px-3">
            {filtered.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => handleTrade(coin.symbol)}
                className="w-full flex items-center justify-between py-3 px-2 rounded-xl hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CoinIcon logo={coin.logo} symbol={coin.symbol} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{coin.name}</p>
                    <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{formatPrice(coin.price)}</p>
                  <p className={`text-xs font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {coin.change >= 0 ? "+ " : ""}{coin.change.toFixed(2)}%
                  </p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">No results found</p>
              </div>
            )}
          </div>
        ) : tab === "tokens" ? (
          /* Tokens tab */
          <div>
            {/* Featured card */}
            <div className="px-4 pb-3">
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = "none";
                        el.parentElement!.innerHTML = `<span class="text-lg font-bold text-foreground">${featured.name.charAt(0)}</span>`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{featured.name}</p>
                        <p className="text-xs text-muted-foreground">{featured.category}</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-semibold shrink-0">
                        Visit Site
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{featured.description}</p>
                  </div>
                </div>
              </div>
              {/* Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-2">
                {featuredCollections.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFeaturedIndex(i)}
                    className={`rounded-full transition-all ${
                      i === featuredIndex ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Trending Tokens */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground">Trending Tokens</h3>
                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  See More <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="px-3">
              {trending.map((coin, index) => (
                <button
                  key={coin.symbol}
                  onClick={() => handleTrade(coin.symbol)}
                  className="w-full flex items-center justify-between py-3 px-2 rounded-xl hover:bg-secondary/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <CoinIcon logo={coin.logo} symbol={coin.symbol} />
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[8px] font-bold text-primary-foreground flex items-center justify-center border-2 border-background">
                        {index + 1}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{coin.symbol}</p>
                      <p className="text-xs text-muted-foreground">{coin.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{formatPrice(coin.price)}</p>
                    <p className={`text-xs font-medium ${coin.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {coin.change >= 0 ? "+ " : ""}{coin.change.toFixed(2)}%
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Collections tab */
          <div className="px-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Popular Collections</h3>
            <div className="grid grid-cols-2 gap-3">
              {sampleCollectibles.map((nft) => (
                <div key={nft.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="aspect-square bg-secondary relative">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        el.style.display = "none";
                        el.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20"><span class="text-2xl font-bold text-foreground/60">${nft.name.charAt(0)}</span></div>`;
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-foreground truncate">{nft.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{nft.collection}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground">Floor</span>
                      <span className="text-[10px] font-semibold text-foreground">{nft.floorPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {sampleCollectibles.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">No collectibles yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CoinIcon = ({ logo, symbol }: { logo: string; symbol: string }) => (
  <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0">
    <img
      src={logo}
      alt={symbol}
      className="w-full h-full object-cover"
      onError={(e) => {
        const el = e.target as HTMLImageElement;
        el.style.display = "none";
        el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${symbol.charAt(0)}</span>`;
      }}
    />
  </div>
);

export default ExploreScreen;
