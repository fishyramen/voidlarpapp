import { QrCode, Send, ArrowLeftRight, DollarSign } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const actions = [
  { icon: QrCode, label: "Receive", tab: "receive" },
  { icon: Send, label: "Send", tab: "send" },
  { icon: ArrowLeftRight, label: "Swap", tab: "swap" },
  { icon: DollarSign, label: "Buy", tab: "buy" },
];

const ActionButtons = () => {
  const { setActiveTab } = useWallet();

  return (
    <div className="flex justify-center gap-4 px-4 pb-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => setActiveTab(action.tab)}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors">
            <action.icon className="w-5 h-5" />
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
