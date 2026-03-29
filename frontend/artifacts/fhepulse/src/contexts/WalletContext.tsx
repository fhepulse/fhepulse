import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { CHAIN_CONFIG } from "@/contracts";

interface WalletState {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

export const WalletContext = createContext<WalletState>({
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  isConnecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEthereum = () => {
    if (typeof window !== "undefined" && window.ethereum) return window.ethereum;
    return null;
  };

  const setupProvider = useCallback(async (ethereum: any) => {
    const bp = new BrowserProvider(ethereum);
    const s = await bp.getSigner();
    const addr = await s.getAddress();
    const network = await bp.getNetwork();

    setProvider(bp);
    setSigner(s);
    setAddress(addr);
    setChainId(Number(network.chainId));
    setError(null);
  }, []);

  const connect = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setError("No wallet found. Please install MetaMask.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      await setupProvider(ethereum);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [setupProvider]);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setError(null);
  }, []);

  const switchNetwork = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const chainHex = "0x" + CHAIN_CONFIG.chainId.toString(16);

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainHex }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainHex,
              chainName: CHAIN_CONFIG.chainName,
              rpcUrls: [CHAIN_CONFIG.rpcUrl],
              blockExplorerUrls: [CHAIN_CONFIG.blockExplorerUrl],
              nativeCurrency: CHAIN_CONFIG.nativeCurrency,
            },
          ],
        });
      }
    }
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (address) {
        setupProvider(ethereum);
      }
    };

    const handleChainChanged = () => {
      if (address) {
        setupProvider(ethereum);
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [address, disconnect, setupProvider]);

  // Auto-reconnect if previously connected
  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) {
        setupProvider(ethereum);
      }
    });
  }, [setupProvider]);

  return (
    <WalletContext.Provider
      value={{ provider, signer, address, chainId, isConnecting, error, connect, disconnect, switchNetwork }}
    >
      {children}
    </WalletContext.Provider>
  );
}
