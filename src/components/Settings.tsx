import { useState } from "react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

interface SettingsProps {
  onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
  const { username, setUsername, totalBalance, cashBalance, setCashBalance, tokens, setTokens } = useWallet();
  const [amount, setAmount] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(username);

  const handleAdd = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    setCashBalance(prev => prev + val);
    setAmount("");
  };

  const handleRemove = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    setCashBalance(prev => Math.max(0, prev - val));
    setAmount("");
  };

  const handleSaveName = () => {
    if (newName.trim()) {
      setUsername(newName.trim());
      setEditingName(false);
    }
  };

  const presetAmounts = [100, 500, 1000, 5000];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6">
        {/* Username */}
        <div className="bg-secondary rounded-2xl p-4">
          <label className="text-xs text-muted-foreground font-medium mb-2 block uppercase tracking-wide">Username</label>
          {editingName ? (
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 py-2 px-3 rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                maxLength={20}
              />
              <button onClick={handleSaveName} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">Save</button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">{username}</span>
              <button onClick={() => setEditingName(true)} className="text-xs text-primary font-medium">Edit</button>
            </div>
          )}
        </div>

        {/* Manage Balance */}
        <div className="bg-secondary rounded-2xl p-4 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Practice Balance</label>
            <p className="text-2xl font-bold text-foreground mt-1">${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-muted-foreground mt-1">Add money to your balance, then use Buy or Swap to get crypto tokens.</p>
          </div>

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
            {presetAmounts.map(a => (
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

        {/* Holdings */}
        <div className="bg-secondary rounded-2xl p-4">
          <label className="text-xs text-muted-foreground font-medium mb-3 block uppercase tracking-wide">Holdings</label>
          <div className="space-y-2.5">
            {tokens.map(t => {
              const value = t.balance * t.priceUsd;
              if (value < 0.01) return null;
              return (
                <div key={t.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                      <img src={t.logo} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-foreground">{t.symbol}</span>
                  </div>
                  <span className="text-sm text-foreground font-medium">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              );
            })}
            {cashBalance > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success text-xs font-bold">$</div>
                  <span className="text-sm text-foreground">Cash</span>
                </div>
                <span className="text-sm text-foreground font-medium">${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-sm font-semibold text-foreground">${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="w-full py-3 rounded-xl border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
        >
          Reset Wallet
        </button>
      </div>
    </div>
  );
};

export default Settings;
