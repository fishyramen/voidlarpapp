import { useState } from "react";
import { ArrowLeftRight, ChevronDown, BadgeCheck, SlidersHorizontal } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { allCoins } from "@/data/coins";
import phantomLogo from "@/assets/phantom-logo.png";

const SwapScreen = () => {
  const { tokens, username, swapTokens, setActiveTab } = useWallet();
  const [fromSymbol, setFromSymbol] = useState("SOL");
  const [toSymbol, setToSymbol] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [showFromSelect, setShowFromSelect] = useState(false);
  const [showToSelect, setShowToSelect] = useState(false);
  const [swapTab, setSwapTab] = useState<"tokens" | "perps">("tokens");

  const fromToken = tokens.find(t => t.symbol === fromSymbol)!;
  const toToken = tokens.find(t => t.symbol === toSymbol)!;

  const fromValue = parseFloat(fromAmount) || 0;
  const toValue = fromToken && toToken ? (fromValue * fromToken.priceUsd) / toToken.priceUsd : 0;

  const handleSwap = () => {
    if (fromValue <= 0 || fromValue > fromToken.balance) return;
    swapTokens(fromSymbol, toSymbol, fromValue);
    setFromAmount("");
    setActiveTab("wallet");
  };

  const handleFlip = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setFromAmount("");
  };

  const formatPrice = (p: number) => {
    if (p >= 1) return "$" + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return "$" + p.toFixed(6);
  };

  const TokenSelector = ({ show, onSelect, onClose, exclude }: { show: boolean; onSelect: (s: string) => void; onClose: () => void; exclude: string }) => {
    if (!show) return null;
    return (
      <div className="absolute inset-0 bg-background z-10 flex flex-col rounded-3xl">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h3 className="text-base font-semibold text-foreground">Select token</h3>
          <button onClick={onClose} className="text-muted-foreground text-sm">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          {tokens.filter(t => t.symbol !== exclude).map(t => (
            <button
              key={t.symbol}
              onClick={() => { onSelect(t.symbol); onClose(); }}
              className="w-full flex items-center gap-3 py-3 px-2 hover:bg-secondary/50 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary">
                <img src={t.logo} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {t.symbol}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Trending tokens for the list below
  const trendingCoins = [...allCoins].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 6);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary">
            <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground leading-tight">@{username.toLowerCase()}</span>
            <span className="text-[15px] font-bold text-foreground leading-tight">Swap</span>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
          <SlidersHorizontal className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Swap cards */}
      <div className="px-4 pt-2">
        {/* From */}
        <div className="bg-secondary rounded-2xl p-4 mb-1">
          <p className="text-xs text-muted-foreground mb-3">You Pay</p>
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0"
              className="text-3xl font-semibold text-muted-foreground bg-transparent focus:outline-none w-24 placeholder:text-muted-foreground/50"
            />
            <button
              onClick={() => setShowFromSelect(true)}
              className="flex items-center gap-1.5 bg-muted/50 rounded-full px-3 py-1.5"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                <img src={fromToken?.logo} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-semibold text-foreground">{fromSymbol}</span>
              <BadgeCheck className="w-3.5 h-3.5 text-primary" />
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <button className="text-muted-foreground">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-muted-foreground">{fromToken?.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {fromSymbol}</span>
          </div>
        </div>

        {/* Flip button */}
        <div className="flex justify-center -my-3 z-10 relative">
          <button
            onClick={handleFlip}
            className="w-9 h-9 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 rotate-90" />
          </button>
        </div>

        {/* To */}
        <div className="bg-secondary rounded-2xl p-4 mt-1">
          <p className="text-xs text-muted-foreground mb-3">You Receive</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-semibold text-muted-foreground/50">
              {toValue > 0 ? toValue.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0"}
            </span>
            <button
              onClick={() => setShowToSelect(true)}
              className="flex items-center gap-1.5 bg-muted/50 rounded-full px-3 py-1.5"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                <img src={toToken?.logo} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-semibold text-foreground">{toSymbol}</span>
              <BadgeCheck className="w-3.5 h-3.5 text-primary" />
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-right mt-2">$0.00</p>
        </div>
      </div>

      {/* Tabs below */}
      <div className="flex items-center gap-4 px-4 pt-5 pb-2">
        <button
          onClick={() => setSwapTab("tokens")}
          className={`text-base font-bold transition-colors ${swapTab === "tokens" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Tokens
        </button>
        <button
          onClick={() => setSwapTab("perps")}
          className={`text-base font-bold transition-colors ${swapTab === "perps" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Perps
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 px-4 pb-2">
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">Rank ↓</span>
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">Solana</span>
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">24h</span>
      </div>

      {/* Trending list */}
      <div className="flex-1 overflow-y-auto px-3">
        {trendingCoins.map((coin, i) => (
          <div key={coin.symbol} className="flex items-center justify-between py-3 px-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                  <img src={coin.logo} alt={coin.name} className="w-full h-full object-cover"
                    onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; }}
                  />
                </div>
                <div className={`absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-gray-400 text-black" : i === 2 ? "bg-orange-600 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{coin.name}</p>
                <p className="text-xs text-muted-foreground">{coin.marketCap} MC</p>
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
      </div>

      <TokenSelector show={showFromSelect} onSelect={setFromSymbol} onClose={() => setShowFromSelect(false)} exclude={toSymbol} />
      <TokenSelector show={showToSelect} onSelect={setToSymbol} onClose={() => setShowToSelect(false)} exclude={fromSymbol} />
    </div>
  );
};

export default SwapScreen;
