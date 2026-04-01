import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Loader2, ExternalLink } from "lucide-react";
import { validateLicense } from "@/lib/license";
import voidlarpLogo from "@/assets/voidlarp-logo.jpg";
import { toast } from "sonner";

interface LicenseInputProps {
  onActivate: ( { key: string; planType: '7days' | '1month' | 'lifetime'; activationDate: string; expirationDate: string | null }) => void;
}

const LicenseInput = ({ onActivate }: LicenseInputProps) => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!key.trim()) {
      setError("Please enter a license key");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await validateLicense(key);
      
      if (!result.valid) {
        setError(result.error || "Invalid license key");
        toast.error(result.error || "Invalid license");
        setLoading(false);
        return;
      }

      // Pass validated data to parent
      onActivate({
        key: key.trim().toUpperCase(),
        planType: result.planType!,
        activationDate: result.activationDate!,
        expirationDate: result.expirationDate ?? null,
      });
      
      toast.success('License activated!');
    } catch (err) {
      setError("Failed to activate license");
      toast.error("Failed to activate license");
      console.error('Activation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-[400px] h-screen sm:h-[850px] sm:max-w-[400px] bg-background rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center justify-center px-8"
        >
          <motion.div
            className="w-20 h-20 rounded-2xl overflow-hidden mb-6 shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <img src={voidlarpLogo} alt="Voidlarp" className="w-full h-full object-cover" />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-1">Activate Voidlarp</h1>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-[280px]">
            Enter your license key to continue. Get one at{" "}
            <a href="https://voidlarp.vercel.app" target="_blank" rel="noopener" className="text-primary hover:underline inline-flex items-center gap-0.5">
              voidlarp.vercel.app <ExternalLink className="w-3 h-3" />
            </a>
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-destructive/15 text-destructive text-xs font-medium px-3 py-2.5 rounded-xl mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="w-full relative mb-4">
            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={key}
              onChange={(e) => { setKey(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter your license key"
              className="w-full py-3.5 pl-10 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground/50 text-sm font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !key.trim()}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Activating...
              </>
            ) : (
              "Activate License"
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LicenseInput;
