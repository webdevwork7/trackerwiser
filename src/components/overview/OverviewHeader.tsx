import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@supabase/supabase-js";
import { Sparkles, TrendingUp, Shield, Zap } from "lucide-react";

interface OverviewHeaderProps {
  user: User | null;
}

const OverviewHeader = ({ user }: OverviewHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getTimeOfDay = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Welcome Card */}
      <Card className="bg-gradient-to-br from-sky-500 via-blue-500 to-teal-500 border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {getGreeting()}, {user?.email?.split("@")[0]}! 👋
              </CardTitle>
              <CardDescription className="text-sky-100 text-lg">
                Welcome to your personalized analytics dashboard
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-sky-100 mb-1">Current Time</div>
              <div className="text-2xl font-bold text-white">
                {getTimeOfDay()}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">TrackWiser</div>
              <div className="text-sky-100 text-sm">Analytics Platform</div>
            </div>

            <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">
                Bot Protection
              </div>
              <div className="text-sky-100 text-sm">Active Security</div>
            </div>

            <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">Real-time</div>
              <div className="text-sky-100 text-sm">Live Analytics</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Banner */}
      <Card className="bg-white/80 border-sky-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-900">
                System Status: All Systems Operational
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              Optimal Performance
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewHeader;
