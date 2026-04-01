import { useState } from "react";
import { ArrowLeft, X, Search, ChevronRight, Users, SlidersHorizontal, Shield, Globe, Smile, Layers, Code, HelpCircle, Heart, LogOut, Moon, Sun, Bell, Lock, Key, Eye, Fingerprint, Wifi, WifiOff, ToggleLeft, ToggleRight, CreditCard, AlertTriangle } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { getPlanLabel } from "@/lib/license";
import phantomLogo from "@/assets/phantom-logo.png";
import { toast } from "sonner";

interface SettingsProps {
  onClose: () => void;
}

type SettingsView = "main" | "preferences" | "security" | "networks" | "addressBook" | "connectedApps" | "developer" | "license";

const Settings = ({ onClose }: SettingsProps) => {
  const { username, logout, license, daysUntilExpiry, clearLicense } = useWallet();
  const [view, setView] = useState<SettingsView>("main");
  const [search, setSearch] = useState("");
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const { currency, setCurrency } = useWallet();
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [autoLock, setAutoLock] = useState("5 minutes");
  const [biometrics, setBiometrics] = useState(false);
  const [txConfirmation, setTxConfirmation] = useState(true);
  const [networks, setNetworks] = useState([
    { name: "Solana", enabled: true },
    { name: "Ethereum", enabled: true },
    { name: "Polygon", enabled: true },
    { name: "Bitcoin", enabled: true },
    { name: "Base", enabled: false },
    { name: "Arbitrum", enabled: false },
    { name: "Avalanche", enabled: false },
  ]);

  const toggleNetwork = (idx: number) => {
    setNetworks(prev => prev.map((n, i) => i === idx ? { ...n, enabled: !n.enabled } : n));
  };
  const enabledCount = networks.filter(n => n.enabled).length;

  const SubHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
      <button onClick={onBack} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></button>
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
    </div>
  );

  if (view === "preferences") {
    return (
      <div className="flex flex-col h-full">
        <SubHeader title="Preferences" onBack={() => setView("main")} />
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
          <SettingToggle label="Dark Mode" icon={darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />} enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          <SettingToggle label="Notifications" icon={<Bell className="w-5 h-5 text-primary" />} enabled={notifications} onToggle={() => setNotifications(!notifications)} />
          <SettingToggle label="Hide Small Balances" icon={<Eye className="w-5 h-5 text-primary" />} enabled={hideSmallBalances} onToggle={() => setHideSmallBalances(!hideSmallBalances)} />
          <SettingSelect label="Currency" value={currency} options={["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]} onChange={setCurrency} />
          <SettingSelect label="Language" value={language} options={["English", "Spanish", "French", "German", "Japanese", "Chinese"]} onChange={setLanguage} />
        </div>
      </div>
    );
  }

  if (view === "security") {
    return (
      <div className="flex flex-col h-full">
        <SubHeader title="Security & Privacy" onBack={() => setView("main")} />
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
          <SettingToggle label="Biometric Unlock" icon={<Fingerprint className="w-5 h-5 text-primary" />} enabled={biometrics} onToggle={() => setBiometrics(!biometrics)} />
          <SettingToggle label="Transaction Confirmation" icon={<Lock className="w-5 h-5 text-primary" />} enabled={txConfirmation} onToggle={() => setTxConfirmation(!txConfirmation)} />
          <SettingSelect label="Auto-Lock Timer" value={autoLock} options={["1 minute", "5 minutes", "15 minutes", "1 hour", "Never"]} onChange={setAutoLock} />
          <div className="bg-secondary rounded-2xl p-4 mt-4">
            <button className="w-full flex items-center gap-3">
              <Key className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground flex-1 text-left">Change Password</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="bg-secondary rounded-2xl p-4">
            <button className="w-full flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground flex-1 text-left">Show Recovery Phrase</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "networks") {
    return (
      <div className="flex flex-col h-full">
        <SubHeader title="Active Networks" onBack={() => setView("main")} />
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
          {networks.map((net, idx) => (
            <div key={net.name} className="bg-secondary rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {net.enabled ? <Wifi className="w-5 h-5 text-success" /> : <WifiOff className="w-5 h-5 text-muted-foreground" />}
                <span className="text-sm font-medium text-foreground">{net.name}</span>
              </div>
              <button onClick={() => toggleNetwork(idx)}>
                {net.enabled ? <ToggleRight className="w-6 h-6 text-primary" /> : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "addressBook") {
    return (
      <div className="flex flex-col h-full">
        <SubHeader title="Address Book" onBack={() => setView("main")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Smile className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground text-center">No saved addresses yet.</p>
        </div>
      </div>
    );
  }

  if (view === "connectedApps") {
    return (
      <div className="flex flex-col h-full">
        <SubHeader title="Connected Apps" onBack={() => setView("main")} />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Layers className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground text-center">No connected apps.</p>
        </div>
      </div>
    );
  }

  if (view === "developer") {
    return (
      <div className="flex flex-col h-full">
        <SubHeader title="Developer Settings" onBack={() => setView("main")} />
        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
          <div className="bg-secondary rounded-2xl p-4">
            <p className="text-sm font-medium text-foreground mb-1">Testnet Mode</p>
            <p className="text-xs text-muted-foreground">Enable testnet networks for development</p>
          </div>
          <div className="bg-secondary rounded-2xl p-4">
            <p className="text-sm font-medium text-foreground mb-1">RPC Endpoint</p>
            <p className="text-xs text-muted-foreground break-all">https://api.mainnet-beta.solana.com</p>
          </div>
          <div className="bg-secondary rounded-2xl p-4">
            <p className="text-sm font-medium text-foreground mb-1">Version</p>
            <p className="text-xs text-muted-foreground">Voidlarp v1.0.0</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === "license") {
    return (
      <div className="flex flex-col h-full">
        <SubHeader title="License" onBack={() => setView("main")} />
        <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-6">
          {license ? (
            <>
              <div className="bg-secondary rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-foreground font-semibold">{getPlanLabel(license.planType)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-success font-medium">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Activated</span>
                  <span className="text-foreground">{new Date(license.activationDate).toLocaleDateString()}</span>
                </div>
                {license.expirationDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="text-foreground">{new Date(license.expirationDate).toLocaleDateString()}</span>
                  </div>
                )}
                {daysUntilExpiry !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days Remaining</span>
                    <span className={`font-semibold ${daysUntilExpiry <= 3 ? "text-warning" : "text-success"}`}>
                      {daysUntilExpiry}
                    </span>
                  </div>
                )}
                {daysUntilExpiry === null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-success font-semibold">∞ Forever</span>
                  </div>
                )}
              </div>
              <div className="bg-secondary rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">License Key</p>
                <p className="text-xs text-foreground font-mono break-all">{license.key}</p>
              </div>
              <button
                onClick={() => setShowDeactivateConfirm(true)}
                className="w-full py-3 rounded-2xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Deactivate License
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CreditCard className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No active license</p>
            </div>
          )}
        </div>

        {/* Deactivation Confirmation Modal */}
        {showDeactivateConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Deactivate License?</h3>
              </div>
              
              <p className="text-muted-foreground text-sm mb-6">
                You will lose access to Voidlarp and your fake balances will be reset. 
                You can reactivate anytime with a new key from voidlarp.vercel.app.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="flex-1 py-2.5 px-4 bg-secondary hover:bg-secondary/80 rounded-xl font-medium transition text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeactivateConfirm(false);
                    clearLicense();
                    toast.success('License deactivated');
                  }}
                  className="flex-1 py-2.5 px-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-medium transition"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main settings view
  const menuSections = [
    {
      items: [
        { icon: <Users className="w-5 h-5 text-primary" />, label: "Manage Accounts", badge: "1", onClick: () => {} },
        { icon: <SlidersHorizontal className="w-5 h-5 text-primary" />, label: "Preferences", onClick: () => setView("preferences") },
        { icon: <Shield className="w-5 h-5 text-primary" />, label: "Security & Privacy", onClick: () => setView("security") },
      ],
    },
    {
      items: [
        { icon: <Globe className="w-5 h-5 text-primary" />, label: "Active Networks", badge: enabledCount === networks.length ? "All" : `${enabledCount}`, onClick: () => setView("networks") },
        { icon: <Smile className="w-5 h-5 text-primary" />, label: "Address Book", onClick: () => setView("addressBook") },
        { icon: <Layers className="w-5 h-5 text-primary" />, label: "Connected Apps", onClick: () => setView("connectedApps") },
      ],
    },
    {
      items: [
        { icon: <CreditCard className="w-5 h-5 text-primary" />, label: "License", badge: license ? getPlanLabel(license.planType) : "None", onClick: () => setView("license") },
        { icon: <Code className="w-5 h-5 text-primary" />, label: "Developer Settings", onClick: () => setView("developer") },
      ],
    },
    {
      items: [
        { icon: <HelpCircle className="w-5 h-5 text-primary" />, label: "Help & Support", onClick: () => {} },
        { icon: <Heart className="w-5 h-5 text-primary" />, label: "Invite your friends", onClick: () => {} },
      ],
    },
  ];

  const filteredSections = search
    ? [{ items: menuSections.flatMap(s => s.items).filter(i => i.label.toLowerCase().includes(search.toLowerCase())) }]
    : menuSections;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1" />
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="bg-secondary rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-base font-medium text-foreground flex-1">@{username}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-6">
        {filteredSections.map((section, si) => (
          <div key={si} className="bg-secondary rounded-2xl overflow-hidden divide-y divide-border">
            {section.items.map((item, ii) => (
              <button key={ii} onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors">
                {item.icon}
                <span className="text-sm font-medium text-foreground flex-1 text-left">{item.label}</span>
                {item.badge && <span className="text-xs text-muted-foreground mr-1">{item.badge}</span>}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        ))}

        <button onClick={logout}
          className="w-full py-3.5 rounded-2xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
};

const SettingToggle = ({ label, icon, enabled, onToggle }: { label: string; icon: React.ReactNode; enabled: boolean; onToggle: () => void }) => (
  <div className="bg-secondary rounded-2xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
    <button onClick={onToggle}>
      {enabled ? <ToggleRight className="w-6 h-6 text-primary" /> : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
    </button>
  </div>
);

const SettingSelect = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-secondary rounded-2xl p-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{value}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-1">
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-xl text-sm transition-colors ${opt === value ? "bg-primary/20 text-primary font-medium" : "text-foreground hover:bg-muted"}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Settings;
