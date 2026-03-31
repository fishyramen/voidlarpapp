import { X, User, Settings as SettingsIcon, Check, Copy } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useState } from "react";
import phantomLogo from "@/assets/phantom-logo.png";

interface AccountOverlayProps {
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

const AccountOverlay = ({ onClose, onOpenProfile, onOpenSettings }: AccountOverlayProps) => {
  const { username, totalBalance } = useWallet();
  const [copied, setCopied] = useState(false);

  const walletAddress = "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">@{username}</p>
            <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              {walletAddress}
              {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-3 px-4 pb-4">
        <button
          onClick={onOpenProfile}
          className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-secondary hover:bg-muted transition-colors"
        >
          <User className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-foreground">Profile</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-secondary hover:bg-muted transition-colors"
        >
          <SettingsIcon className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-foreground">Settings</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-secondary rounded-2xl p-4">
          <p className="text-xs text-muted-foreground font-medium">Total Balance</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="px-4 flex-1">
        <h3 className="text-lg font-bold text-foreground mb-3">Your Accounts</h3>
        <div className="bg-secondary rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center relative">
              <span className="text-sm font-bold text-foreground">A1</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{username}</p>
              <p className="text-xs text-muted-foreground">${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverlay;
