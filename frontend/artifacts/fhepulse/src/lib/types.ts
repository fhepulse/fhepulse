export enum VotingMode {
  Linear = 0,
  Quadratic = 1,
}

export enum PollStatus {
  SeekingFunding = 0,
  Active = 1,
  DecryptionRequested = 2,
  Finalized = 3,
}

export interface PollInfo {
  address: string;
  pollId: number;
  creator: string;
  title: string;
  description: string;
  optionCount: number;
  deadline: Date;
  votingMode: VotingMode;
  creditBudget: number;
  rewardPool: bigint;
  participantCount: number;
  status: PollStatus;
}

export interface CreatePollParams {
  title: string;
  description: string;
  optionCount: number;
  durationSeconds: number;
  votingMode: VotingMode;
  creditBudget: number;
}
