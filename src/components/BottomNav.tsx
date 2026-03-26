import { Wallet, BarChart3, Globe, MessageSquare } from "lucide-react";

const navItems = [
  { icon: Wallet, label: "Wallet", active: true },
  { icon: BarChart3, label: "Activity", active: false },
  { icon: Globe, label: "Browse", active: false },
  { icon: MessageSquare, label: "Messages", active: false },
];

const BottomNav = () => {
  return (
    <div className="flex items-center justify-around py-3 px-4 border-t border-border bg-background/80 backdrop-blur-xl">
      {navItems.map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
