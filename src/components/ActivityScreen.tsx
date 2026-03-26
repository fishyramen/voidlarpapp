import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const ActivityScreen = () => {
  const { transactions } = useWallet();

  const getIcon = (type: string) => {
    switch (type) {
      case "send": return <ArrowUpRight className="w-4 h-4" />;
      case "receive": return <ArrowDownLeft className="w-4 h-4" />;
      case "swap": return <ArrowLeftRight className="w-4 h-4" />;
      default: return null;
    }
  };

  const getLabel = (tx: typeof transactions[0]) => {
    switch (tx.type) {
      case "send": return `Sent ${tx.fromToken || ""}`;
      case "receive": return `Received ${tx.toToken || ""}`;
      case "swap": return `Swapped ${tx.fromToken} → ${tx.toToken}`;
      default: return "";
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-2 overflow-y-auto">
      <h2 className="text-lg font-semibold text-foreground text-center mb-4">Activity</h2>

      {transactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
            <ArrowLeftRight className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">No activity yet</p>
          <p className="text-sm text-muted-foreground">Your transactions will appear here. Try swapping some tokens!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  tx.type === "send" ? "bg-destructive/15 text-destructive" :
                  tx.type === "receive" ? "bg-success/15 text-success" :
                  "bg-primary/15 text-primary"
                }`}>
                  {getIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{getLabel(tx)}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(tx.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${tx.type === "receive" ? "text-success" : "text-foreground"}`}>
                  {tx.type === "receive" ? "+" : tx.type === "send" ? "-" : ""}${tx.value.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityScreen;
