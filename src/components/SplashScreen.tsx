import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import voidlarpLogo from "@/assets/voidlarp-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Show logo immediately
    setShowLogo(true);
    
    // Complete after 1.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      {/* Logo and Title */}
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="w-24 h-24 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <img src={voidlarpLogo} alt="Voidlarp" className="w-full h-full object-cover" />
        </motion.div>
        
        {/* Title - Phantom-style font */}
        <motion.h1
          className="text-3xl font-bold text-foreground tracking-widest uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Voidlarp
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
