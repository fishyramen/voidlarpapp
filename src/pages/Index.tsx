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
  const { hasOnboarded, activeTab } = useWallet();
  const [overlay, setOverlay] = useState<"none" | "account" | "settings" | "profile" | "search">("none");
  const [showSplash, setShowSplash] = useState(true);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;
  if (!hasOnboarded) return <Onboarding />;

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
