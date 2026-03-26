import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import phantomLogo from "@/assets/phantom-logo.png";

const Onboarding = () => {
  const { setUsername, setHasOnboarded } = useWallet();
  const [name, setName] = useState("");
  const [step, setStep] = useState(0);

  const handleContinue = () => {
    if (step === 0) {
      setStep(1);
    } else if (name.trim()) {
      setUsername(name.trim());
      setHasOnboarded(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[400px] h-[780px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col items-center justify-center shadow-2xl px-8">
        {step === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden phantom-glow">
              <img src={phantomLogo} alt="Phantom" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome to Phantom</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A friendly crypto wallet built for learning. Explore tokens, manage your portfolio, and understand how crypto works.
            </p>
            <button
              onClick={handleContinue}
              className="w-full py-3.5 rounded-xl phantom-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center text-center gap-6 w-full"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={phantomLogo} alt="Phantom" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose a Username</h2>
              <p className="text-muted-foreground text-sm">This is how you'll appear in the wallet</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              placeholder="Enter your username"
              maxLength={20}
              className="w-full py-3 px-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleContinue}
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-xl phantom-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Continue
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
