import { ArrowLeft, Copy, Check } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useState } from "react";
import phantomLogo from "@/assets/phantom-logo.png";

const ReceiveScreen = () => {
  const { username, setActiveTab } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={() => setActiveTab("wallet")} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Receive</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-48 h-48 rounded-3xl bg-secondary flex items-center justify-center mb-6 border border-border">
          <div className="flex flex-col items-center gap-3">
            <img src={phantomLogo} alt="Phantom" className="w-16 h-16 rounded-2xl" />
            <span className="text-foreground font-semibold text-lg">@{username}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm text-center mb-4">
          Share your username with others so they can send you crypto or cash.
        </p>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Username"}
        </button>
      </div>
    </div>
  );
};

export default ReceiveScreen;
