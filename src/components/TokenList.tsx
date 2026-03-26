import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

const TokenList = () => {
  const { tokens } = useWallet();

  return (
    <div className="flex-1 px-4 overflow-y-auto">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-semibold text-foreground">Tokens</h2>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Manage</button>
      </div>
      <div className="space-y-1">
        {tokens.map((token, i) => {
          const value = token.balance * token.priceUsd;
          if (value < 0.01) return null;
          return (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={token.logo}
                  alt={token.name}
                  className="w-10 h-10 rounded-full bg-secondary"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{token.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {token.balance < 1 ? token.balance.toFixed(5) : token.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} {token.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <p className={`text-xs font-medium ${token.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {token.change >= 0 ? "+" : ""}{token.change.toFixed(2)}%
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenList;
