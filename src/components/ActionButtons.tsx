import { Send, ArrowLeftRight, QrCode, DollarSign } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const ActionButtons = () => {
  const { setActiveTab, totalBalance, cashBalance } = useWallet();

  const hasBalance = totalBalance > 0;

  return (
    <div className="px-4 pb-3 space-y-2">
      {/* Primary CTAs */}
      <button
        onClick={() => setActiveTab("buy")}
        className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
      >
        Buy SOL with Cash
      </button>
      <button
        onClick={() => setActiveTab("receive")}
        className="w-full py-3.5 rounded-2xl bg-secondary text-foreground font-semibold text-sm"
      >
        Deposit Crypto
      </button>

      {/* Action grid */}
      <div className="flex justify-center gap-2 pt-1">
        {[
          { icon: Send, label: "Send", tab: "send" },
          { icon: ArrowLeftRight, label: "Swap", tab: "swap" },
          { icon: QrCode, label: "Receive", tab: "receive" },
          { icon: DollarSign, label: "Buy", tab: "buy" },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => setActiveTab(action.tab)}
            className="flex flex-col items-center gap-1.5 flex-1"
          >
            <div className="w-full py-3.5 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;
