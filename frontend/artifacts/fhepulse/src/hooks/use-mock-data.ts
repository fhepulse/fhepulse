import { useState, useEffect } from 'react';

// Shared Wallet State
export function useWallet() {
  return {
    address: "0x5110...2228",
    isConnected: true,
    network: "Base",
    balance: "2.45 ETH"
  };
}

// Global Platform Stats
export function usePlatformStats() {
  return {
    pollsCreated: 1247,
    totalResponses: 89432,
    rewardsDistributed: 45.2,
    activePolls: 23
  };
}

// Creator Dashboard Stats
export function useCreatorStats() {
  return {
    totalPolls: 12,
    totalResponses: 3450,
    activePolls: 3,
    totalFunded: "1.2500"
  };
}

// Participant Dashboard Stats
export function useParticipantStats() {
  return {
    totalClaimable: "0.05",
    pollsParticipated: 42,
    totalClaimed: "0.12",
    pendingClaims: 3
  };
}

// Donor Dashboard Stats
export function useDonorStats() {
  return {
    totalFunded: "2.5",
    pollsFunded: 12,
    activeFunding: 5,
    impactScore: 847
  };
}

// Mock Polls Data
export type Poll = {
  id: string;
  title: string;
  description: string;
  creator: string;
  reward: string;
  participants: number;
  timeLeft: string;
  status: 'active' | 'completed' | 'seeking_funding';
};

const mockPolls: Poll[] = [
  { id: '1', title: 'Preferred L2 Scaling Solution for 2025?', description: 'Vote on which Layer 2 network you plan to use most.', creator: '0x1234...abcd', reward: '0.01 ETH', participants: 452, timeLeft: '2 days', status: 'active' },
  { id: '2', title: 'DeFi UI UX Feedback Survey', description: 'Help us improve the onboarding flow for new users.', creator: '0xdef0...9876', reward: '50 USDC', participants: 128, timeLeft: '5 hours', status: 'active' },
  { id: '3', title: 'Community Grant Allocation Q3', description: 'Where should the DAO allocate the remaining treasury funds?', creator: '0xdao...1111', reward: '100 OP', participants: 890, timeLeft: '1 week', status: 'active' },
  { id: '4', title: 'NFT Metadata Standards', description: 'Seeking developer input on evolving metadata structures.', creator: '0xnft...2222', reward: '0', participants: 45, timeLeft: 'Ended', status: 'completed' },
  { id: '5', title: 'Zero Knowledge Proofs Research', description: 'Looking for funding to survey 1000 devs on ZK adoption.', creator: '0xzkp...3333', reward: 'Needs 0.5 ETH', participants: 0, timeLeft: 'Funding Open', status: 'seeking_funding' },
];

export function usePolls(filter?: Poll['status']) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter) {
        setPolls(mockPolls.filter(p => p.status === filter));
      } else {
        setPolls(mockPolls);
      }
      setIsLoading(false);
    }, 400); // simulate network delay
    return () => clearTimeout(timer);
  }, [filter]);

  return { polls, isLoading };
}

// Chart Data
export function useChartData() {
  return [
    { name: 'Mon', responses: 120 },
    { name: 'Tue', responses: 250 },
    { name: 'Wed', responses: 180 },
    { name: 'Thu', responses: 390 },
    { name: 'Fri', responses: 520 },
    { name: 'Sat', responses: 410 },
    { name: 'Sun', responses: 680 },
  ];
}
