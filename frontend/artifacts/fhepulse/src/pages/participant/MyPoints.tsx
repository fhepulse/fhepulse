import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Coins, TrendingUp, Trophy, Star, ArrowUp } from "lucide-react";
import { usePointsData } from "@/hooks/use-mock-data";

export default function MyPoints() {
  const data = usePointsData();
  const progressPercent = Math.round(
    ((data.totalPoints - (data.totalPoints - data.pointsToNext)) / (data.totalPoints + data.pointsToNext - data.totalPoints)) * 100
  );

  return (
    <AppLayout role="Participant">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/participant" className="hover:text-white cursor-pointer">Participant</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">My Points</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Points</h1>
            <p className="text-muted-foreground mt-1">Track your earning activity and level progression</p>
          </div>
        </div>

        {/* Points Hero */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                <h2 className="text-5xl font-bold text-primary">{data.totalPoints.toLocaleString()}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-slate-300/10 text-slate-300 border-slate-300/30">{data.level}</Badge>
                  <span className="text-sm text-muted-foreground">&rarr; {data.pointsToNext} pts to {data.nextLevel}</span>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <p className="text-xl font-bold">#{data.rank}</p>
                  <p className="text-xs text-muted-foreground">Rank</p>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xl font-bold">{data.level}</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{data.level}</span>
                <span className="text-muted-foreground">{data.nextLevel}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-accent rounded-full h-3 transition-all"
                  style={{ width: `${Math.round((data.totalPoints / (data.totalPoints + data.pointsToNext)) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg"><Coins className="w-5 h-5 text-primary" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{data.totalPoints.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">#{data.rank}</h3>
              <p className="text-sm text-muted-foreground">of {data.totalParticipants.toLocaleString()} participants</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg"><ArrowUp className="w-5 h-5 text-amber-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{data.pointsToNext}</h3>
              <p className="text-sm text-muted-foreground">Points to {data.nextLevel}</p>
            </CardContent>
          </Card>
        </div>

        {/* Earning History */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Earning History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.history.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <span className="font-semibold text-emerald-400">+{item.points} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
