import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const SendScreen = () => {
  const { tokens, sendToUser, setActiveTab } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [selectedToken, setSelectedToken] = useState("SOL");
  const [amount, setAmount] = useState("");
  const [showTokenSelect, setShowTokenSelect] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = tokens.find(t => t.symbol === selectedToken);
  const maxBalance = token?.balance || 0;
  const usdValue = selectedToken === "CASH" ? parseFloat(amount) || 0 : (parseFloat(amount) || 0) * (token?.priceUsd || 0);

  const handleSend = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError("Enter an amount"); return; }
    if (!recipient.trim()) { setError("Enter a username"); return; }
    const result = sendToUser(recipient.trim(), selectedToken, val);
    if (!result.success) { setError(result.error || "Error"); return; }
    setSuccess(true);
    setTimeout(() => { setActiveTab("wallet"); setSuccess(false); }, 1500);
  };

  const allOptions = [
    { symbol: "CASH", name: "Cash Balance", balance: cashBalance, logo: "" },
    ...tokens.filter(t => t.balance > 0),
  ];

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <span className="text-success text-2xl">✓</span>
        </div>
        <p className="text-foreground font-semibold text-lg">Sent!</p>
        <p className="text-muted-foreground text-sm mt-1">Transaction complete</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={() => setActiveTab("wallet")} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">Send</h2>
      </div>

      <div className="flex-1 px-4 space-y-4 pt-2">
        {error && (
          <div className="bg-destructive/15 text-destructive text-xs font-medium px-3 py-2 rounded-lg">{error}</div>
        )}

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-2 block uppercase tracking-wide">To</label>
          <input
            value={recipient}
            onChange={(e) => { setRecipient(e.target.value); setError(""); }}
            placeholder="@username"
            className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-2 block uppercase tracking-wide">Token</label>
          <button
            onClick={() => setShowTokenSelect(!showTokenSelect)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-secondary"
          >
            <div className="flex items-center gap-2">
              {selectedToken === "CASH" ? (
                <div className="w-7 h-7 rounded-full bg-success/20 flex items-center justify-center text-success text-xs font-bold">$</div>
              ) : (
                <div className="w-7 h-7 rounded-full overflow-hidden bg-muted">
                  <img src={token?.logo} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <span className="text-sm font-medium text-foreground">{selectedToken === "CASH" ? "Cash" : selectedToken}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {showTokenSelect && (
            <div className="mt-1 bg-secondary rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {allOptions.map(o => (
                <button
                  key={o.symbol}
                  onClick={() => { setSelectedToken(o.symbol); setShowTokenSelect(false); }}
                  className="w-full flex items-center justify-between py-2.5 px-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {o.symbol === "CASH" ? (
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success text-[10px] font-bold">$</div>
                    ) : (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                        <img src={o.logo} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-sm text-foreground">{o.symbol === "CASH" ? "Cash" : o.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{o.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Amount</label>
            <button onClick={() => setAmount(String(maxBalance))} className="text-xs text-primary font-medium">Max</button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(""); }}
            placeholder="0"
            className="w-full py-3 px-4 rounded-xl bg-secondary text-foreground text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">≈ ${usdValue.toFixed(2)} • Balance: {maxBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleSend}
          disabled={!amount || !recipient.trim()}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30 transition-opacity"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SendScreen;
