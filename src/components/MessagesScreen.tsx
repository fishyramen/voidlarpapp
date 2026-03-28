import { useWallet } from "@/context/WalletContext";
import phantomLogo from "@/assets/phantom-logo.png";

const MessagesScreen = () => {
  const { username } = useWallet();

  const trendingChats = [
    { name: "$HACHI", mc: "$5.8M MC", members: 25, avatar: "🐕" },
    { name: "umi", mc: "$318K MC", members: 17, avatar: "🐶" },
    { name: "VDOR", mc: "$12M MC", members: 15, avatar: "💎" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary">
          <img src={phantomLogo} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground leading-tight">@{username.toLowerCase()}</span>
          <span className="text-[15px] font-bold text-foreground leading-tight">Chats</span>
        </div>
      </div>

      {/* Trending */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold text-foreground mb-3">Trending</h2>
        <div className="bg-secondary rounded-2xl overflow-hidden">
          {trendingChats.map((chat, i) => (
            <div key={chat.name} className={`flex items-center justify-between py-3 px-4 ${i < trendingChats.length - 1 ? "" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                  {chat.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{chat.name}</p>
                  <p className="text-xs text-muted-foreground">{chat.mc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">👥</span>
                <span className="text-xs">{chat.members}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div className="px-4 pt-4">
        <h2 className="text-xl font-bold text-foreground mb-6">Recent</h2>
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="text-4xl mb-3 opacity-30">⚔️</div>
          <p className="text-sm text-muted-foreground">No chats to show yet.</p>
        </div>
      </div>
    </div>
  );
};

export default MessagesScreen;
