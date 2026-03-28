import { Clock, Search } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import phantomLogo from "@/assets/phantom-logo.png";

interface WalletHeaderProps {
  onOpenSettings: () => void;
}

const WalletHeader = ({ onOpenSettings }: WalletHeaderProps) => {
  const { username } = useWallet();

  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1">
      <div className="flex items-center gap-2.5" onClick={onOpenSettings} role="button">
        <div className="w-9 h-9 rounded-full overflow-hidden">
          <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground leading-tight">@{username.toLowerCase()}</span>
          <span className="text-[15px] font-bold text-foreground leading-tight">{username}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Clock className="w-[18px] h-[18px]" />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Search className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
};

export default WalletHeader;
