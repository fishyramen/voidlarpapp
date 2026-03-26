import { Settings, Search, Bell, Copy } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import phantomLogo from "@/assets/phantom-logo.png";

interface WalletHeaderProps {
  onOpenSettings: () => void;
}

const WalletHeader = ({ onOpenSettings }: WalletHeaderProps) => {
  const { username } = useWallet();

  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
          <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
        </button>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-foreground">{username}</span>
          <Copy className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WalletHeader;
