import { Home, Monitor, ArrowLeftRight, MessageSquare, Search } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const BottomNav = () => {
  const { activeTab, setActiveTab } = useWallet();

  const navItems = [
    { icon: Home, id: "wallet" },
    { icon: Monitor, id: "activity" },
    { icon: ArrowLeftRight, id: "swap" },
    { icon: MessageSquare, id: "send" },
    { icon: Search, id: "explore" },
  ];

  return (
    <div className="flex items-center justify-around py-2.5 px-4 border-t border-border">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`p-2 rounded-lg transition-colors ${
            activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <item.icon className="w-[22px] h-[22px]" strokeWidth={activeTab === item.id ? 2.5 : 1.8} />
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
