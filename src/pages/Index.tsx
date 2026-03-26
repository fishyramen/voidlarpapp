import WalletHeader from "@/components/WalletHeader";
import WalletBalance from "@/components/WalletBalance";
import ActionButtons from "@/components/ActionButtons";
import TokenList from "@/components/TokenList";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[400px] h-[780px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl">
        <WalletHeader />
        <WalletBalance />
        <ActionButtons />
        <TokenList />
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;
