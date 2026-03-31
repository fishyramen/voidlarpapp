import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import phantomLogo from "@/assets/phantom-logo.png";
import voidlarpLogo from "@/assets/voidlarp-logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"logo" | "shatter" | "reveal" | "done">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("shatter"), 1200);
    const t2 = setTimeout(() => setPhase("reveal"), 2000);
    const t3 = setTimeout(() => setPhase("done"), 3800);
    const t4 = setTimeout(onComplete, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  // Generate shard positions for the shatter effect
  const shards = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 180 + Math.random() * 120;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: Math.random() * 360 - 180,
      scale: 0.1 + Math.random() * 0.3,
      delay: Math.random() * 0.15,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Phase 1: Purple Phantom logo appears */}
        {(phase === "logo" || phase === "shatter") && (
          <motion.div
            key="phantom-logo"
            className="absolute flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {phase === "logo" && (
              <motion.img
                src={phantomLogo}
                alt="Phantom"
                className="w-28 h-28 rounded-3xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            {phase === "shatter" && (
              <>
                {shards.map((shard, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-8 h-8 rounded-lg overflow-hidden"
                    style={{
                      background: `hsl(${260 + i * 8}, 60%, ${40 + i * 3}%)`,
                      boxShadow: "0 0 20px hsl(263 50% 50% / 0.5)",
                    }}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                    animate={{
                      x: shard.x,
                      y: shard.y,
                      scale: shard.scale,
                      opacity: 0,
                      rotate: shard.rotate,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: shard.delay,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        )}

        {/* Phase 2: VoidLarp logo pops in */}
        {(phase === "reveal" || phase === "done") && (
          <motion.div
            key="voidlarp"
            className="absolute flex flex-col items-center gap-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: phase === "done" ? 0 : 1 }}
            transition={phase === "done" 
              ? { duration: 0.4 } 
              : { type: "spring", stiffness: 300, damping: 20, delay: 0.1 }
            }
          >
            <motion.div
              className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 1.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 18, delay: 0.1 }}
              style={{ boxShadow: "0 0 60px hsl(0 0% 0% / 0.8)" }}
            >
              <img src={voidlarpLogo} alt="VoidLarp" className="w-full h-full object-cover" />
            </motion.div>
            <motion.p
              className="text-2xl font-bold tracking-widest text-foreground uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{ letterSpacing: "0.25em" }}
            >
              voidlarp
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashScreen;
