import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

const WalletBalance = () => {
  const { totalBalance } = useWallet();
  const change = totalBalance * 0.0299;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center py-6"
    >
      <p className="text-muted-foreground text-sm mb-1">Total Balance</p>
      <h1 className="text-5xl font-bold tracking-tight text-foreground">
        ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </h1>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-success text-sm font-medium">+${change.toFixed(2)}</span>
        <span className="text-success text-sm">(+2.99%)</span>
      </div>
    </motion.div>
  );
};

export default WalletBalance;
