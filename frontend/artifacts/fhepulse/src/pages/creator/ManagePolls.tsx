import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  ListChecks, PlusCircle, Filter, Search,
  MoreVertical, Users, Clock, Coins
} from "lucide-react";
import { useCreatorPolls } from "@/hooks/use-mock-data";
import { useState } from "react";

const statusColors = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  completed: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  seeking_funding: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

const statusLabels = {
  active: "Active",
  completed: "Completed",
  seeking_funding: "Seeking Funding",
};

export default function ManagePolls() {
  const polls = useCreatorPolls();
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? polls : polls.filter((p) => p.status === filter);

  return (
    <AppLayout role="Creator">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/creator" className="hover:text-white cursor-pointer">Creator</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Manage Polls</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Manage Polls</h1>
              <p className="text-muted-foreground mt-1">View and manage all your created polls</p>
            </div>
            <Link href="/creator">
              <Button className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Create New Poll
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {["all", "active", "completed", "seeking_funding"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f === "all" ? "All" : statusLabels[f as keyof typeof statusLabels]}
            </Button>
          ))}
        </div>

        {/* Poll List */}
        <div className="space-y-4">
          {filtered.map((poll) => (
            <Card key={poll.id} className="border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg truncate">{poll.title}</h3>
                      <Badge className={statusColors[poll.status]}>
                        {statusLabels[poll.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {poll.responses} responses</span>
                      <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> {poll.reward}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {poll.deadline}</span>
                      <Badge variant="outline" className="text-xs capitalize">{poll.mode}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="border-white/5 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <ListChecks className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="font-medium text-white mb-2">No polls match this filter</p>
              <p className="text-sm text-muted-foreground">Try selecting a different status filter</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
