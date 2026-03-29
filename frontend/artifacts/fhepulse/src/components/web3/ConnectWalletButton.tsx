import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, LogOut, Loader2 } from "lucide-react";

export function ConnectWalletButton() {
  const { isConnected, isConnecting, shortAddress, connect, disconnect, error } = useWallet();

  if (isConnecting) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button variant="default" size="sm" onClick={connect} className="gap-2">
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 font-mono">
          <Wallet className="w-4 h-4" />
          {shortAddress}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={disconnect} className="gap-2 text-destructive">
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
