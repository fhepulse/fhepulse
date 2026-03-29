import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contract } from "ethers";
import { useWallet } from "./use-wallet";
import { POLL_FACTORY_ADDRESS, PollFactoryAbi, PollAbi } from "@/contracts";
import { PollStatus, VotingMode, type PollInfo, type CreatePollParams } from "@/lib/types";

function useFactoryContract() {
  const { signer, provider } = useWallet();
  if (!POLL_FACTORY_ADDRESS) return null;
  const signerOrProvider = signer || provider;
  if (!signerOrProvider) return null;
  return new Contract(POLL_FACTORY_ADDRESS, PollFactoryAbi, signerOrProvider);
}

export function usePollCount() {
  const factory = useFactoryContract();
  return useQuery({
    queryKey: ["pollCount"],
    queryFn: async () => {
      if (!factory) return 0;
      const count = await factory.getPollCount();
      return Number(count);
    },
    enabled: !!factory,
  });
}

export function useAllPolls() {
  const factory = useFactoryContract();
  const { provider, signer } = useWallet();

  return useQuery<PollInfo[]>({
    queryKey: ["allPolls"],
    queryFn: async () => {
      if (!factory) return [];
      const signerOrProvider = signer || provider;
      if (!signerOrProvider) return [];

      const count = Number(await factory.getPollCount());
      if (count === 0) return [];

      const polls: PollInfo[] = [];
      for (let i = 0; i < count; i++) {
        const pollAddress = await factory.getPoll(i);
        const pollContract = new Contract(pollAddress, PollAbi, signerOrProvider);
        const info = await pollContract.getPollInfo();

        polls.push({
          address: pollAddress,
          pollId: i,
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
        });
      }

      return polls;
    },
    enabled: !!factory,
    staleTime: 15_000,
  });
}

export function useCreatorPollIds(address: string | null) {
  const factory = useFactoryContract();
  return useQuery({
    queryKey: ["creatorPollIds", address],
    queryFn: async () => {
      if (!factory || !address) return [];
      const ids = await factory.getCreatorPollIds(address);
      return ids.map((id: bigint) => Number(id));
    },
    enabled: !!factory && !!address,
  });
}

export function useCreatePoll() {
  const factory = useFactoryContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreatePollParams) => {
      if (!factory) throw new Error("Wallet not connected");
      const deadline = Math.floor(Date.now() / 1000) + params.durationSeconds;
      const tx = await factory.createPoll({
        title: params.title,
        description: params.description,
        optionCount: params.optionCount,
        deadline,
        votingMode: params.votingMode,
        creditBudget: params.creditBudget,
      });
      const receipt = await tx.wait();
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pollCount"] });
      queryClient.invalidateQueries({ queryKey: ["allPolls"] });
      queryClient.invalidateQueries({ queryKey: ["creatorPollIds"] });
    },
  });
}
