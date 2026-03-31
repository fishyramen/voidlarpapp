import { useWallet } from "@/context/WalletContext";
import { ChevronRight, BadgeCheck } from "lucide-react";
import { allCoins } from "@/data/coins";

const TokenList = () => {
  const { tokens } = useWallet();

  const formatBalance = (balance: number) => {
    if (balance >= 1000000) return (balance / 1000000).toFixed(2) + "M";
    if (balance >= 1000) return balance.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (balance >= 1) return balance.toFixed(2);
    if (balance > 0) return balance.toFixed(5);
    return "0";
  };

  // Merge all coins with wallet balances
  const allTokensWithBalance = allCoins.map(coin => {
    const held = tokens.find(t => t.symbol === coin.symbol);
    return {
      symbol: coin.symbol,
      name: coin.name,
      balance: held?.balance || 0,
      priceUsd: held?.priceUsd || coin.price,
      change: held?.change || coin.change,
      logo: coin.logo,
    };
  });

  return (
    <div className="flex-1 px-3 overflow-y-auto">
      <div className="flex items-center gap-1 px-1 mb-2">
        <h2 className="text-base font-bold text-foreground">Tokens</h2>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="space-y-1.5">
        {allTokensWithBalance.map((token) => {
          const value = token.balance * token.priceUsd;
          const changeValue = value * (token.change / 100);
          return (
            <div key={token.symbol} className="flex items-center justify-between py-3 px-3 rounded-2xl bg-secondary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <img src={token.logo} alt={token.name} className="w-full h-full object-cover"
                    onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; el.parentElement!.innerHTML = `<span class="text-xs font-bold text-foreground">${token.symbol.charAt(0)}</span>`; }}
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
                <p className="text-sm font-semibold text-foreground">
                  ${value > 0 ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}
                </p>
                {value > 0 ? (
                  <p className={`text-xs font-medium ${token.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {token.change >= 0 ? "+" : "-"}${Math.abs(changeValue).toFixed(2)}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">—</p>
                )}
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
