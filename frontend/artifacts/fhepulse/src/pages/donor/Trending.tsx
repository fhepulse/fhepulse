import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { TrendingUp, Users, Coins, Heart, Flame } from "lucide-react";
import { useTrendingPolls } from "@/hooks/use-mock-data";

export default function Trending() {
  const polls = useTrendingPolls();

  return (
    <AppLayout role="Donor">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/donor" className="hover:text-white cursor-pointer">Donor</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Trending</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-400" /> Trending Polls
            </h1>
            <p className="text-muted-foreground mt-1">The hottest polls attracting community attention right now</p>
          </div>
        </div>

        {/* Trending List */}
        <div className="space-y-4">
          {polls.map((poll, index) => {
            const fundingPercent = Math.round(
              (parseFloat(poll.currentFunding) / parseFloat(poll.fundingGoal)) * 100
            );
            return (
              <Card key={poll.id} className="border-white/5 hover:border-orange-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-2xl font-bold text-orange-400 shrink-0">
                      #{index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">{poll.title}</h3>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> {poll.trend}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs">{poll.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{poll.description}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {poll.participants}</span>
                        <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> {poll.currentFunding} / {poll.fundingGoal}</span>
                      </div>

                      {/* Funding Progress */}
                      <div className="w-full max-w-md">
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-full h-2 transition-all"
                            style={{ width: `${Math.min(fundingPercent, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{fundingPercent}% funded</p>
                      </div>
                    </div>

                    <Button className="gap-2 shrink-0 self-start">
                      <Heart className="w-4 h-4" /> Fund
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
