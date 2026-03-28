import { useWallet } from "@/context/WalletContext";
import { MoreHorizontal, X } from "lucide-react";
import phantomLogo from "@/assets/phantom-logo.png";

const CashScreen = () => {
  const { username, cashBalance, tokens, setActiveTab } = useWallet();

  const hasTokensToSell = tokens.some(t => t.balance > 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
            <span className="text-foreground font-bold text-sm">{username.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground leading-tight">@{username.toLowerCase()}</span>
            <span className="text-[15px] font-bold text-foreground leading-tight">Cash</span>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Balance section */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Balance</p>
            <h1 className="text-4xl font-bold text-foreground">
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
          </div>
          {/* Card visual */}
          <div className="w-28 h-18 rounded-xl bg-gradient-to-br from-purple-300/30 via-green-200/20 to-pink-200/20 border border-border/30 flex items-end justify-end p-2 overflow-hidden relative">
            <div className="absolute top-2 left-2">
              <span className="text-foreground/40 text-lg">👻</span>
            </div>
            <span className="text-[8px] text-muted-foreground/60 font-medium">DEBIT VISA</span>
          </div>
        </div>
      </div>

      {/* Add cash section */}
      <div className="px-4 pb-4">
        <h2 className="text-xl font-bold text-foreground mb-3">Add cash</h2>
        <div className="bg-secondary rounded-2xl p-4">
          <div className="flex items-center gap-[-8px] mb-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-lg -mr-2 z-10">🐕</div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-lg -mr-2 z-[5]">💲</div>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg">◎</div>
          </div>
          <p className="text-base font-semibold text-muted-foreground mb-1">Quick Sell Crypto</p>
          <p className="text-sm text-muted-foreground/70 mb-3">Instant · No fees on stablecoins</p>
          {hasTokensToSell ? (
            <button
              onClick={() => setActiveTab("buy")}
              className="px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-medium"
            >
              Sell tokens
            </button>
          ) : (
            <span className="inline-block px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-xs font-medium">
              No tokens to sell
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashScreen;
