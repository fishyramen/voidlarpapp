import { X, User, Settings as SettingsIcon, Check, Plus, Minus } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useState } from "react";
import phantomLogo from "@/assets/phantom-logo.png";

interface AccountOverlayProps {
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}

const AccountOverlay = ({ onClose, onOpenProfile, onOpenSettings }: AccountOverlayProps) => {
  const { username, totalBalance, cashBalance, addToBalance, removeFromBalance } = useWallet();
  const [showAddRemove, setShowAddRemove] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    addToBalance(val);
    setAmount("");
    setShowAddRemove(false);
  };

  const handleRemove = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    const success = removeFromBalance(val);
    if (!success) {
      setError("Insufficient balance");
      setTimeout(() => setError(""), 2000);
      return;
    }
    setAmount("");
    setShowAddRemove(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">@{username}</p>
            <p className="text-xs text-muted-foreground">0 followers</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile / Settings buttons */}
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

      {/* Balance Card */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowAddRemove(!showAddRemove)}
          className="w-full text-left bg-secondary rounded-2xl p-4 hover:bg-muted transition-colors"
        >
          <p className="text-xs text-muted-foreground font-medium">Total Balance</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          {cashBalance > 0 && (
            <p className="text-xs text-muted-foreground mt-1">Cash: ${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          )}
        </button>

        {showAddRemove && (
          <div className="mt-3 bg-secondary rounded-2xl p-4 space-y-3">
            {error && (
              <p className="text-xs text-destructive font-medium">{error}</p>
            )}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg font-medium">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full py-3 pl-7 pr-3 rounded-xl bg-background text-foreground text-lg font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              {[100, 500, 1000, 5000].map(a => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className="flex-1 py-2 rounded-xl bg-background text-foreground text-xs font-medium hover:bg-muted transition-colors"
                >
                  ${a.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-success text-primary-foreground font-semibold text-sm"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
              <button
                onClick={handleRemove}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm"
              >
                <Minus className="w-4 h-4" /> Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Your Accounts */}
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
