import { useState } from "react";
import { useParams } from "wouter";
import { formatEther } from "ethers";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Clock, Users, Coins, ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { usePollInfo, usePollResults, useFundPoll, useActivatePoll, useRequestFinalize, useFinalize, useClaimReward, useHasVoted } from "@/hooks/use-poll";
import { VoteInterface } from "@/components/polls/VoteInterface";
import { PollResults } from "@/components/polls/PollResults";
import { PollStatus, VotingMode } from "@/lib/types";
import { toast } from "sonner";

const statusLabels: Record<PollStatus, string> = {
  [PollStatus.SeekingFunding]: "Seeking Funding",
  [PollStatus.Active]: "Active",
  [PollStatus.DecryptionRequested]: "Awaiting Decryption",
  [PollStatus.Finalized]: "Finalized",
};

function timeRemaining(deadline: Date): string {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `${Math.floor(diff / 60_000)} minutes`;
  if (hours < 24) return `${hours} hours`;
  return `${Math.floor(hours / 24)} days`;
}

export default function PollPage() {
  const { address: pollAddress } = useParams<{ address: string }>();
  const { address: userAddress, isConnected } = useWallet();
  const { data: poll, isLoading } = usePollInfo(pollAddress);
  const { data: results } = usePollResults(pollAddress);
  const { data: hasVoted } = useHasVoted(pollAddress, userAddress);
  const fundPoll = useFundPoll(pollAddress);
  const activatePoll = useActivatePoll(pollAddress);
  const requestFinalize = useRequestFinalize(pollAddress);
  const finalize = useFinalize(pollAddress);
  const claimReward = useClaimReward(pollAddress);
  const [fundAmount, setFundAmount] = useState("0.01");

  const isCreator = poll && userAddress && poll.creator.toLowerCase() === userAddress.toLowerCase();
  const isPastDeadline = poll && poll.deadline.getTime() <= Date.now();

  const handleAction = async (action: () => Promise<any>, label: string) => {
    try {
      await action();
      toast.success(label);
    } catch (err: any) {
      toast.error(err?.reason || err?.message || `${label} failed`);
    }
  };

  if (isLoading || !poll) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  const reward = formatEther(poll.rewardPool);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/participant" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Polls
        </Link>

        {/* Poll Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{poll.title}</h1>
          <p className="text-muted-foreground whitespace-pre-line">{poll.description}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-white/10 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
            <p className="font-semibold text-white">{statusLabels[poll.status]}</p>
          </div>
          <div className="bg-card border border-white/10 rounded-lg p-4 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-semibold text-white">{timeRemaining(poll.deadline)}</p>
          </div>
          <div className="bg-card border border-white/10 rounded-lg p-4 text-center">
            <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-semibold text-white">{poll.participantCount}</p>
          </div>
          <div className="bg-card border border-white/10 rounded-lg p-4 text-center">
            <Coins className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-semibold text-white">{Number(reward).toFixed(4)} ETH</p>
          </div>
        </div>

        {/* Mode Badge */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-primary" />
          {poll.votingMode === VotingMode.Quadratic ? "Quadratic voting" : "Linear voting"}
          <span className="text-muted-foreground/50">|</span>
          {poll.optionCount} options
          <span className="text-muted-foreground/50">|</span>
          Budget: {poll.creditBudget} credits
        </div>

        {/* Main Content */}
        <Card className="bg-card border-white/10 mb-6">
          <CardContent className="p-6">
            {/* Active: Show vote interface */}
            {poll.status === PollStatus.Active && !isPastDeadline && (
              <VoteInterface poll={poll} />
            )}

            {/* Active but past deadline */}
            {poll.status === PollStatus.Active && isPastDeadline && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg font-semibold text-white mb-2">Voting has ended</p>
                <p>Waiting for the poll creator to finalize results.</p>
              </div>
            )}

            {/* Seeking Funding */}
            {poll.status === PollStatus.SeekingFunding && (
              <div className="space-y-4">
                <p className="text-muted-foreground">This poll needs funding to activate. Contribute ETH to the reward pool.</p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="max-w-[200px]"
                  />
                  <Button
                    onClick={() => handleAction(() => fundPoll.mutateAsync(fundAmount), "Poll funded!")}
                    disabled={fundPoll.isPending || !isConnected}
                  >
                    {fundPoll.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fund Poll"}
                  </Button>
                </div>
              </div>
            )}

            {/* Decryption Requested */}
            {poll.status === PollStatus.DecryptionRequested && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-400" />
                <p className="text-lg font-semibold text-white">Decrypting results...</p>
                <p className="text-sm text-muted-foreground mt-1">FHE decryption has been requested. Results will be available shortly.</p>
              </div>
            )}

            {/* Finalized: Show results */}
            {poll.status === PollStatus.Finalized && results && (
              <PollResults results={results} optionCount={poll.optionCount} optionLabels={poll.optionLabels} />
            )}
          </CardContent>
        </Card>

        {/* Creator Controls */}
        {isCreator && (
          <Card className="bg-card border-primary/20 mb-6">
            <CardHeader>
              <CardTitle className="text-sm text-primary">Creator Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {poll.status === PollStatus.SeekingFunding && (
                <Button
                  variant="outline"
                  onClick={() => handleAction(() => activatePoll.mutateAsync(), "Poll activated!")}
                  disabled={activatePoll.isPending}
                >
                  Activate Without Funding
                </Button>
              )}
              {poll.status === PollStatus.Active && isPastDeadline && (
                <Button
                  onClick={() => handleAction(() => requestFinalize.mutateAsync(), "Decryption requested!")}
                  disabled={requestFinalize.isPending}
                >
                  Request Finalization
                </Button>
              )}
              {poll.status === PollStatus.DecryptionRequested && (
                <Button
                  onClick={() => handleAction(() => finalize.mutateAsync(), "Poll finalized!")}
                  disabled={finalize.isPending}
                >
                  Finalize Results
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Claim Reward */}
        {poll.status === PollStatus.Finalized && hasVoted && Number(reward) > 0 && (
          <Card className="bg-card border-emerald-500/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Claim Your Reward</p>
                <p className="text-sm text-muted-foreground">
                  You participated in this poll. Claim your share of the reward pool.
                </p>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleAction(() => claimReward.mutateAsync(), "Reward claimed!")}
                disabled={claimReward.isPending}
              >
                {claimReward.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
