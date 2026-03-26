import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const BuyScreen = () => {
  const { tokens, cashBalance, buyToken, setActiveTab } = useWallet();
  const [selectedToken, setSelectedToken] = useState("SOL");
  const [usdAmount, setUsdAmount] = useState("");
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = tokens.find(t => t.symbol === selectedToken)!;
  const amount = parseFloat(usdAmount) || 0;
  const tokenAmount = token ? amount / token.priceUsd : 0;

  const handleBuy = () => {
    if (amount <= 0 || amount > cashBalance) return;
    buyToken(selectedToken, amount);
    setSuccess(true);
    setTimeout(() => { setActiveTab("wallet"); setSuccess(false); }, 1500);
  };

  const presets = [10, 50, 100, 500];

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <span className="text-success text-2xl">✓</span>
        </div>
        <p className="text-foreground font-semibold text-lg">Purchased!</p>
        <p className="text-muted-foreground text-sm mt-1">{tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedToken}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={() => setActiveTab("wallet")} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Buy</h2>
      </div>

      <div className="flex-1 px-4 space-y-4 pt-2">
        <div className="bg-secondary rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Cash Balance</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          {cashBalance === 0 && (
            <p className="text-xs text-warning mt-1">Add funds in Settings first</p>
          )}
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-2 block uppercase tracking-wide">Token</label>
          <button
            onClick={() => setShowTokenSelect(!showTokenSelect)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-secondary"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-muted">
                <img src={token?.logo} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-foreground">{token?.name}</span>
                <p className="text-xs text-muted-foreground">${token?.priceUsd.toLocaleString()}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {showTokenSelect && (
            <div className="mt-1 bg-secondary rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {tokens.map(t => (
                <button
                  key={t.symbol}
                  onClick={() => { setSelectedToken(t.symbol); setShowTokenSelect(false); }}
                  className="w-full flex items-center justify-between py-2.5 px-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                      <img src={t.logo} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-foreground">{t.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">${t.priceUsd.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-2 block uppercase tracking-wide">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg font-medium">$</span>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="0.00"
              className="w-full py-3 pl-8 pr-4 rounded-xl bg-secondary text-foreground text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {presets.map(p => (
              <button
                key={p}
                onClick={() => setUsdAmount(String(p))}
                className="flex-1 py-2 rounded-xl bg-secondary text-foreground text-xs font-medium hover:bg-muted transition-colors"
              >
                ${p}
              </button>
            ))}
          </div>
          {amount > 0 && token && (
            <p className="text-xs text-muted-foreground mt-2">
              ≈ {tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedToken}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleBuy}
          disabled={amount <= 0 || amount > cashBalance}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30 transition-opacity"
        >
          {amount > cashBalance ? "Insufficient funds" : "Buy"}
        </button>
      </div>
    </div>
  );
};

export default BuyScreen;
