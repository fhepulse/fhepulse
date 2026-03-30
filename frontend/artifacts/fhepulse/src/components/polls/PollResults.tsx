import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Trophy } from "lucide-react";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#f97316"];

export function PollResults({ results, optionCount, optionLabels = [] }: { results: number[]; optionCount: number; optionLabels?: string[] }) {
  const total = results.reduce((a, b) => a + b, 0);
  const maxIdx = results.indexOf(Math.max(...results));

  const data = results.map((value, i) => ({
    name: optionLabels[i] || `Option ${i + 1}`,
    votes: value,
    percent: total > 0 ? ((value / total) * 100).toFixed(1) : "0",
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
        <Trophy className="w-5 h-5 text-emerald-400" />
        <span className="text-sm text-emerald-400 font-medium">
          {data[maxIdx]?.name} wins with {data[maxIdx]?.percent}% of votes ({data[maxIdx]?.votes} points)
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={i === maxIdx ? 1 : 0.6} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-white">{item.name}</span>
              {i === maxIdx && <span className="text-xs bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Winner</span>}
            </div>
            <span className="text-muted-foreground font-mono">{item.votes} ({item.percent}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
