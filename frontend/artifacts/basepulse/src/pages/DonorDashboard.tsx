import { AppLayout } from "@/components/layout/AppLayout";
import { useDonorStats, usePolls } from "@/hooks/use-mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Heart, Coins, Target, Award, Search, 
  CheckCircle, TrendingUp, ArrowRight, Banknote
} from "lucide-react";

export default function DonorDashboard() {
  const stats = useDonorStats();
  const { polls, isLoading } = usePolls('seeking_funding');

  return (
    <AppLayout role="Donor">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-50" />
          <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"}} />
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Badge className="bg-white/10 hover:bg-white/20 text-blue-300 border-blue-500/30 mb-4 backdrop-blur-md">Donor</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">Donor Dashboard</h1>
              <p className="text-lg text-white/70 max-w-xl">Explore polls to fund and track your impact on the community. Support the data you want to see.</p>
            </div>
            <Button size="lg" className="bg-white text-blue-900 hover:bg-white/90 font-bold w-full md:w-auto">
              Deposit Funds
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Coins className="w-5 h-5 text-blue-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-blue-400">{stats.totalFunded} ETH</h3>
              <p className="text-sm text-white font-medium">Total Funded</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.pollsFunded}</h3>
              <p className="text-sm text-white font-medium">Polls Funded</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg"><Target className="w-5 h-5 text-purple-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.activeFunding}</h3>
              <p className="text-sm text-white font-medium">Active Funding</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg"><Award className="w-5 h-5 text-amber-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-amber-400">{stats.impactScore}</h3>
              <p className="text-sm text-white font-medium">Impact Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-white/5 hover:border-blue-500/50 transition-colors group cursor-pointer bg-gradient-to-b from-card to-background">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Explore Polls</h3>
              <p className="text-sm text-muted-foreground">Discover polls that need funding and support causes you care about in the ecosystem.</p>
            </CardContent>
          </Card>
          
          <Card className="border-white/5 hover:border-emerald-500/50 transition-colors group cursor-pointer bg-gradient-to-b from-card to-background">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Funded Polls</h3>
              <p className="text-sm text-muted-foreground">View and manage polls you've already funded and track their progress and responses.</p>
            </CardContent>
          </Card>

          <Card className="border-white/5 hover:border-amber-500/50 transition-colors group cursor-pointer bg-gradient-to-b from-card to-background">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trending Polls</h3>
              <p className="text-sm text-muted-foreground">See the most popular polls attracting community attention and consider boosting them.</p>
            </CardContent>
          </Card>
        </div>

        {/* Seeking Funding Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Polls Seeking Funding
            </h2>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Explore All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <Card key={i} className="animate-pulse bg-white/5 border-white/5 h-32" />
              ))}
            </div>
          ) : polls.length > 0 ? (
            <div className="grid gap-4">
              {polls.map((poll) => (
                <Card key={poll.id} className="border-white/5 hover:border-white/20 transition-all">
                  <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs bg-rose-500/10 text-rose-400 border-rose-500/20">{poll.reward}</Badge>
                        <span className="text-xs text-muted-foreground">Created by {poll.creator}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{poll.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{poll.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
                        <Banknote className="w-4 h-4 mr-2" /> Fund Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-white/5 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-white mb-2">No polls seeking funding at the moment</p>
                <Link href="#" className="text-primary hover:underline text-sm">Browse all active polls</Link>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
