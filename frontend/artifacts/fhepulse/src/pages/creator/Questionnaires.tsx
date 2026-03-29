import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { FileText, PlusCircle, MessageSquare, Users, Calendar } from "lucide-react";
import { useQuestionnaires } from "@/hooks/use-mock-data";

const statusColors = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  draft: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

export default function Questionnaires() {
  const questionnaires = useQuestionnaires();

  return (
    <AppLayout role="Creator">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/creator" className="hover:text-white cursor-pointer">Creator</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Questionnaires</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Questionnaires</h1>
              <p className="text-muted-foreground mt-1">Create and manage multi-question surveys</p>
            </div>
            <Button className="gap-2">
              <PlusCircle className="w-4 h-4" />
              New Questionnaire
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{questionnaires.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{questionnaires.filter(q => q.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{questionnaires.filter(q => q.status === 'draft').length}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{questionnaires.reduce((s, q) => s + q.responses, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Responses</p>
            </CardContent>
          </Card>
        </div>

        {/* Questionnaire List */}
        <div className="grid gap-4 md:grid-cols-2">
          {questionnaires.map((q) => (
            <Card key={q.id} className="border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{q.title}</h3>
                  <Badge className={`${statusColors[q.status]} capitalize`}>{q.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {q.questions} questions</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {q.responses} responses</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {q.createdAt}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">View</Button>
                  {q.status === 'draft' && <Button size="sm" className="flex-1">Publish</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
