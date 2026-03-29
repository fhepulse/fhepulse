import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, Target, Users, Coins, Clock, Heart } from "lucide-react";
import { usePolls } from "@/hooks/use-mock-data";
import { useState } from "react";

export default function ExplorePolls() {
  const { polls, isLoading } = usePolls();
  const [search, setSearch] = useState("");

  const filtered = polls.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout role="Donor">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/donor" className="hover:text-white cursor-pointer">Donor</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Explore Polls</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Explore Polls</h1>
            <p className="text-muted-foreground mt-1">Discover and fund polls that matter to you</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search polls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground"
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-white/5 border-white/5 h-32" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((poll) => (
              <Card key={poll.id} className="border-white/5 hover:border-blue-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{poll.title}</h3>
                        <Badge className={
                          poll.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                          poll.status === 'seeking_funding' ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                          "bg-slate-500/10 text-slate-400 border-slate-500/30"
                        }>
                          {poll.status === 'seeking_funding' ? 'Seeking Funding' : poll.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{poll.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {poll.participants}</span>
                        <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> {poll.reward}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {poll.timeLeft}</span>
                      </div>
                    </div>
                    <Button className="gap-2 shrink-0">
                      <Heart className="w-4 h-4" /> Fund Poll
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <Card className="border-white/5 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="font-medium text-white mb-2">No polls found</p>
                  <p className="text-sm text-muted-foreground">Try a different search term</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
