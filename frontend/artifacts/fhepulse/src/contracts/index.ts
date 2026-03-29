import PollFactoryAbi from "./abis/PollFactory.json";
import PollAbi from "./abis/Poll.json";

export { PollFactoryAbi, PollAbi };

export const CHAIN_CONFIG = {
  chainId: Number(import.meta.env.VITE_CHAIN_ID) || 11155111,
  chainName: import.meta.env.VITE_CHAIN_NAME || "Ethereum Sepolia",
  rpcUrl: import.meta.env.VITE_RPC_URL || "https://ethereum-sepolia.publicnode.com",
  blockExplorerUrl: import.meta.env.VITE_EXPLORER_URL || "https://sepolia.etherscan.io",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
};

export const POLL_FACTORY_ADDRESS = import.meta.env.VITE_POLL_FACTORY_ADDRESS || "";
