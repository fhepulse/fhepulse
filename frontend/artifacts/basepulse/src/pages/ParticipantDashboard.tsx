import { AppLayout } from "@/components/layout/AppLayout";
import { useParticipantStats, usePolls } from "@/hooks/use-mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Wallet, PieChart, CheckCircle2, Clock, 
  ArrowRight, Box, Target, Zap, PlusCircle
} from "lucide-react";

export default function ParticipantDashboard() {
  const stats = useParticipantStats();
  const { polls, isLoading } = usePolls('active');

  return (
    <AppLayout role="Participant">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"}} />
          <div className="relative z-10 p-8 md:p-12">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mb-4 backdrop-blur-md">Participant</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">Participant Dashboard</h1>
            <p className="text-lg text-white/80 max-w-2xl">Vote on polls, complete quests, and claim your rewards. Your opinion shapes the ecosystem.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><Wallet className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-emerald-400">{stats.totalClaimable} ETH</h3>
              <p className="text-sm text-white font-medium">Total Claimable</p>
              <p className="text-xs text-muted-foreground mt-1">Available to claim now</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg"><PieChart className="w-5 h-5 text-primary" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.pollsParticipated}</h3>
              <p className="text-sm text-white font-medium">Polls Participated</p>
              <p className="text-xs text-muted-foreground mt-1">Total polls voted in</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg"><CheckCircle2 className="w-5 h-5 text-muted-foreground" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalClaimed} ETH</h3>
              <p className="text-sm text-white font-medium">Total Claimed</p>
              <p className="text-xs text-muted-foreground mt-1">All-time claimed rewards</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg"><Clock className="w-5 h-5 text-amber-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-amber-400">{stats.pendingClaims}</h3>
              <p className="text-sm text-white font-medium">Pending Claims</p>
              <p className="text-xs text-muted-foreground mt-1">Polls awaiting distribution</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Polls List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Active Polls
              </h2>
              <Link href="#" className="text-sm text-primary hover:text-primary/80 flex items-center">
                View All Polls <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse bg-white/5 border-white/5 h-32" />
                ))}
              </div>
            ) : polls.length > 0 ? (
              <div className="space-y-4">
                {polls.map((poll) => (
                  <Card key={poll.id} className="border-white/5 hover:border-primary/30 transition-colors group">
                    <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs bg-white/5">Ends in {poll.timeLeft}</Badge>
                          {poll.reward !== '0' && <Badge variant="success" className="text-xs">{poll.reward} Reward</Badge>}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{poll.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{poll.description}</p>
                      </div>
                      <Button className="w-full sm:w-auto shadow-lg shadow-primary/20">Vote Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-white/5 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Box className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="font-medium text-white mb-2">No active polls at the moment</p>
                  <Link href="#" className="text-primary hover:underline text-sm">Browse all polls</Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Available Quests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" /> Available Quests
              </h2>
            </div>
            
            <Card className="border-white/5 border-dashed h-[300px]">
              <CardContent className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-white mb-2">No quests available</p>
                <p className="text-sm text-muted-foreground px-4">Check back later for new community quests to earn extra rewards.</p>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
      
      {/* Floating Action Button */}
      <Button 
        size="icon" 
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 rounded-full shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 text-white z-40"
      >
        <PlusCircle className="w-6 h-6" />
      </Button>
    </AppLayout>
  );
}
