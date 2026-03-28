import { useWallet } from "@/context/WalletContext";
import { ChevronRight, BadgeCheck } from "lucide-react";

const TokenList = () => {
  const { tokens, cashBalance, setCashBalance, setActiveTab } = useWallet();

  const formatBalance = (balance: number) => {
    if (balance >= 1000000) return (balance / 1000000).toFixed(2) + "M";
    if (balance >= 1000) return balance.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (balance >= 1) return balance.toFixed(2);
    if (balance > 0) return balance.toFixed(5);
    return "0";
  };

  const visibleTokens = tokens.filter(t => t.balance * t.priceUsd >= 0.01 || t.balance > 0);

  const handleAddCash = () => {
    setActiveTab("buy");
  };

  return (
    <div className="flex-1 px-3 overflow-y-auto">
      {/* Cash Balance Card */}
      <div className="mx-1 mb-3 bg-secondary rounded-2xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Cash Balance</p>
          <p className="text-lg font-bold text-foreground">${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
        <button
          onClick={handleAddCash}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Add Cash
        </button>
      </div>

      {/* Tokens Header */}
      <div className="flex items-center gap-1 px-1 mb-2">
        <h2 className="text-base font-bold text-foreground">Tokens</h2>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Token Rows */}
      <div className="space-y-1.5">
        {visibleTokens.map((token) => {
          const value = token.balance * token.priceUsd;
          const changeValue = value * (token.change / 100);
          return (
            <div
              key={token.symbol}
              className="flex items-center justify-between py-3 px-3 rounded-2xl bg-secondary"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <img
                    src={token.logo}
                    alt={token.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${token.symbol.charAt(0)}</span>`;
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-foreground">{token.name}</p>
                    <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">{formatBalance(token.balance)} {token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <p className={`text-xs font-medium ${token.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {token.change >= 0 ? "+" : "-"}${Math.abs(changeValue).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
        {visibleTokens.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-sm">No tokens yet</p>
            <p className="text-muted-foreground text-xs mt-1">Buy some crypto to get started</p>
          </div>
        )}
      </div>
      <div className="h-2" />
    </div>
  );
};

export default TokenList;
