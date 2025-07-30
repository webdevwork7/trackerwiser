import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Eye,
  Shield,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MousePointer,
  Activity,
  Target,
} from "lucide-react";

interface UserStats {
  totalWebsites: number;
  activeWebsites: number;
  totalVisitors: number;
  todayVisitors: number;
  totalBotsBlocked: number;
  todayBotsBlocked: number;
  totalPageViews: number;
  todayPageViews: number;
}

interface OverviewStatsProps {
  stats: UserStats;
}

const OverviewStats = ({ stats }: OverviewStatsProps) => {
  // Force re-render when stats change
  const statsKey = JSON.stringify(stats);

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    }
    return <ArrowDownRight className="w-4 h-4 text-red-500" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-600";
    return "text-red-600";
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const statCards = [
    {
      title: "Active Websites",
      value: stats.activeWebsites,
      icon: Globe,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Websites currently tracking",
      trend: stats.activeWebsites > 0 ? "+12%" : "0%",
      trendColor: "text-green-600",
    },
    {
      title: "Today's Visitors",
      value: stats.todayVisitors,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "Real users today",
      trend: stats.todayVisitors > 0 ? "+8%" : "0%",
      trendColor: "text-green-600",
    },
    {
      title: "Bots Blocked",
      value: stats.todayBotsBlocked,
      icon: Shield,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      description: "Threats blocked today",
      trend: stats.todayBotsBlocked > 0 ? "+15%" : "0%",
      trendColor: "text-green-600",
    },
    {
      title: "Page Views",
      value: stats.todayPageViews,
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "Views today",
      trend: stats.todayPageViews > 0 ? "+5%" : "0%",
      trendColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6" key={statsKey}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/80 border-slate-200 hover:shadow-lg transition-all duration-300 group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge className={`${stat.bgColor} ${stat.iconColor} border-0`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.trend}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stat.value.toLocaleString()}
                  </h3>
                  <div className={`text-sm font-medium ${stat.trendColor}`}>
                    {stat.trend}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <Card className="bg-gradient-to-r from-slate-50 to-sky-50 border-sky-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-sky-500" />
            Performance Summary
          </CardTitle>
          <CardDescription>
            Key metrics and insights from your tracking data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalWebsites}
              </div>
              <div className="text-sm text-slate-600">Total Websites</div>
              <div className="text-xs text-slate-500 mt-1">
                {stats.activeWebsites} active
              </div>
            </div>

            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <MousePointer className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalVisitors}
              </div>
              <div className="text-sm text-slate-600">Total Visitors</div>
              <div className="text-xs text-slate-500 mt-1">All time</div>
            </div>

            <div className="text-center p-4 bg-white/60 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stats.totalBotsBlocked}
              </div>
              <div className="text-sm text-slate-600">Bots Blocked</div>
              <div className="text-xs text-slate-500 mt-1">All time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewStats;
