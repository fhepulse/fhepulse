import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contract, parseEther } from "ethers";
import { useWallet } from "./use-wallet";
import { PollAbi } from "@/contracts";
import { PollStatus, VotingMode, type PollInfo } from "@/lib/types";

function usePollContract(pollAddress: string | undefined) {
  const { signer, provider } = useWallet();
  if (!pollAddress) return null;
  const signerOrProvider = signer || provider;
  if (!signerOrProvider) return null;
  return new Contract(pollAddress, PollAbi, signerOrProvider);
}

export function usePollInfo(pollAddress: string | undefined) {
  const poll = usePollContract(pollAddress);
  return useQuery<PollInfo | null>({
    queryKey: ["pollInfo", pollAddress],
    queryFn: async () => {
      if (!poll || !pollAddress) return null;
      const info = await poll.getPollInfo();
      return {
        address: pollAddress,
        pollId: 0,
        creator: info._creator,
        title: info._title,
        description: info._description,
        optionCount: Number(info._optionCount),
        deadline: new Date(Number(info._deadline) * 1000),
        votingMode: Number(info._votingMode) as VotingMode,
        creditBudget: Number(info._creditBudget),
        rewardPool: info._rewardPool,
        participantCount: Number(info._participantCount),
        status: Number(info._status) as PollStatus,
      };
    },
    enabled: !!poll,
    staleTime: 10_000,
  });
}

export function useHasVoted(pollAddress: string | undefined, userAddress: string | null) {
  const poll = usePollContract(pollAddress);
  return useQuery({
    queryKey: ["hasVoted", pollAddress, userAddress],
    queryFn: async () => {
      if (!poll || !userAddress) return false;
      return await poll.hasVoted(userAddress);
    },
    enabled: !!poll && !!userAddress,
  });
}

export function usePollResults(pollAddress: string | undefined) {
  const poll = usePollContract(pollAddress);
  return useQuery<number[]>({
    queryKey: ["pollResults", pollAddress],
    queryFn: async () => {
      if (!poll) return [];
      const results = await poll.getResults();
      return results.map((r: bigint) => Number(r));
    },
    enabled: !!poll,
  });
}

export function useVote(pollAddress: string | undefined) {
  const poll = usePollContract(pollAddress);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (encryptedWeights: any[]) => {
      if (!poll) throw new Error("Poll not available");
      const tx = await poll.vote(encryptedWeights);
      return await tx.wait();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasVoted", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useFundPoll(pollAddress: string | undefined) {
  const poll = usePollContract(pollAddress);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amountEth: string) => {
      if (!poll) throw new Error("Poll not available");
      const tx = await poll.fund({ value: parseEther(amountEth) });
      return await tx.wait();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useActivatePoll(pollAddress: string | undefined) {
  const poll = usePollContract(pollAddress);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!poll) throw new Error("Poll not available");
      const tx = await poll.activate();
      return await tx.wait();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useRequestFinalize(pollAddress: string | undefined) {
  const poll = usePollContract(pollAddress);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!poll) throw new Error("Poll not available");
      const tx = await poll.requestFinalize();
      return await tx.wait();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
    },
  });
}

export function useFinalize(pollAddress: string | undefined) {
  const poll = usePollContract(pollAddress);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!poll) throw new Error("Poll not available");
      const tx = await poll.finalize();
      return await tx.wait();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollInfo", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["pollResults", pollAddress] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
    },
  });
}

export function useClaimReward(pollAddress: string | undefined) {
  const poll = usePollContract(pollAddress);

  return useMutation({
    mutationFn: async () => {
      if (!poll) throw new Error("Poll not available");
      const tx = await poll.claimReward();
      return await tx.wait();
    },
  });
}
