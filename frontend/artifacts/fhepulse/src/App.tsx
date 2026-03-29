import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/contexts/WalletContext";
import NotFound from "@/pages/not-found";

// Page imports
import Home from "@/pages/Home";
import CreatorDashboard from "@/pages/CreatorDashboard";
import ParticipantDashboard from "@/pages/ParticipantDashboard";
import DonorDashboard from "@/pages/DonorDashboard";
import PollPage from "@/pages/PollPage";

// Creator pages
import ManagePolls from "@/pages/creator/ManagePolls";
import Questionnaires from "@/pages/creator/Questionnaires";
import Distributions from "@/pages/creator/Distributions";
import CreatorQuests from "@/pages/creator/CreatorQuests";

// Participant pages
import ParticipantQuests from "@/pages/participant/ParticipantQuests";
import MyPoints from "@/pages/participant/MyPoints";
import Membership from "@/pages/participant/Membership";
import RewardsHistory from "@/pages/participant/RewardsHistory";

// Donor pages
import ExplorePolls from "@/pages/donor/ExplorePolls";
import FundedPolls from "@/pages/donor/FundedPolls";
import FundingHistory from "@/pages/donor/FundingHistory";
import Trending from "@/pages/donor/Trending";

// Shared pages
import TokenStats from "@/pages/shared/TokenStats";
import Analytics from "@/pages/shared/Analytics";
import Settings from "@/pages/shared/Settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Creator */}
      <Route path="/creator" component={CreatorDashboard} />
      <Route path="/creator/polls" component={ManagePolls} />
      <Route path="/creator/questionnaires" component={Questionnaires} />
      <Route path="/creator/distributions" component={Distributions} />
      <Route path="/creator/quests" component={CreatorQuests} />

      {/* Participant */}
      <Route path="/participant" component={ParticipantDashboard} />
      <Route path="/participant/quests" component={ParticipantQuests} />
      <Route path="/participant/points" component={MyPoints} />
      <Route path="/participant/membership" component={Membership} />
      <Route path="/participant/rewards" component={RewardsHistory} />

      {/* Donor */}
      <Route path="/donor" component={DonorDashboard} />
      <Route path="/donor/explore" component={ExplorePolls} />
      <Route path="/donor/funded" component={FundedPolls} />
      <Route path="/donor/history" component={FundingHistory} />
      <Route path="/donor/trending" component={Trending} />

      {/* Shared */}
      <Route path="/token-stats" component={TokenStats} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />

      <Route path="/poll/:address" component={PollPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WalletProvider>
  );
}

export default App;
