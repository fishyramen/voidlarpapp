import { motion } from "framer-motion";

const tokens = [
  { symbol: "SOL", name: "Solana", balance: "12.4821", value: "$2,156.40", change: "+3.42%", positive: true, color: "from-[hsl(269,97%,60%)] to-[hsl(200,90%,50%)]" },
  { symbol: "USDC", name: "USD Coin", balance: "1,250.00", value: "$1,250.00", change: "+0.01%", positive: true, color: "from-[hsl(210,80%,50%)] to-[hsl(210,90%,40%)]" },
  { symbol: "BONK", name: "Bonk", balance: "24,500,000", value: "$612.50", change: "-1.23%", positive: false, color: "from-[hsl(35,90%,55%)] to-[hsl(20,85%,50%)]" },
  { symbol: "RAY", name: "Raydium", balance: "45.20", value: "$162.72", change: "+5.67%", positive: true, color: "from-[hsl(280,80%,55%)] to-[hsl(320,80%,50%)]" },
  { symbol: "JTO", name: "Jito", balance: "32.00", value: "$100.01", change: "-0.45%", positive: false, color: "from-[hsl(142,60%,45%)] to-[hsl(160,70%,40%)]" },
];

const TokenList = () => {
  return (
    <div className="flex-1 px-4">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-semibold text-foreground">Tokens</h2>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Manage</button>
      </div>
      <div className="space-y-1">
        {tokens.map((token, i) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${token.color} flex items-center justify-center text-xs font-bold text-primary-foreground`}>
                {token.symbol.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{token.name}</p>
                <p className="text-xs text-muted-foreground">{token.balance} {token.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{token.value}</p>
              <p className={`text-xs font-medium ${token.positive ? "text-success" : "text-destructive"}`}>
                {token.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
