import { useWallet } from "@/context/WalletContext";

const WalletBalance = () => {
  const { totalBalance } = useWallet();
  const change = totalBalance * 0.0299;

  return (
    <div className="flex flex-col items-center pt-4 pb-5">
      <h1 className="text-[42px] font-bold tracking-tight text-foreground leading-none">
        ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </h1>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className="text-success text-sm font-medium">+${change.toFixed(2)}</span>
        <span className="text-success text-sm bg-success/15 px-1.5 py-0.5 rounded text-xs font-medium">+2.99%</span>
      </div>
    </div>
  );
};

export default WalletBalance;
