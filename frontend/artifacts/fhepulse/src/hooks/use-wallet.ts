import { useContext } from "react";
import { WalletContext } from "@/contexts/WalletContext";
import { CHAIN_CONFIG } from "@/contracts";

export function useWallet() {
  const ctx = useContext(WalletContext);
  return {
    ...ctx,
    isConnected: !!ctx.address,
    isCorrectNetwork: ctx.chainId === CHAIN_CONFIG.chainId,
    shortAddress: ctx.address
      ? `${ctx.address.slice(0, 6)}...${ctx.address.slice(-4)}`
      : null,
  };
}
