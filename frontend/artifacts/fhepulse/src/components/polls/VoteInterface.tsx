import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useHasVoted, useVote } from "@/hooks/use-poll";
import { VotingMode, type PollInfo } from "@/lib/types";
import { toast } from "sonner";

export function VoteInterface({ poll }: { poll: PollInfo }) {
  const { address, isConnected } = useWallet();
  const { data: hasVoted } = useHasVoted(poll.address, address);
  const voteMutation = useVote(poll.address);
  const [weights, setWeights] = useState<number[]>(Array(poll.optionCount).fill(0));

  const isQuadratic = poll.votingMode === VotingMode.Quadratic;
  const budget = poll.creditBudget;

  const totalUsed = isQuadratic
    ? weights.reduce((sum, w) => sum + w * w, 0)
    : weights.reduce((sum, w) => sum + w, 0);

  const budgetPercent = Math.min((totalUsed / budget) * 100, 100);
  const isOverBudget = totalUsed > budget;

  const updateWeight = (index: number, value: number) => {
    const next = [...weights];
    next[index] = value;
    setWeights(next);
  };

  const handleSubmit = async () => {
    if (isOverBudget) {
      toast.error("You've exceeded the credit budget");
      return;
    }
    try {
      await voteMutation.mutateAsync(weights);
      toast.success("Vote submitted! Your vote is encrypted and private.");
    } catch (err: any) {
      toast.error(err?.reason || err?.message || "Vote failed");
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Lock className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p>Connect your wallet to vote</p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
        <p className="text-lg font-semibold text-white">You've already voted</p>
        <p className="text-sm text-muted-foreground mt-1">Your encrypted vote has been recorded on-chain.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {isQuadratic ? "Credits used (sum of weights\u00B2)" : "Points allocated"}
          </span>
          <span className={isOverBudget ? "text-destructive font-semibold" : "text-white"}>
            {totalUsed} / {budget}
          </span>
        </div>
        <Progress value={budgetPercent} className="h-2" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: poll.optionCount }, (_, i) => {
          const label = poll.optionLabels?.[i] || `Option ${i + 1}`;
          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">{label}</span>
                <span className="text-muted-foreground font-mono">
                  {weights[i]}
                  {isQuadratic && <span className="text-xs ml-1">(cost: {weights[i] * weights[i]})</span>}
                </span>
              </div>
              <Slider
                value={[weights[i]]}
                onValueChange={([v]) => updateWeight(i, v)}
                min={0}
                max={isQuadratic ? Math.floor(Math.sqrt(budget)) : budget}
                step={1}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
        <Lock className="w-4 h-4 shrink-0 text-primary" />
        Your vote weights will be encrypted with FHE before submission. No one can see how you voted.
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={voteMutation.isPending || isOverBudget || totalUsed === 0}
      >
        {voteMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Submit Encrypted Vote
          </>
        )}
      </Button>
    </div>
  );
}
