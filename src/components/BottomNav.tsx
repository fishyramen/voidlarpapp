import { Home, ArrowLeftRight, Clock, Compass } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const BottomNav = () => {
  const { activeTab, setActiveTab } = useWallet();

  const navItems = [
    { icon: Home, label: "Home", id: "wallet" },
    { icon: ArrowLeftRight, label: "Swap", id: "swap" },
    { icon: Clock, label: "Activity", id: "activity" },
    { icon: Compass, label: "Explore", id: "explore" },
  ];

  return (
    <div className="flex items-center justify-around py-2 px-2 border-t border-border">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
            activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <item.icon className="w-5 h-5" strokeWidth={activeTab === item.id ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
