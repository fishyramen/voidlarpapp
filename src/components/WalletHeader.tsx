import { Settings, Search, Bell } from "lucide-react";

const WalletHeader = () => {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2">
      <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
        <div className="w-6 h-6 rounded-full phantom-gradient" />
      </button>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WalletHeader;
