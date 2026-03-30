import { ArrowLeft } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import phantomLogo from "@/assets/phantom-logo.png";
import { useState } from "react";

interface ProfileScreenProps {
  onClose: () => void;
}

const ProfileScreen = ({ onClose }: ProfileScreenProps) => {
  const { username, totalBalance, transactions } = useWallet();
  const [copied, setCopied] = useState(false);

  const tradeVolume = transactions.reduce((sum, tx) => sum + tx.value, 0);

  const handleShare = () => {
    navigator.clipboard.writeText(`@${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-bold text-foreground">@{username}</span>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Trade Volume</p>
              <p className="text-base font-bold text-foreground">${tradeVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Followers</p>
              <p className="text-base font-bold text-foreground">0</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Following</p>
              <p className="text-base font-bold text-foreground">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 px-4 pb-6">
        <button className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm">
          Edit Profile
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-2xl bg-secondary text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          {copied ? "Copied!" : "Share Profile"}
        </button>
      </div>

      <div className="px-4 flex-1">
        <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-4xl mb-3">🎊</p>
            <p className="text-sm text-muted-foreground">No activity to show yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 10).map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-secondary">
                <span className="text-sm text-foreground capitalize">{tx.type} {tx.fromToken || tx.toToken}</span>
                <span className="text-sm font-medium text-foreground">${tx.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
