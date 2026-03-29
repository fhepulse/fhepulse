import { useState, useEffect, useCallback } from "react";
import { useWallet } from "./use-wallet";

let cofheInitialized = false;
let cofheModule: any = null;

export function useCofhe() {
  const { signer, isConnected } = useWallet();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isConnected || !signer) {
      setIsReady(false);
      return;
    }

    const init = async () => {
      try {
        if (!cofheModule) {
          cofheModule = await import("cofhejs/web");
        }
        if (!cofheInitialized) {
          await cofheModule.cofhejs.initialize({ signer });
          cofheInitialized = true;
        }
        setIsReady(true);
      } catch (err) {
        console.warn("cofhejs initialization failed (expected in non-FHE environments):", err);
        setIsReady(false);
      }
    };

    init();
  }, [signer, isConnected]);

  const encrypt = useCallback(
    async (weights: bigint[]) => {
      if (!cofheModule) throw new Error("cofhejs not loaded");
      const encryptables = weights.map((w) => cofheModule.Encryptable.uint32(w));
      const result = await cofheModule.cofhejs.encrypt(encryptables);
      if (!result?.data) throw new Error("Encryption failed");
      return result.data;
    },
    [],
  );

  return { isReady, encrypt };
}
