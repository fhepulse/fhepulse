import { PollStatus, VotingMode, type PollInfo, type CreatePollParams } from "./types";

const POLLS_KEY = "fhepulse:polls";
const VOTES_KEY = "fhepulse:votes";

// Serializable version (Date → number, bigint → string)
interface StoredPoll {
  address: string;
  pollId: number;
  creator: string;
  title: string;
  description: string;
  optionCount: number;
  optionLabels: string[];
  deadline: number; // ms timestamp
  votingMode: VotingMode;
  creditBudget: number;
  rewardPool: string; // bigint serialized
  participantCount: number;
  status: PollStatus;
  tallies: number[]; // accumulated vote tallies per option
}

// { [pollAddress]: { [voterAddress]: number[] } }
type VoteStore = Record<string, Record<string, number[]>>;

function readPolls(): StoredPoll[] {
  try {
    return JSON.parse(localStorage.getItem(POLLS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writePolls(polls: StoredPoll[]) {
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
}

function readVotes(): VoteStore {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeVotes(votes: VoteStore) {
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

function toStoredPoll(poll: PollInfo, tallies: number[]): StoredPoll {
  return {
    address: poll.address,
    pollId: poll.pollId,
    creator: poll.creator,
    title: poll.title,
    description: poll.description,
    optionCount: poll.optionCount,
    optionLabels: poll.optionLabels,
    deadline: poll.deadline.getTime(),
    votingMode: poll.votingMode,
    creditBudget: poll.creditBudget,
    rewardPool: poll.rewardPool.toString(),
    participantCount: poll.participantCount,
    status: poll.status,
    tallies,
  };
}

function toPollInfo(stored: StoredPoll): PollInfo {
  return {
    address: stored.address,
    pollId: stored.pollId,
    creator: stored.creator,
    title: stored.title,
    description: stored.description,
    optionCount: stored.optionCount,
    optionLabels: stored.optionLabels ?? [],
    deadline: new Date(stored.deadline),
    votingMode: stored.votingMode,
    creditBudget: stored.creditBudget,
    rewardPool: BigInt(stored.rewardPool),
    participantCount: stored.participantCount,
    status: stored.status,
  };
}

function generateAddress(): string {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}`;
}

// ── Public API ──────────────────────────────────────────────

export function getAllPolls(): PollInfo[] {
  return readPolls().map(toPollInfo);
}

export function getPoll(address: string): PollInfo | null {
  const stored = readPolls().find((p) => p.address === address);
  return stored ? toPollInfo(stored) : null;
}

export function getPollTallies(address: string): number[] {
  const stored = readPolls().find((p) => p.address === address);
  return stored?.tallies ?? [];
}

export function createPoll(params: CreatePollParams, creator: string): PollInfo {
  const polls = readPolls();
  const address = generateAddress();
  const deadline = Date.now() + params.durationSeconds * 1000;

  const poll: PollInfo = {
    address,
    pollId: polls.length,
    creator,
    title: params.title,
    description: params.description,
    optionCount: params.optionCount,
    optionLabels: params.optionLabels,
    deadline: new Date(deadline),
    votingMode: params.votingMode,
    creditBudget: params.creditBudget,
    rewardPool: 0n,
    participantCount: 0,
    status: PollStatus.Active,
  };

  const tallies = Array(params.optionCount).fill(0);
  polls.push(toStoredPoll(poll, tallies));
  writePolls(polls);
  return poll;
}

export function hasVoted(pollAddress: string, voter: string): boolean {
  const votes = readVotes();
  return !!votes[pollAddress]?.[voter.toLowerCase()];
}

export function submitVote(pollAddress: string, voter: string, weights: number[]) {
  const polls = readPolls();
  const idx = polls.findIndex((p) => p.address === pollAddress);
  if (idx === -1) throw new Error("Poll not found");

  const key = voter.toLowerCase();
  const votes = readVotes();
  if (votes[pollAddress]?.[key]) throw new Error("Already voted");

  // Record vote
  if (!votes[pollAddress]) votes[pollAddress] = {};
  votes[pollAddress][key] = weights;
  writeVotes(votes);

  // Update tallies & participant count
  const poll = polls[idx];
  for (let i = 0; i < weights.length; i++) {
    poll.tallies[i] = (poll.tallies[i] || 0) + weights[i];
  }
  poll.participantCount += 1;
  writePolls(polls);
}

export function fundPoll(pollAddress: string, amountWei: bigint) {
  const polls = readPolls();
  const idx = polls.findIndex((p) => p.address === pollAddress);
  if (idx === -1) throw new Error("Poll not found");
  polls[idx].rewardPool = (BigInt(polls[idx].rewardPool) + amountWei).toString();
  writePolls(polls);
}

export function updatePollStatus(pollAddress: string, status: PollStatus) {
  const polls = readPolls();
  const idx = polls.findIndex((p) => p.address === pollAddress);
  if (idx === -1) throw new Error("Poll not found");
  polls[idx].status = status;
  writePolls(polls);
}
