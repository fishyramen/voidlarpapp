import { Settings, Copy, Grid2x2 } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import phantomLogo from "@/assets/phantom-logo.png";

interface WalletHeaderProps {
  onOpenSettings: () => void;
}

const WalletHeader = ({ onOpenSettings }: WalletHeaderProps) => {
  const { username } = useWallet();

  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">{username}</span>
          <Copy className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Grid2x2 className="w-[18px] h-[18px]" />
        </button>
        <button
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
};

export default WalletHeader;
