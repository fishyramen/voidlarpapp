import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const Onboarding = () => {
  const { setUsername, completeOnboarding } = useWallet();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = () => {
    if (!name.trim() || !password) { setError("Fill in all fields"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    setUsername(name.trim());
    completeOnboarding();
  };

  const handleLogin = () => {
    if (!name.trim() || !password) { setError("Fill in all fields"); return; }
    setUsername(name.trim());
    completeOnboarding();
  };

  const switchMode = (newStep: number) => {
    setStep(newStep);
    setError("");
    setName("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[400px] h-screen sm:h-[850px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl relative">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <div key="welcome" className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center px-8">
                <img src="https://i.ibb.co/Xrn213KZ/larp.jpg" alt="Voidlarp" className="w-32 h-32 rounded-3xl object-cover mb-6" />
              </div>
              <div className="p-6 space-y-3">
                <button onClick={() => switchMode(1)} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">Create a new wallet</button>
                <button onClick={() => switchMode(2)} className="w-full py-3.5 rounded-2xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors">I already have a wallet</button>
              </div>
            </div>
          )}
          {(step === 1 || step === 2) && (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col p-6">
              <button onClick={() => switchMode(0)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-2xl font-bold text-foreground mb-1">{step === 1 ? "Create your wallet" : "Welcome back"}</h2>
              <p className="text-muted-foreground text-sm mb-6">{step === 1 ? "Choose a username and password" : "Log in to your wallet"}</p>
              
              {error && <div className="bg-destructive/15 text-destructive text-xs font-medium px-3 py-2.5 rounded-xl mb-4 text-center">{error}</div>}
              
              <label className="text-xs font-medium text-muted-foreground mb-2 block">USERNAME</label>
              <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="@username" maxLength={20} autoFocus
                className="w-full py-3.5 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary mb-4" />
              
              <label className="text-xs font-medium text-muted-foreground mb-2 block">PASSWORD</label>
              <div className="relative mb-2">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && (step === 1 ? handleSignUp() : handleLogin())} placeholder="••••••••"
                  className="w-full py-3.5 px-4 pr-12 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex-1" />
              
              <button onClick={step === 1 ? handleSignUp : handleLogin} disabled={!name.trim() || !password}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30 hover:opacity-90 transition-opacity">
                {step === 1 ? "Create Wallet" : "Log In"}
              </button>
              
              <button onClick={() => switchMode(step === 1 ? 2 : 1)} className="w-full py-2 text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors">
                {step === 1 ? "Already have a wallet? Log in" : "Don't have a wallet? Create one"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
