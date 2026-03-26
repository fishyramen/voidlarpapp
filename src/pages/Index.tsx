import { useState } from "react";
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
import Onboarding from "@/components/Onboarding";
import { useWallet } from "@/context/WalletContext";

const Index = () => {
  const { hasOnboarded, activeTab, setActiveTab } = useWallet();
  const [showSettings, setShowSettings] = useState(false);

  if (!hasOnboarded) return <Onboarding />;

  const renderContent = () => {
    if (showSettings) return <Settings onClose={() => setShowSettings(false)} />;

    switch (activeTab) {
      case "swap":
        return (
          <>
            <WalletHeader onOpenSettings={() => setShowSettings(true)} />
            <SwapScreen />
            <BottomNav />
          </>
        );
      case "activity":
        return (
          <>
            <WalletHeader onOpenSettings={() => setShowSettings(true)} />
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
      default:
        return (
          <>
            <WalletHeader onOpenSettings={() => setShowSettings(true)} />
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
      <div className="w-full max-w-[400px] h-[780px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
