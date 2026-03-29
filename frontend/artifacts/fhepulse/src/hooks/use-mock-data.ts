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

// Creator: Managed Polls
export function useCreatorPolls() {
  return [
    { id: '1', title: 'Preferred L2 Scaling Solution for 2025?', status: 'active' as const, responses: 452, reward: '0.01 ETH', deadline: '2025-04-15', mode: 'quadratic' as const },
    { id: '2', title: 'DeFi UI UX Feedback Survey', status: 'active' as const, responses: 128, reward: '50 USDC', deadline: '2025-04-10', mode: 'linear' as const },
    { id: '3', title: 'Community Grant Allocation Q3', status: 'active' as const, responses: 890, reward: '100 OP', deadline: '2025-04-20', mode: 'quadratic' as const },
    { id: '4', title: 'NFT Metadata Standards', status: 'completed' as const, responses: 45, reward: '0.005 ETH', deadline: '2025-03-01', mode: 'linear' as const },
    { id: '5', title: 'Token Utility Preferences', status: 'completed' as const, responses: 312, reward: '0.02 ETH', deadline: '2025-02-20', mode: 'quadratic' as const },
    { id: '6', title: 'ZK Proofs Developer Survey', status: 'seeking_funding' as const, responses: 0, reward: 'Needs 0.5 ETH', deadline: '—', mode: 'linear' as const },
  ];
}

// Creator: Questionnaires
export function useQuestionnaires() {
  return [
    { id: '1', title: 'Onboarding Experience Survey', questions: 12, responses: 89, status: 'active' as const, createdAt: '2025-03-15' },
    { id: '2', title: 'Product Feature Prioritization', questions: 8, responses: 234, status: 'active' as const, createdAt: '2025-03-10' },
    { id: '3', title: 'Developer Tools Feedback', questions: 15, responses: 56, status: 'draft' as const, createdAt: '2025-03-20' },
    { id: '4', title: 'Community Satisfaction Q1', questions: 20, responses: 412, status: 'completed' as const, createdAt: '2025-01-05' },
  ];
}

// Creator: Distributions
export function useDistributions() {
  return [
    { id: '1', pollTitle: 'Preferred L2 Scaling Solution for 2025?', totalReward: '0.01 ETH', recipients: 452, status: 'pending' as const, createdAt: '2025-03-28' },
    { id: '2', pollTitle: 'DeFi UI UX Feedback Survey', totalReward: '50 USDC', recipients: 128, status: 'pending' as const, createdAt: '2025-03-25' },
    { id: '3', pollTitle: 'NFT Metadata Standards', totalReward: '0.005 ETH', recipients: 45, status: 'distributed' as const, createdAt: '2025-03-01', distributedAt: '2025-03-02' },
    { id: '4', pollTitle: 'Token Utility Preferences', totalReward: '0.02 ETH', recipients: 312, status: 'distributed' as const, createdAt: '2025-02-20', distributedAt: '2025-02-21' },
  ];
}

// Creator & Participant: Quests
export function useQuests() {
  return [
    { id: '1', title: 'First Vote', description: 'Cast your first vote on any active poll', reward: '10 PULSE', progress: 100, status: 'completed' as const, category: 'onboarding' },
    { id: '2', title: 'Survey Streak', description: 'Complete 5 surveys in a week', reward: '50 PULSE', progress: 60, status: 'active' as const, category: 'engagement' },
    { id: '3', title: 'Community Voice', description: 'Participate in 10 different polls', reward: '100 PULSE', progress: 40, status: 'active' as const, category: 'engagement' },
    { id: '4', title: 'Data Pioneer', description: 'Be among the first 10 voters on a new poll', reward: '25 PULSE', progress: 0, status: 'available' as const, category: 'achievement' },
    { id: '5', title: 'Referral Champion', description: 'Invite 3 friends who complete at least 1 poll', reward: '75 PULSE', progress: 33, status: 'active' as const, category: 'social' },
    { id: '6', title: 'Quadratic Master', description: 'Vote using quadratic voting in 3 polls', reward: '30 PULSE', progress: 0, status: 'available' as const, category: 'achievement' },
  ];
}

