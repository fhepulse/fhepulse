import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parseEther } from "ethers";
import { useWallet } from "./use-wallet";
import { PollStatus, type PollInfo } from "@/lib/types";
import * as store from "@/lib/poll-store";

export function usePollInfo(pollAddress: string | undefined) {
  return useQuery<PollInfo | null>({
    queryKey: ["pollInfo", pollAddress],
    queryFn: () => (pollAddress ? store.getPoll(pollAddress) : null),
    enabled: !!pollAddress,
    staleTime: 2_000,
  });
}

export function useHasVoted(pollAddress: string | undefined, userAddress: string | null) {
  return useQuery({
    queryKey: ["hasVoted", pollAddress, userAddress],
    queryFn: () => {
      if (!pollAddress || !userAddress) return false;
      return store.hasVoted(pollAddress, userAddress);
    },
    enabled: !!pollAddress && !!userAddress,
  });
}

export function usePollResults(pollAddress: string | undefined) {
  return useQuery<number[]>({
    queryKey: ["pollResults", pollAddress],
    queryFn: () => (pollAddress ? store.getPollTallies(pollAddress) : []),
    enabled: !!pollAddress,
  });
}

export function useVote(pollAddress: string | undefined) {
  const { address } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weights: number[]) => {
      if (!pollAddress) throw new Error("Poll not available");
      const voter = address || "0x" + "0".repeat(40);
      store.submitVote(pollAddress, voter, weights);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasVoted", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["pollResults", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useFundPoll(pollAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amountEth: string) => {
      if (!pollAddress) throw new Error("Poll not available");
      store.fundPoll(pollAddress, parseEther(amountEth));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useActivatePoll(pollAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!pollAddress) throw new Error("Poll not available");
      store.updatePollStatus(pollAddress, PollStatus.Active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useRequestFinalize(pollAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!pollAddress) throw new Error("Poll not available");
      store.updatePollStatus(pollAddress, PollStatus.Finalized);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["pollResults", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useFinalize(pollAddress: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!pollAddress) throw new Error("Poll not available");
      store.updatePollStatus(pollAddress, PollStatus.Finalized);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["pollResults", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useClaimReward(pollAddress: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      if (!pollAddress) throw new Error("Poll not available");
      // No-op for localStorage demo
    },
  });
}
