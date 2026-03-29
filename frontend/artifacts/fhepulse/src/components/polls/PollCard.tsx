import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, Coins, ArrowRight } from "lucide-react";
import { PollStatus, VotingMode, type PollInfo } from "@/lib/types";
import { formatEther } from "ethers";

const statusConfig = {
  [PollStatus.SeekingFunding]: { label: "Seeking Funding", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  [PollStatus.Active]: { label: "Active", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  [PollStatus.DecryptionRequested]: { label: "Decrypting", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  [PollStatus.Finalized]: { label: "Finalized", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
};

function timeRemaining(deadline: Date): string {
  const now = Date.now();
  const diff = deadline.getTime() - now;
  if (diff <= 0) return "Ended";
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `${Math.floor(diff / 60_000)}m left`;
  if (hours < 24) return `${hours}h left`;
  return `${Math.floor(hours / 24)}d left`;
}

export function PollCard({ poll }: { poll: PollInfo }) {
  const status = statusConfig[poll.status];
  const reward = formatEther(poll.rewardPool);

  return (
    <Link href={`/poll/${poll.address}`}>
      <Card className="bg-card border-white/10 hover:border-white/20 transition-colors cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-white line-clamp-1 flex-1 mr-3">{poll.title}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{poll.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {poll.participantCount}
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              {Number(reward) > 0 ? `${Number(reward).toFixed(4)} ETH` : "No reward"}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeRemaining(poll.deadline)}
            </div>
            <span className="text-xs text-muted-foreground/60">
              {poll.votingMode === VotingMode.Quadratic ? "Quadratic" : "Linear"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
