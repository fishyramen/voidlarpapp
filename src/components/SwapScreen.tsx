import { useState } from "react";
import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const SwapScreen = () => {
  const { tokens, swapTokens, setActiveTab } = useWallet();
  const [fromSymbol, setFromSymbol] = useState("SOL");
  const [toSymbol, setToSymbol] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [showFromSelect, setShowFromSelect] = useState(false);
  const [showToSelect, setShowToSelect] = useState(false);

  const fromToken = tokens.find(t => t.symbol === fromSymbol)!;
  const toToken = tokens.find(t => t.symbol === toSymbol)!;

  const fromValue = parseFloat(fromAmount) || 0;
  const toValue = fromToken && toToken ? (fromValue * fromToken.priceUsd) / toToken.priceUsd : 0;
  const usdValue = fromValue * (fromToken?.priceUsd || 0);

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
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {t.symbol}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-2 pb-4 relative">
      <h2 className="text-lg font-semibold text-foreground text-center mb-4">Swap</h2>

      {/* From */}
      <div className="bg-secondary rounded-2xl p-4 mb-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">You pay</span>
          <span className="text-xs text-muted-foreground">Balance: {fromToken.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFromSelect(true)}
            className="flex items-center gap-2 bg-background rounded-xl px-3 py-2 shrink-0"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
              <img src={fromToken.logo} alt={fromToken.symbol} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-foreground">{fromSymbol}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0"
            className="flex-1 text-right text-2xl font-semibold text-foreground bg-transparent focus:outline-none placeholder:text-muted-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground text-right mt-1">${usdValue.toFixed(2)}</p>
      </div>

      {/* Swap button */}
      <div className="flex justify-center -my-3 z-10">
        <button
          onClick={handleFlip}
          className="w-9 h-9 rounded-full bg-secondary border-4 border-background flex items-center justify-center text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4 rotate-90" />
        </button>
      </div>

      {/* To */}
      <div className="bg-secondary rounded-2xl p-4 mt-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">You receive</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowToSelect(true)}
            className="flex items-center gap-2 bg-background rounded-xl px-3 py-2 shrink-0"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
              <img src={toToken.logo} alt={toToken.symbol} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold text-foreground">{toSymbol}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <div className="flex-1 text-right text-2xl font-semibold text-foreground">
            {toValue > 0 ? toValue.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0"}
          </div>
        </div>
      </div>

      {/* Rate */}
      {fromToken && toToken && (
        <div className="flex items-center justify-between px-1 mt-3">
          <span className="text-xs text-muted-foreground">Rate</span>
          <span className="text-xs text-foreground">1 {fromSymbol} = {(fromToken.priceUsd / toToken.priceUsd).toLocaleString(undefined, { maximumFractionDigits: 6 })} {toSymbol}</span>
        </div>
      )}

      <div className="flex-1" />

      <button
        onClick={handleSwap}
        disabled={fromValue <= 0 || fromValue > fromToken.balance}
        className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30 transition-opacity"
      >
        {fromValue > fromToken.balance ? "Insufficient balance" : "Review order"}
      </button>

      <TokenSelector show={showFromSelect} onSelect={setFromSymbol} onClose={() => setShowFromSelect(false)} exclude={toSymbol} />
      <TokenSelector show={showToSelect} onSelect={setToSymbol} onClose={() => setShowToSelect(false)} exclude={fromSymbol} />
    </div>
  );
};

export default SwapScreen;
