import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Coins, CheckCircle2, Clock, ExternalLink, Wallet } from "lucide-react";
import { useRewardsHistory } from "@/hooks/use-mock-data";

const statusConfig = {
  claimed: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", label: "Claimed" },
  claimable: { color: "bg-amber-500/10 text-amber-400 border-amber-500/30", label: "Claimable" },
  pending: { color: "bg-slate-500/10 text-slate-400 border-slate-500/30", label: "Pending" },
};

export default function RewardsHistory() {
  const rewards = useRewardsHistory();
  const claimable = rewards.filter((r) => r.status === "claimable");
  const claimed = rewards.filter((r) => r.status === "claimed");
  const pending = rewards.filter((r) => r.status === "pending");

  return (
    <AppLayout role="Participant">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/participant" className="hover:text-white cursor-pointer">Participant</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Rewards History</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Rewards History</h1>
            <p className="text-muted-foreground mt-1">Track all your poll rewards and claims</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg"><Wallet className="w-5 h-5 text-amber-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-amber-400">{claimable.length}</h3>
              <p className="text-sm text-muted-foreground">Ready to Claim</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-emerald-400">{claimed.length}</h3>
              <p className="text-sm text-muted-foreground">Claimed</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg"><Clock className="w-5 h-5 text-muted-foreground" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{pending.length}</h3>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Claimable */}
        {claimable.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" /> Ready to Claim
            </h2>
            {claimable.map((reward) => (
              <Card key={reward.id} className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{reward.pollTitle}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{reward.amount}</span>
                      <span>{reward.date}</span>
                    </div>
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black gap-2">
                    <Wallet className="w-4 h-4" /> Claim
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* All Rewards */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>All Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rewards.map((reward) => {
                const config = statusConfig[reward.status];
                return (
                  <div key={reward.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{reward.pollTitle}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{reward.date}</span>
                        {reward.txHash && (
                          <span className="flex items-center gap-1 text-primary cursor-pointer hover:underline">
                            {reward.txHash} <ExternalLink className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">{reward.amount}</span>
                      <Badge className={config.color}>{config.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
