import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import phantomLogo from "@/assets/phantom-logo.png";

const Onboarding = () => {
  const { setUsername, setHasOnboarded } = useWallet();
  const [name, setName] = useState("");
  const [step, setStep] = useState(0);

  const handleCreate = () => {
    if (name.trim()) {
      setUsername(name.trim());
      setHasOnboarded(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[400px] h-[780px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl relative">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* Purple top area like real Phantom */}
              <div className="flex-1 flex flex-col items-center justify-center px-8 bg-[hsl(263,67%,58%)] rounded-b-[2rem]">
                <motion.img
                  src={phantomLogo}
                  alt="Phantom"
                  className="w-20 h-20 rounded-2xl mb-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                />
                <h1 className="text-2xl font-bold text-primary-foreground mb-1">Phantom</h1>
                <p className="text-primary-foreground/70 text-sm">A crypto wallet reimagined</p>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                >
                  Create a new wallet
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3.5 rounded-xl bg-secondary text-foreground font-semibold text-sm"
                >
                  I already have a wallet
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="username"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col p-6"
            >
              <button
                onClick={() => setStep(0)}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-8"
              >
                ←
              </button>
              <h2 className="text-2xl font-bold text-foreground mb-2">Create your account</h2>
              <p className="text-muted-foreground text-sm mb-8">Choose a username for your wallet</p>

              <label className="text-xs font-medium text-muted-foreground mb-2 block">USERNAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="@username"
                maxLength={20}
                autoFocus
                className="w-full py-3.5 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">This is how others will find you on Phantom</p>

              <div className="flex-1" />

              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30 transition-opacity"
              >
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
