import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Plus } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  { icon: ArrowUpRight, label: "Send" },
  { icon: ArrowDownLeft, label: "Receive" },
  { icon: ArrowLeftRight, label: "Swap" },
  { icon: Plus, label: "Buy" },
];

const ActionButtons = () => {
  return (
    <div className="flex justify-center gap-5 px-5 pb-4">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-primary hover:phantom-gradient hover:text-primary-foreground transition-all duration-200">
            <action.icon className="w-5 h-5" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ActionButtons;
