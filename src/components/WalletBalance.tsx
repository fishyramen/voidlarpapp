import { useWallet } from "@/context/WalletContext";

const WalletBalance = () => {
  const { totalBalance } = useWallet();
  const changePercent = -1.30;
  const change = totalBalance * (changePercent / 100);

  return (
    <div className="flex flex-col px-4 pt-3 pb-4">
      <h1 className="text-[38px] font-bold tracking-tight text-foreground leading-none">
        ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </h1>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-destructive text-sm font-medium">
          -${Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
        <span className="text-destructive text-[11px] font-semibold bg-destructive/15 px-1.5 py-0.5 rounded">
          {changePercent}%
        </span>
      </div>
    </div>
  );
};

export default WalletBalance;
