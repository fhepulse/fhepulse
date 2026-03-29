import { AppLayout } from "@/components/layout/AppLayout";
import { useCreatorStats, useChartData } from "@/hooks/use-mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, FileText, Target, FolderPlus, 
  BarChart2, Users, Activity, Coins, Zap
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

export default function CreatorDashboard() {
  const stats = useCreatorStats();
  const chartData = useChartData();

  return (
    <AppLayout role="Creator">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Header & Marquee */}
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="hover:text-white cursor-pointer">Home</span>
            <span className="mx-2">›</span>
            <span className="text-white">Creator</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Creator Dashboard</h1>
            <p className="text-muted-foreground mt-1">Analytics and insights for your polls</p>
          </div>

          <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-lg p-3 flex items-center overflow-hidden relative">
            <Zap className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
            <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite]">
              <span className="text-amber-100 font-medium">🔥 Earn leading rank: Answered #12,573 total submissions this week across the network. Keep creating to earn more rewards!</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-auto py-4 flex flex-col gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 shadow-none hover-elevate">
            <PlusCircle className="w-6 h-6" />
            <span>Create Poll</span>
          </Button>
          <Button className="h-auto py-4 flex flex-col gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-none hover-elevate">
            <FileText className="w-6 h-6" />
            <span>Create Questionnaire</span>
          </Button>
          <Button className="h-auto py-4 flex flex-col gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 shadow-none hover-elevate">
            <Target className="w-6 h-6" />
            <span>Create Quest</span>
          </Button>
          <Button className="h-auto py-4 flex flex-col gap-2 bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 border border-slate-500/20 shadow-none hover-elevate">
            <FolderPlus className="w-6 h-6" />
            <span>Create Project</span>
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-elevate transition-colors border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg"><BarChart2 className="w-5 h-5 text-muted-foreground" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalPolls}</h3>
              <p className="text-sm text-muted-foreground">Total Polls</p>
              <p className="text-xs text-muted-foreground/60 mt-1">All polls created</p>
            </CardContent>
          </Card>
          <Card className="hover-elevate transition-colors border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg"><Users className="w-5 h-5 text-muted-foreground" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalResponses.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Responses</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Across all polls</p>
            </CardContent>
          </Card>
          <Card className="hover-elevate transition-colors border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg"><Activity className="w-5 h-5 text-muted-foreground" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.activePolls}</h3>
              <p className="text-sm text-muted-foreground">Active Polls</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Currently running</p>
            </CardContent>
          </Card>
          <Card className="hover-elevate transition-colors border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg"><Coins className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-emerald-400">{stats.totalFunded}</h3>
              <p className="text-sm text-muted-foreground">Total Funded (ETH)</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Rewards distributed</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Lists */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-white/5">
              <CardHeader>
                <CardTitle>Responses Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorResp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: 'white' }}
                      />
                      <Area type="monotone" dataKey="responses" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorResp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5">
              <CardHeader>
                <CardTitle>Responses Overview</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <BarChart2 className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground">No response data available for detailed breakdown yet.</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-white/5 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Pending Distributions</CardTitle>
                <Badge variant="secondary">0</Badge>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[calc(100%-4rem)] py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-white mb-1">All caught up!</p>
                <p className="text-sm text-muted-foreground px-4">You have no pending rewards to distribute to participants.</p>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
