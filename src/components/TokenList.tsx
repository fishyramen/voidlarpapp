import { useWallet } from "@/context/WalletContext";
import { ChevronRight, BadgeCheck } from "lucide-react";

const TokenList = () => {
  const { tokens, cashBalance, setActiveTab } = useWallet();

  const formatBalance = (balance: number, symbol: string) => {
    if (balance === 0) return `0 ${symbol}`;
    if (balance >= 1000) return balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ` ${symbol}`;
    if (balance >= 1) return balance.toFixed(2) + ` ${symbol}`;
    if (balance > 0) return balance.toFixed(5) + ` ${symbol}`;
    return `0 ${symbol}`;
  };

  const visibleTokens = tokens.filter(t => t.balance * t.priceUsd >= 0.01 || ["SOL", "ETH", "BTC", "USDC"].includes(t.symbol));

  return (
    <div className="flex-1 px-3 overflow-y-auto">
      {/* Tokens Header */}
      <div className="flex items-center gap-1 px-1 mb-2">
        <h2 className="text-lg font-bold text-foreground">Tokens</h2>
        <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5" />
      </div>

      {/* Token Rows */}
      <div className="space-y-1.5">
        {visibleTokens.map((token) => {
          const value = token.balance * token.priceUsd;
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
                  <p className="text-xs text-muted-foreground">{formatBalance(token.balance, token.symbol)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <p className="text-xs text-muted-foreground">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-2" />
    </div>
  );
};

export default TokenList;
