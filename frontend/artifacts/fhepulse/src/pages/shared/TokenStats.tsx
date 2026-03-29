import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BarChart3, TrendingUp, Users, Coins, DollarSign, ArrowUp } from "lucide-react";
import { useTokenStats } from "@/hooks/use-mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function TokenStats() {
  const stats = useTokenStats();

  return (
    <AppLayout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Token Stats</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">PULSE Token Stats</h1>
            <p className="text-muted-foreground mt-1">Live token metrics and market data</p>
          </div>
        </div>

        {/* Price Hero */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">PULSE Price</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-5xl font-bold">{stats.price}</h2>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" /> {stats.priceChange}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">All-time high: {stats.allTimeHigh}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-xl font-bold">{stats.marketCap}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-xl font-bold">{stats.volume24h}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Chart */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Price History (7D)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.priceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 0.02', 'dataMax + 0.02']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: 'white' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Token Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg"><DollarSign className="w-5 h-5 text-primary" /></div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.marketCap}</h3>
              <p className="text-sm text-muted-foreground">Market Cap</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Coins className="w-5 h-5 text-blue-400" /></div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalSupply}</h3>
              <p className="text-sm text-muted-foreground">Total Supply</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.circulatingSupply}</h3>
              <p className="text-sm text-muted-foreground">Circulating Supply</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg"><Users className="w-5 h-5 text-amber-400" /></div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.holders.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Token Holders</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
