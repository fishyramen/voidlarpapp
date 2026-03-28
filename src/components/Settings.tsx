import { useState } from "react";
import { X, Search, ChevronRight, Users, SlidersHorizontal, Shield, Globe, Smile, Layers, Code, HelpCircle, Heart, Plus, Minus, LogOut } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import phantomLogo from "@/assets/phantom-logo.png";

interface SettingsProps {
  onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
  const { username, cashBalance, setCashBalance, tokens, totalBalance, logout } = useWallet();
  const [showManage, setShowManage] = useState(false);
  const [amount, setAmount] = useState("");

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

  const presetAmounts = [100, 500, 1000, 5000];

  if (showManage) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h1 className="text-xl font-bold text-foreground">Manage Cash</h1>
          <button onClick={() => setShowManage(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6">
          <div className="bg-secondary rounded-2xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">Cash Balance</p>
            <p className="text-3xl font-bold text-foreground">${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg font-medium">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full py-3 pl-7 pr-3 rounded-xl bg-secondary text-foreground text-lg font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            {presetAmounts.map(a => (
              <button key={a} onClick={() => setAmount(String(a))} className="flex-1 py-2 rounded-xl bg-secondary text-foreground text-xs font-medium hover:bg-muted transition-colors">
                ${a.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-success text-primary-foreground font-semibold text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
            <button onClick={handleRemove} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm">
              <Minus className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuSections = [
    {
      items: [
        { icon: Users, label: "Manage Accounts", value: "1" },
        { icon: SlidersHorizontal, label: "Preferences" },
        { icon: Shield, label: "Security & Privacy" },
      ]
    },
    {
      items: [
        { icon: Globe, label: "Active Networks", value: "All" },
        { icon: Smile, label: "Address Book" },
        { icon: Layers, label: "Connected Apps" },
      ]
    },
    {
      items: [
        { icon: Code, label: "Developer Settings" },
      ]
    },
    {
      items: [
        { icon: HelpCircle, label: "Help & Support" },
        { icon: Heart, label: "Invite your friends" },
      ]
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-6">
        {/* Search */}
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>

        {/* Profile card */}
        <button onClick={() => setShowManage(true)} className="w-full bg-secondary rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            <img src={phantomLogo} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-foreground flex-1 text-left">@{username}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Menu sections */}
        {menuSections.map((section, si) => (
          <div key={si} className="bg-secondary rounded-2xl overflow-hidden">
            {section.items.map((item, ii) => (
              <div key={item.label} className={`flex items-center justify-between py-3.5 px-4 ${ii < section.items.length - 1 ? "border-b border-border/30" : ""}`}>
                <div className="flex items-center gap-3">
                  <item.icon className="w-4.5 h-4.5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-xs text-muted-foreground">{item.value}</span>}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
