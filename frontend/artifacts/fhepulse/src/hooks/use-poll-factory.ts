import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "./use-wallet";
import { type PollInfo, type CreatePollParams } from "@/lib/types";
import * as store from "@/lib/poll-store";

export function usePollCount() {
  return useQuery({
    queryKey: ["pollCount"],
    queryFn: () => store.getAllPolls().length,
  });
}

export function useAllPolls() {
  return useQuery<PollInfo[]>({
    queryKey: ["allPolls"],
    queryFn: () => store.getAllPolls(),
    staleTime: 2_000,
  });
}

export function useCreatorPollIds(address: string | null) {
  return useQuery({
    queryKey: ["creatorPollIds", address],
    queryFn: () => {
      if (!address) return [];
      return store
        .getAllPolls()
        .filter((p) => p.creator.toLowerCase() === address.toLowerCase())
        .map((p) => p.pollId);
    },
    enabled: !!address,
  });
}

export function useCreatePoll() {
  const { address } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreatePollParams) => {
      const creator = address || "0x" + "0".repeat(40);
      return store.createPoll(params, creator);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollCount"] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
      queryClient.invalidateQueries({ queryKey: ["creatorPollIds"] });
    },
  });
}
