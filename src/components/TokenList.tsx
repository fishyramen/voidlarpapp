import { useWallet } from "@/context/WalletContext";

const TokenList = () => {
  const { tokens } = useWallet();

  const formatBalance = (balance: number) => {
    if (balance >= 1000000) return (balance / 1000000).toFixed(2) + "M";
    if (balance >= 1000) return balance.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (balance >= 1) return balance.toFixed(2);
    return balance.toFixed(5);
  };

  return (
    <div className="flex-1 px-3 overflow-y-auto">
      <div className="flex items-center gap-4 px-1 mb-2">
        <button className="text-sm font-semibold text-foreground pb-1 border-b-2 border-primary">Tokens</button>
        <button className="text-sm font-semibold text-muted-foreground pb-1 border-b-2 border-transparent hover:text-foreground transition-colors">Collectibles</button>
      </div>
      <div>
        {tokens.map((token) => {
          const value = token.balance * token.priceUsd;
          if (value < 0.01) return null;
          const changeValue = value * (token.change / 100);
          return (
            <div
              key={token.symbol}
              className="flex items-center justify-between py-3 px-1 cursor-pointer hover:bg-secondary/40 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
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
                  <p className="text-sm font-medium text-foreground">{token.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBalance(token.balance)} {token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <p className={`text-xs font-medium ${token.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {token.change >= 0 ? "+" : ""}{changeValue >= 0 ? "+" : ""}${Math.abs(changeValue).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenList;
