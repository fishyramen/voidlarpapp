import { useWallet } from "@/context/WalletContext";

const WalletBalance = () => {
  const { tokens, totalBalance } = useWallet();

  // Weighted average change based on actual holdings
  const holdingsValue = tokens.reduce((sum, t) => sum + t.balance * t.priceUsd, 0);
  const weightedChange = holdingsValue > 0
    ? tokens.reduce((sum, t) => {
        const value = t.balance * t.priceUsd;
        if (value <= 0) return sum;
        return sum + (value / holdingsValue) * t.change;
      }, 0)
    : 0;

  const changeAmount = totalBalance * (weightedChange / 100);

  return (
    <div className="flex flex-col px-4 pt-3 pb-4">
      <h1 className="text-[38px] font-bold tracking-tight text-foreground leading-none">
        ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </h1>
      {weightedChange !== 0 && (
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-sm font-medium ${weightedChange >= 0 ? "text-success" : "text-destructive"}`}>
            {weightedChange >= 0 ? "+" : "-"}${Math.abs(changeAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${weightedChange >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
            {weightedChange >= 0 ? "+" : ""}{weightedChange.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
