import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Coins, ExternalLink, CheckCircle, ArrowDownRight } from "lucide-react";
import { useFundingHistory } from "@/hooks/use-mock-data";

export default function FundingHistory() {
  const history = useFundingHistory();
  const totalFunded = history.reduce((s, h) => s + parseFloat(h.amount), 0).toFixed(1);

  return (
    <AppLayout role="Donor">
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/donor" className="hover:text-white cursor-pointer">Donor</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Funding History</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Funding History</h1>
            <p className="text-muted-foreground mt-1">Complete record of all your funding transactions</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Coins className="w-5 h-5 text-blue-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1 text-blue-400">{totalFunded} ETH</h3>
              <p className="text-sm text-muted-foreground">Total Funded</p>
            </CardContent>
          </Card>
          <Card className="border-white/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{history.length}</h3>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction List */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ArrowDownRight className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.pollTitle}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{tx.date}</span>
                        <span className="flex items-center gap-1 text-primary cursor-pointer hover:underline">
                          {tx.txHash} <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{tx.amount}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Confirmed</Badge>
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
