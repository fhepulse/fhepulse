import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { BarChart3, PieChart, Users, Activity, TrendingUp } from "lucide-react";
import { useAnalyticsData } from "@/hooks/use-mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Analytics() {
  const data = useAnalyticsData();

  return (
    <AppLayout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Analytics</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Platform Analytics</h1>
            <p className="text-muted-foreground mt-1">Aggregate statistics across the FhePulse ecosystem</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg"><PieChart className="w-5 h-5 text-primary" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{data.totalPolls.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Polls</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Activity className="w-5 h-5 text-blue-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{data.totalVotes.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Votes</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><Users className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{data.uniqueVoters.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Unique Voters</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-amber-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{data.avgResponseRate}%</h3>
              <p className="text-sm text-muted-foreground">Avg Response Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity Chart */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="polls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="votes" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topCategories.map((cat, i) => {
                const maxVotes = data.topCategories[0].votes;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{cat.polls} polls</span>
                        <span>{cat.votes.toLocaleString()} votes</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(cat.votes / maxVotes) * 100}%` }}
                      />
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
