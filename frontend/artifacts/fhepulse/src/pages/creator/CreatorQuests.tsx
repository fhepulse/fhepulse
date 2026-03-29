import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Target, PlusCircle, Users, Coins, Zap } from "lucide-react";
import { useQuests } from "@/hooks/use-mock-data";

export default function CreatorQuests() {
  const quests = useQuests();

  return (
    <AppLayout role="Creator">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/creator" className="hover:text-white cursor-pointer">Creator</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Quests</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Quests</h1>
              <p className="text-muted-foreground mt-1">Create engagement quests to incentivize participation</p>
            </div>
            <Button className="gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Quest
            </Button>
          </div>
        </div>

        {/* Quest Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{quests.length}</p>
              <p className="text-xs text-muted-foreground">Total Quests</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{quests.filter(q => q.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{quests.filter(q => q.status === 'completed').length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{quests.filter(q => q.status === 'available').length}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
        </div>

        {/* Quest List */}
        <div className="grid gap-4 md:grid-cols-2">
          {quests.map((quest) => (
            <Card key={quest.id} className="border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Target className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="font-semibold">{quest.title}</h3>
                  </div>
                  <Badge variant="outline" className="capitalize text-xs">{quest.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-amber-400" /> {quest.reward}</span>
                  <Badge className={
                    quest.status === 'completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                    quest.status === 'active' ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                    "bg-slate-500/10 text-slate-400 border-slate-500/30"
                  }>{quest.status}</Badge>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${quest.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{quest.progress}% completion rate</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
