import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, BarChart2, Coins, Target, Sparkles, Send, Wallet, Check, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { usePlatformStats } from "@/hooks/use-mock-data";
import { useLocation } from "wouter";

function Counter({ value, suffix = "" }: { value: number | string, suffix?: string }) {
  return <span>{value}{suffix}</span>;
}

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

export default function Home() {
  const stats = usePlatformStats();
  const [, setLocation] = useLocation();
  const [pollText, setPollText] = useState("");

  const handleCreateQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (pollText.trim()) {
      setLocation("/creator");
    }
  };

  const howItWorksSteps = [
    {
      step: "01",
      title: "Connect Your Wallet",
      description: "Link your Web3 wallet to get started. BasePulse works with all major wallets including MetaMask, Coinbase Wallet, and WalletConnect.",
      icon: Wallet
    },
    {
      step: "02",
      title: "Create or Discover Polls",
      description: "As a Creator, design surveys and polls. As a Participant, browse active polls and complete quests to earn rewards.",
      icon: Target
    },
    {
      step: "03",
      title: "Fund & Incentivize",
      description: "Donors fund polls to attract participants. Higher rewards = more quality responses. All transactions are transparent on-chain.",
      icon: Coins
    },
    {
      step: "04",
      title: "Earn & Distribute Rewards",
      description: "Participants earn tokens for valid responses. Creators gather valuable insights. Rewards are distributed automatically via smart contracts.",
      icon: Check
    }
  ];

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-glow.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span>Decentralized polling on Base</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Empower your community with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                verifiable insights.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Create polls, gather authenticated responses, and reward participants instantly. The premier data layer for Web3 communities.
            </p>

            <form onSubmit={handleCreateQuick} className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-card border border-white/10 rounded-2xl p-2 shadow-2xl">
                <input 
                  type="text" 
                  value={pollText}
                  onChange={(e) => setPollText(e.target.value)}
                  placeholder="Ask the community anything..." 
                  className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg text-white placeholder:text-muted-foreground/70"
                />
                <Button type="submit" size="lg" className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/25">
                  <Send className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5"
          >
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter value={stats.pollsCreated.toLocaleString()} />
              </p>
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Polls Created</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter value={stats.totalResponses.toLocaleString()} />
              </p>
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Total Responses</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2">
                <Counter value={stats.rewardsDistributed} suffix=" ETH" />
              </p>
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Rewards Distributed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter value={stats.activePolls} />
              </p>
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Active Polls</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roles / Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">An ecosystem for everyone</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Join BasePulse in the role that fits you best. Participate to earn, create to gather insights, or fund to support the community.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChild}>
            <Card className="h-full bg-gradient-to-b from-card to-background border-white/10 hover:border-blue-500/30 transition-colors group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart2 className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Creator</h3>
                <p className="text-muted-foreground mb-6">Design polls, questionnaires, and quests. Gather verifiable on-chain data and insights from your community.</p>
                <Button variant="outline" className="w-full group-hover:bg-white/5" onClick={() => setLocation('/creator')}>
                  Go to Creator Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChild}>
            <Card className="h-full bg-gradient-to-b from-card to-background border-white/10 hover:border-purple-500/30 transition-colors group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Participant</h3>
                <p className="text-muted-foreground mb-6">Vote on active polls, complete community quests, and earn crypto rewards directly to your wallet.</p>
                <Button variant="outline" className="w-full group-hover:bg-white/5" onClick={() => setLocation('/participant')}>
                  Start Earning <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerChild}>
            <Card className="h-full bg-gradient-to-b from-card to-background border-white/10 hover:border-emerald-500/30 transition-colors group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Coins className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Donor</h3>
                <p className="text-muted-foreground mb-6">Fund important polls to incentivize participation. Boost community engagement for topics you care about.</p>
                <Button variant="outline" className="w-full group-hover:bg-white/5" onClick={() => setLocation('/donor')}>
                  Explore Funding <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span>Simple &amp; Transparent</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How BasePulse works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Get started in four simple steps. Everything is on-chain, transparent, and permissionless.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChild}
                className="relative"
              >
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="bg-card border border-white/8 rounded-2xl p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold text-white/5">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-card border border-white/8 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Join 12,000+ community members</p>
                <p className="text-muted-foreground text-sm">Already participating in the decentralized data economy</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setLocation('/participant')}>
                Start as Participant
              </Button>
              <Button onClick={() => setLocation('/creator')} className="bg-primary hover:bg-primary/90">
                Create a Poll
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-blue-900 opacity-90" />
          
          <div className="relative z-10 px-8 py-16 md:py-20 md:px-16 text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to tap into the pulse?</h2>
            <p className="text-lg text-white/80 max-w-2xl mb-10">Connect your wallet to start participating in the decentralized data economy. No hidden fees, completely transparent.</p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-10 h-14 rounded-xl shadow-2xl">
              <Wallet className="w-5 h-5 mr-3" />
              Connect Wallet
            </Button>
          </div>
        </motion.div>
      </section>
    </AppLayout>
  );
}
