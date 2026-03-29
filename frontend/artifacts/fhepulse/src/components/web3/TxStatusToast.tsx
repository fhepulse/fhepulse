import { toast } from "sonner";
import { CHAIN_CONFIG } from "@/contracts";
import type { TransactionResponse } from "ethers";

export async function showTxToast(
  txPromise: Promise<TransactionResponse>,
  description: string,
) {
  const toastId = toast.loading(`${description}...`);

  try {
    const tx = await txPromise;
    const explorerUrl = `${CHAIN_CONFIG.blockExplorerUrl}/tx/${tx.hash}`;

    toast.loading(`Waiting for confirmation...`, { id: toastId });

    await tx.wait();

    toast.success(description, {
      id: toastId,
      description: "Transaction confirmed",
      action: {
        label: "View",
        onClick: () => window.open(explorerUrl, "_blank"),
      },
    });

    return tx;
  } catch (err: any) {
    const reason = err?.reason || err?.message || "Transaction failed";
    toast.error(description, {
      id: toastId,
      description: reason,
    });
    throw err;
  }
}
