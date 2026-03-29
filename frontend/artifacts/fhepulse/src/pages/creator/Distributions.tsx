import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Coins, Users, CheckCircle2, Clock, ArrowRight, Send } from "lucide-react";
import { useDistributions } from "@/hooks/use-mock-data";

export default function Distributions() {
  const distributions = useDistributions();
  const pending = distributions.filter((d) => d.status === "pending");
  const completed = distributions.filter((d) => d.status === "distributed");

  return (
    <AppLayout role="Creator">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/creator" className="hover:text-white cursor-pointer">Creator</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Distributions</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Distributions</h1>
            <p className="text-muted-foreground mt-1">Manage reward distributions to poll participants</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg"><Clock className="w-5 h-5 text-amber-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-amber-400">{pending.length}</h3>
              <p className="text-sm text-muted-foreground">Pending Distributions</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-emerald-400">{completed.length}</h3>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-5 h-5 text-blue-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{distributions.reduce((s, d) => s + d.recipients, 0).toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Recipients</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Pending Distributions
            </h2>
            {pending.map((d) => (
              <Card key={d.id} className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{d.pollTitle}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> {d.totalReward}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {d.recipients} recipients</span>
                        <span>{d.createdAt}</span>
                      </div>
                    </div>
                    <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-black">
                      <Send className="w-4 h-4" /> Distribute Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Completed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Completed Distributions
          </h2>
          {completed.map((d) => (
            <Card key={d.id} className="border-white/5">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{d.pollTitle}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> {d.totalReward}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {d.recipients} recipients</span>
                      <span>Distributed {d.distributedAt}</span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Completed</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