// Participant: Points
export function usePointsData() {
  return {
    totalPoints: 1250,
    rank: 847,
    totalParticipants: 12500,
    level: 'Silver',
    nextLevel: 'Gold',
    pointsToNext: 750,
    history: [
      { id: '1', action: 'Voted on "L2 Scaling Solution"', points: 50, date: '2025-03-28' },
      { id: '2', action: 'Completed "First Vote" quest', points: 100, date: '2025-03-27' },
      { id: '3', action: 'Voted on "DeFi UX Feedback"', points: 50, date: '2025-03-25' },
      { id: '4', action: 'Referral bonus: 0xab...cd joined', points: 25, date: '2025-03-22' },
      { id: '5', action: 'Voted on "Grant Allocation Q3"', points: 75, date: '2025-03-20' },
      { id: '6', action: 'Daily login streak (7 days)', points: 30, date: '2025-03-18' },
      { id: '7', action: 'Voted on "NFT Metadata Standards"', points: 50, date: '2025-03-15' },
    ],
  };
}

// Participant: Membership
export function useMembershipData() {
  return {
    tier: 'Silver',
    joinedDate: '2025-01-15',
    totalPoints: 1250,
    benefits: [
      { name: 'Early Poll Access', description: 'Get access to new polls 2 hours before general release', unlocked: true },
      { name: 'Bonus Rewards', description: '10% bonus on all claimed rewards', unlocked: true },
      { name: 'Priority Support', description: 'Dedicated support channel access', unlocked: false, requiredTier: 'Gold' },
      { name: 'Governance Voting', description: 'Vote on platform governance proposals', unlocked: false, requiredTier: 'Gold' },
      { name: 'Custom Avatar', description: 'Upload a custom profile avatar NFT', unlocked: false, requiredTier: 'Platinum' },
      { name: 'Revenue Share', description: 'Earn a share of platform fees', unlocked: false, requiredTier: 'Platinum' },
    ],
    tiers: [
      { name: 'Bronze', minPoints: 0, color: 'amber-700' },
      { name: 'Silver', minPoints: 500, color: 'slate-300' },
      { name: 'Gold', minPoints: 2000, color: 'amber-400' },
      { name: 'Platinum', minPoints: 5000, color: 'cyan-300' },
    ],
  };
}

// Participant: Rewards History
export function useRewardsHistory() {
  return [
    { id: '1', pollTitle: 'L2 Scaling Solution Survey', amount: '0.005 ETH', status: 'claimed' as const, date: '2025-03-28', txHash: '0xabc...123' },
    { id: '2', pollTitle: 'DeFi UX Feedback', amount: '12.5 USDC', status: 'claimed' as const, date: '2025-03-25', txHash: '0xdef...456' },
    { id: '3', pollTitle: 'Community Grant Q2', amount: '25 OP', status: 'claimed' as const, date: '2025-03-10', txHash: '0xghi...789' },
    { id: '4', pollTitle: 'NFT Metadata Standards', amount: '0.002 ETH', status: 'claimable' as const, date: '2025-03-01' },
    { id: '5', pollTitle: 'Token Utility Poll', amount: '0.008 ETH', status: 'claimable' as const, date: '2025-02-20' },
    { id: '6', pollTitle: 'ZK Adoption Survey', amount: '0.003 ETH', status: 'pending' as const, date: '2025-02-15' },
  ];
}

// Donor: Funded Polls
export function useFundedPolls() {
  return [
    { id: '1', title: 'Preferred L2 Scaling Solution for 2025?', fundedAmount: '0.5 ETH', status: 'active' as const, participants: 452, totalPool: '1.2 ETH', fundedAt: '2025-03-20' },
    { id: '2', title: 'DeFi UI UX Feedback Survey', fundedAmount: '0.3 ETH', status: 'active' as const, participants: 128, totalPool: '0.8 ETH', fundedAt: '2025-03-18' },
    { id: '3', title: 'NFT Metadata Standards', fundedAmount: '0.1 ETH', status: 'completed' as const, participants: 45, totalPool: '0.2 ETH', fundedAt: '2025-02-25' },
    { id: '4', title: 'Community Grant Allocation Q3', fundedAmount: '1.0 ETH', status: 'active' as const, participants: 890, totalPool: '2.5 ETH', fundedAt: '2025-03-15' },
  ];
}

