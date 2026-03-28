import { Home, Monitor, ArrowLeftRight, MessageSquare, Search } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const BottomNav = () => {
  const { activeTab, setActiveTab } = useWallet();

  const navItems = [
    { icon: Home, id: "wallet", label: "Home" },
    { icon: Monitor, id: "cash", label: "Cash" },
    { icon: ArrowLeftRight, id: "swap", label: "Swap" },
    { icon: MessageSquare, id: "messages", label: "Chat" },
    { icon: Search, id: "explore", label: "Search" },
  ];

  return (
    <div className="flex items-center justify-around py-2 px-2 border-t border-border/50">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-2.5 rounded-xl transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.8} />
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
