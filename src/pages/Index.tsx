import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import WalletHeader from "@/components/WalletHeader";
import WalletBalance from "@/components/WalletBalance";
import ActionButtons from "@/components/ActionButtons";
import TokenList from "@/components/TokenList";
import BottomNav from "@/components/BottomNav";
import Settings from "@/components/Settings";
import Onboarding from "@/components/Onboarding";
import { useWallet } from "@/context/WalletContext";

const Index = () => {
  const { hasOnboarded } = useWallet();
  const [showSettings, setShowSettings] = useState(false);

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[400px] h-[780px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <Settings key="settings" onClose={() => setShowSettings(false)} />
          ) : (
            <>
              <WalletHeader onOpenSettings={() => setShowSettings(true)} />
              <WalletBalance />
              <ActionButtons />
              <TokenList />
              <BottomNav />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
