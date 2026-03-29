import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Award, Lock, CheckCircle2, Star, Calendar } from "lucide-react";
import { useMembershipData } from "@/hooks/use-mock-data";

export default function Membership() {
  const data = useMembershipData();
  const currentTierIndex = data.tiers.findIndex((t) => t.name === data.tier);

  return (
    <AppLayout role="Participant">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/participant" className="hover:text-white cursor-pointer">Participant</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Membership</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Membership</h1>
            <p className="text-muted-foreground mt-1">Your membership tier and benefits</p>
          </div>
        </div>

        {/* Tier Card */}
        <Card className="border-slate-300/20 bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-300/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-10 h-10 text-slate-300" />
                  <div>
                    <h2 className="text-3xl font-bold text-slate-300">{data.tier} Member</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Member since {data.joinedDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-3xl font-bold">{data.totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier Progression */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Tier Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex items-start mb-6">
              {/* Connector lines between tier icons */}
              <div className="absolute top-5 left-0 right-0 flex px-[calc(12.5%-5px)]">
                {data.tiers.slice(0, -1).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-0.5 ${i < currentTierIndex ? "bg-primary" : "bg-white/10"}`}
                  />
                ))}
              </div>
              {/* Tier icons */}
              {data.tiers.map((tier, i) => (
                <div key={tier.name} className="flex-1 flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    i <= currentTierIndex
                      ? "bg-primary text-white"
                      : "bg-white/5 text-muted-foreground"
                  }`}>
                    <Star className="w-5 h-5" />
                  </div>
                  <p className={`text-xs font-medium ${i <= currentTierIndex ? "text-white" : "text-muted-foreground"}`}>
                    {tier.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{tier.minPoints}+ pts</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.benefits.map((benefit) => (
                <div key={benefit.name} className={`flex items-start gap-4 p-4 rounded-lg ${
                  benefit.unlocked ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-white/[0.02] border border-white/5"
                }`}>
                  <div className={`p-2 rounded-lg ${benefit.unlocked ? "bg-emerald-500/10" : "bg-white/5"}`}>
                    {benefit.unlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{benefit.name}</h3>
                      {!benefit.unlocked && benefit.requiredTier && (
                        <Badge variant="outline" className="text-xs">{benefit.requiredTier}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
