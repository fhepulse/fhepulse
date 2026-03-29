import { useWallet } from "@/hooks/use-wallet";
import { CHAIN_CONFIG } from "@/contracts";

export function NetworkBadge() {
  const { isConnected, isCorrectNetwork, chainId, switchNetwork } = useWallet();

  if (!isConnected) return null;

  if (!isCorrectNetwork) {
    return (
      <button
        onClick={switchNetwork}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        Wrong Network
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      {CHAIN_CONFIG.chainName}
    </div>
  );
}
