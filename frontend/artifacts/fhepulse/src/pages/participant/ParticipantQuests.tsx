import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Target, Coins, CheckCircle2, Zap, Trophy } from "lucide-react";
import { useQuests } from "@/hooks/use-mock-data";

export default function ParticipantQuests() {
  const quests = useQuests();
  const active = quests.filter((q) => q.status === "active");
  const available = quests.filter((q) => q.status === "available");
  const completed = quests.filter((q) => q.status === "completed");

  return (
    <AppLayout role="Participant">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/participant" className="hover:text-white cursor-pointer">Participant</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Quests</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Quests</h1>
            <p className="text-muted-foreground mt-1">Complete quests to earn PULSE tokens and boost your rank</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-400">{completed.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">{active.length}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-400">{available.length}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
        </div>

        {/* In Progress */}
        {active.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" /> In Progress
            </h2>
            {active.map((quest) => (
              <Card key={quest.id} className="border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{quest.title}</h3>
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">{quest.category}</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{quest.progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2.5">
                      <div className="bg-blue-500 rounded-full h-2.5 transition-all" style={{ width: `${quest.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm flex items-center gap-1 text-amber-400"><Coins className="w-4 h-4" /> {quest.reward}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Available */}
        {available.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> Available Quests
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {available.map((quest) => (
                <Card key={quest.id} className="border-white/5 hover:border-amber-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{quest.title}</h3>
                      <Badge variant="outline" className="capitalize text-xs">{quest.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-1 text-amber-400"><Coins className="w-4 h-4" /> {quest.reward}</span>
                      <Button size="sm">Start Quest</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" /> Completed
            </h2>
            {completed.map((quest) => (
              <Card key={quest.id} className="border-white/5 opacity-75">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{quest.title}</h3>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-emerald-400 flex items-center gap-1"><Coins className="w-4 h-4" /> {quest.reward}</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
