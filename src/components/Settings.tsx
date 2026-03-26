import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, DollarSign } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

interface SettingsProps {
  onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
  const { username, setUsername, tokens, setTokens, totalBalance, addFunds, removeFunds } = useWallet();
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("SOL");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(username);

  const handleAdd = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    setTokens(prev => prev.map(t =>
      t.symbol === selectedToken ? { ...t, balance: t.balance + val / t.priceUsd } : t
    ));
    setAmount("");
  };

  const handleRemove = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    setTokens(prev => prev.map(t =>
      t.symbol === selectedToken ? { ...t, balance: Math.max(0, t.balance - val / t.priceUsd) } : t
    ));
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-6 pb-6">
        {/* Username */}
        <div className="bg-secondary rounded-xl p-4">
          <label className="text-xs text-muted-foreground font-medium mb-2 block">Username</label>
          {editingName ? (
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 py-2 px-3 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={20}
              />
              <button onClick={handleSaveName} className="px-3 py-2 rounded-lg phantom-gradient text-primary-foreground text-xs font-semibold">Save</button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">{username}</span>
              <button onClick={() => setEditingName(true)} className="text-xs text-primary font-medium">Edit</button>
            </div>
          )}
        </div>

        {/* Add/Remove Funds */}
        <div className="bg-secondary rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <label className="text-xs text-muted-foreground font-medium">Manage Funds (Practice Mode)</label>
          </div>

          <p className="text-xs text-muted-foreground">Add or remove simulated funds to practice trading and learn about crypto.</p>

          {/* Token selector */}
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full py-2.5 px-3 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {tokens.map(t => (
              <option key={t.symbol} value={t.symbol}>{t.name} ({t.symbol})</option>
            ))}
          </select>

          {/* Amount input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full py-2.5 pl-7 pr-3 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Preset amounts */}
          <div className="flex gap-2">
            {presetAmounts.map(a => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className="flex-1 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-medium hover:border-primary transition-colors"
              >
                ${a.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(var(--success))] text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
            <button
              onClick={handleRemove}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Minus className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>

        {/* Current Balance */}
        <div className="bg-secondary rounded-xl p-4">
          <label className="text-xs text-muted-foreground font-medium mb-3 block">Current Holdings</label>
          <div className="space-y-2">
            {tokens.map(t => {
              const value = t.balance * t.priceUsd;
              if (value < 0.01) return null;
              return (
                <div key={t.symbol} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <img src={t.logo} alt={t.name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-foreground">{t.symbol}</span>
                  </div>
                  <span className="text-sm text-foreground font-medium">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-sm font-semibold text-foreground">${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="w-full py-3 rounded-xl border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
        >
          Reset Wallet
        </button>
      </div>
    </motion.div>
  );
};

export default Settings;
