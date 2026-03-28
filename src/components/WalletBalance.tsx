import { useWallet } from "@/context/WalletContext";

const WalletBalance = () => {
  const { totalBalance } = useWallet();

  return (
    <div className="flex flex-col items-center px-4 pt-2 pb-2">
      {/* Hero illustration placeholder */}
      <div className="w-full flex items-center justify-center py-4 mb-2">
        <div className="relative">
          <div className="w-32 h-24 rounded-2xl bg-secondary/60 flex items-center justify-center">
            <span className="text-4xl">👻</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-1">Your wallet is ready</h2>
      <p className="text-sm text-muted-foreground text-center leading-relaxed mb-3 px-4">
        Fund your wallet with cash or crypto and you'll be set to start trading!
      </p>
    </div>
  );
};

export default WalletBalance;
