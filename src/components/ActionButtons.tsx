import { Send, ArrowLeftRight, QrCode, DollarSign } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const actions = [
  { icon: Send, label: "Send", tab: "send" },
  { icon: ArrowLeftRight, label: "Swap", tab: "swap" },
  { icon: QrCode, label: "Receive", tab: "receive" },
  { icon: DollarSign, label: "Buy", tab: "buy" },
];

const ActionButtons = () => {
  const { setActiveTab } = useWallet();

  return (
    <div className="flex justify-center gap-3 px-4 pb-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => setActiveTab(action.tab)}
          className="flex flex-col items-center gap-1.5 flex-1"
        >
          <div className="w-full py-3.5 rounded-2xl bg-secondary flex items-center justify-center text-primary hover:bg-muted transition-colors">
            <action.icon className="w-5 h-5" />
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
