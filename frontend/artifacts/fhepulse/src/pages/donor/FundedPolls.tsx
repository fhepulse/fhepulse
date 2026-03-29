import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { HeartHandshake, Users, Coins, Calendar, CheckCircle } from "lucide-react";
import { useFundedPolls } from "@/hooks/use-mock-data";

export default function FundedPolls() {
  const polls = useFundedPolls();
  const active = polls.filter((p) => p.status === "active");
  const completed = polls.filter((p) => p.status === "completed");
  const totalFunded = polls.reduce((s, p) => s + parseFloat(p.fundedAmount), 0).toFixed(1);

  return (
    <AppLayout role="Donor">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/donor" className="hover:text-white cursor-pointer">Donor</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Funded Polls</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Funded Polls</h1>
            <p className="text-muted-foreground mt-1">Polls you've funded and their progress</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{polls.length}</p>
              <p className="text-xs text-muted-foreground">Total Funded</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{active.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{completed.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{totalFunded} ETH</p>
              <p className="text-xs text-muted-foreground">Total Invested</p>
            </CardContent>
          </Card>
        </div>

        {/* Poll List */}
        <div className="space-y-4">
          {polls.map((poll) => (
            <Card key={poll.id} className="border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{poll.title}</h3>
                      <Badge className={
                        poll.status === 'active'
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                      }>
                        {poll.status === 'active' ? 'Active' : 'Completed'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {poll.participants} participants</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Funded {poll.fundedAt}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Your contribution:</span>
                        <span className="text-sm font-semibold text-blue-400">{poll.fundedAmount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Total pool:</span>
                        <span className="text-sm font-semibold">{poll.totalPool}</span>
                      </div>
                    </div>
                    {/* Funding bar */}
                    <div className="mt-3 w-full max-w-xs">
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div
                          className="bg-blue-500 rounded-full h-2 transition-all"
                          style={{ width: `${(parseFloat(poll.fundedAmount) / parseFloat(poll.totalPool)) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((parseFloat(poll.fundedAmount) / parseFloat(poll.totalPool)) * 100)}% of pool
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