// Donor: Funding History
export function useFundingHistory() {
  return [
    { id: '1', pollTitle: 'L2 Scaling Solution Survey', amount: '0.5 ETH', date: '2025-03-20', txHash: '0xabc...111', status: 'confirmed' as const },
    { id: '2', pollTitle: 'DeFi UX Feedback', amount: '0.3 ETH', date: '2025-03-18', txHash: '0xdef...222', status: 'confirmed' as const },
    { id: '3', pollTitle: 'Community Grant Q3', amount: '1.0 ETH', date: '2025-03-15', txHash: '0xghi...333', status: 'confirmed' as const },
    { id: '4', pollTitle: 'NFT Metadata Standards', amount: '0.1 ETH', date: '2025-02-25', txHash: '0xjkl...444', status: 'confirmed' as const },
    { id: '5', pollTitle: 'Token Utility Preferences', amount: '0.6 ETH', date: '2025-02-10', txHash: '0xmno...555', status: 'confirmed' as const },
  ];
}

// Donor: Trending Polls
export function useTrendingPolls() {
  return [
    { id: '1', title: 'Community Grant Allocation Q3', description: 'Where should the DAO allocate treasury?', participants: 890, fundingGoal: '5.0 ETH', currentFunding: '3.8 ETH', trend: '+45%', category: 'governance' },
    { id: '2', title: 'Preferred L2 Scaling Solution', description: 'Vote on your preferred L2 for 2025', participants: 452, fundingGoal: '2.0 ETH', currentFunding: '1.8 ETH', trend: '+32%', category: 'infrastructure' },
    { id: '3', title: 'DeFi Protocol Safety Rankings', description: 'Rank DeFi protocols by perceived safety', participants: 678, fundingGoal: '3.0 ETH', currentFunding: '2.1 ETH', trend: '+28%', category: 'defi' },
    { id: '4', title: 'NFT Marketplace Preferences', description: 'Which marketplace features matter most?', participants: 234, fundingGoal: '1.0 ETH', currentFunding: '0.4 ETH', trend: '+15%', category: 'nft' },
    { id: '5', title: 'Privacy Tools Adoption Survey', description: 'Which privacy solutions do you use?', participants: 567, fundingGoal: '2.5 ETH', currentFunding: '1.9 ETH', trend: '+22%', category: 'privacy' },
  ];
}

// Shared: Token Stats
export function useTokenStats() {
  return {
    price: '$0.42',
    priceChange: '+5.2%',
    marketCap: '$4.2M',
    totalSupply: '100,000,000 PULSE',
    circulatingSupply: '42,000,000 PULSE',
    holders: 8_432,
    volume24h: '$380K',
    allTimeHigh: '$0.68',
    priceHistory: [
      { date: 'Mar 24', price: 0.35 },
      { date: 'Mar 25', price: 0.37 },
      { date: 'Mar 26', price: 0.36 },
      { date: 'Mar 27', price: 0.40 },
      { date: 'Mar 28', price: 0.39 },
      { date: 'Mar 29', price: 0.41 },
      { date: 'Mar 30', price: 0.42 },
    ],
  };
}

// Shared: Analytics
export function useAnalyticsData() {
  return {
    totalPolls: 1247,
    totalVotes: 89_432,
    uniqueVoters: 15_620,
    avgResponseRate: 72,
    topCategories: [
      { name: 'Governance', polls: 340, votes: 24_500 },
      { name: 'DeFi', polls: 280, votes: 19_800 },
      { name: 'Infrastructure', polls: 210, votes: 15_200 },
      { name: 'NFTs', polls: 180, votes: 12_400 },
      { name: 'Privacy', polls: 120, votes: 9_800 },
    ],
    weeklyActivity: [
      { week: 'W1', polls: 28, votes: 2100 },
      { week: 'W2', polls: 35, votes: 2800 },
      { week: 'W3', polls: 32, votes: 2500 },
      { week: 'W4', polls: 41, votes: 3200 },
    ],
  };
}
