import { useState, useCallback } from "react";
import WalletHeader from "@/components/WalletHeader";
import WalletBalance from "@/components/WalletBalance";
import ActionButtons from "@/components/ActionButtons";
import TokenList from "@/components/TokenList";
import BottomNav from "@/components/BottomNav";
import Settings from "@/components/Settings";
import SwapScreen from "@/components/SwapScreen";
import ActivityScreen from "@/components/ActivityScreen";
import SendScreen from "@/components/SendScreen";
import ReceiveScreen from "@/components/ReceiveScreen";
import BuyScreen from "@/components/BuyScreen";
import ExploreScreen from "@/components/ExploreScreen";
import AccountOverlay from "@/components/AccountOverlay";
import ProfileScreen from "@/components/ProfileScreen";
import SearchOverlay from "@/components/SearchOverlay";
import TokenDetail from "@/components/TokenDetail";
import Onboarding from "@/components/Onboarding";
import SplashScreen from "@/components/SplashScreen";
import { useWallet } from "@/context/WalletContext";

const Index = () => {
  const { hasOnboarded, activeTab, isLicenseValid, daysUntilExpiry } = useWallet();
  const [overlay, setOverlay] = useState<"none" | "account" | "settings" | "profile" | "search">("none");
  const [showSplash, setShowSplash] = useState(true);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;
  if (!hasOnboarded) return <Onboarding />;

  // === NEW: License expired check ===
  if (!isLicenseValid && hasOnboarded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-[400px] h-[780px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl relative p-6">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">License Expired</h2>
            <p className="text-muted-foreground mb-6">
              {daysUntilExpiry !== null && daysUntilExpiry < 0 
                ? `Your access ended ${Math.abs(daysUntilExpiry)} days ago.`
                : "Your Voidlarp access has ended."}
            </p>
            <button 
              onClick={() => window.location.href = 'https://t.me/voidlarp'}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition"
            >
              Renew License
            </button>
          </div>
        </div>
      </div>
    );
  }
  // === END NEW ===

  const renderContent = () => {
    // Token detail view (from explore)
    if (selectedToken) return (
      <TokenDetail symbol={selectedToken} onClose={() => setSelectedToken(null)} />
    );

    if (overlay === "account") return (
      <AccountOverlay
        onClose={() => setOverlay("none")}
        onOpenProfile={() => setOverlay("profile")}
        onOpenSettings={() => setOverlay("settings")}
      />
    );
    if (overlay === "settings") return <Settings onClose={() => setOverlay("none")} />;
    if (overlay === "profile") return <ProfileScreen onClose={() => setOverlay("none")} />;
    if (overlay === "search") return <SearchOverlay onClose={() => setOverlay("none")} />;

    switch (activeTab) {
      case "swap":
        return (
          <>
            <WalletHeader onOpenAccount={() => setOverlay("account")} onOpenSearch={() => setOverlay("search")} />
            <SwapScreen />
            <BottomNav />
          </>
        );
      case "activity":
        return (
          <>
            <WalletHeader onOpenAccount={() => setOverlay("account")} onOpenSearch={() => setOverlay("search")} />
            <ActivityScreen />
            <BottomNav />
          </>
        );
      case "send":
        return (
          <>
            <SendScreen />
            <BottomNav />
          </>
        );
      case "receive":
        return (
          <>
            <ReceiveScreen />
            <BottomNav />
          </>
        );
      case "buy":
        return (
          <>
            <BuyScreen />
            <BottomNav />
          </>
        );
      case "explore":
        return (
          <>
            <WalletHeader onOpenAccount={() => setOverlay("account")} onOpenSearch={() => setOverlay("search")} />
            <ExploreScreen onSelectToken={(s) => setSelectedToken(s)} />
            <BottomNav />
          </>
        );
      default:
        return (
          <>
            <WalletHeader onOpenAccount={() => setOverlay("account")} onOpenSearch={() => setOverlay("search")} />
            <WalletBalance />
            <ActionButtons />
            <TokenList />
            <BottomNav />
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[400px] h-[780px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
