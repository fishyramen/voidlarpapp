import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface ExpiredModalProps {
  daysAgo: number;
  onRenew: () => void;
  onNewKey: () => void;
}

const ExpiredModal = ({ daysAgo, onRenew, onNewKey }: ExpiredModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-[340px] bg-card rounded-3xl border border-border p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-destructive/15 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">License Expired</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {daysAgo > 0
              ? `Your access ended ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago.`
              : "Your Voidlarp license has expired."}
          </p>

          <button
            onClick={onRenew}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm mb-2 flex items-center justify-center gap-2"
          >
            Renew License <ExternalLink className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onNewKey}
            className="w-full py-3 rounded-2xl bg-secondary text-foreground font-semibold text-sm hover:bg-muted transition-colors"
          >
            Use Another License
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpiredModal;
