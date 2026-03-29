import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Settings as SettingsIcon, User, Bell, Shield, Wallet, Globe, Moon } from "lucide-react";
import { useWallet } from "@/hooks/use-mock-data";

export default function Settings() {
  const wallet = useWallet();

  return (
    <AppLayout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-white cursor-pointer">Home</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-white">Settings</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>
        </div>

        {/* Profile */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                FP
              </div>
              <div>
                <p className="font-semibold">{wallet.address}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Connected</Badge>
                  <Badge variant="outline">{wallet.network}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <label className="text-sm text-muted-foreground">Display Name</label>
                <input
                  type="text"
                  placeholder="Enter display name"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email (optional)</label>
                <input
                  type="email"
                  placeholder="Enter email for notifications"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wallet className="w-5 h-5" /> Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="font-medium">Connected Wallet</p>
                <p className="text-sm text-muted-foreground">{wallet.address}</p>
              </div>
              <Badge>{wallet.balance}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <p className="font-medium">Network</p>
                <p className="text-sm text-muted-foreground">Currently connected to {wallet.network}</p>
              </div>
              <Button variant="outline" size="sm">Switch</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Auto-connect</p>
                <p className="text-sm text-muted-foreground">Automatically connect wallet on visit</p>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Poll Results", desc: "Get notified when polls you participated in are finalized" },
              { label: "Reward Claims", desc: "Get notified when rewards are available to claim" },
              { label: "New Polls", desc: "Get notified about new polls in categories you follow" },
              { label: "Quest Updates", desc: "Get notified about new and expiring quests" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <div className="w-10 h-6 bg-white/10 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5" /> Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme (default)</p>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg">Save Changes</Button>
        </div>
      </div>
    </AppLayout>
  );
}
