import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Activity,
  Zap,
  Award,
  Star,
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

interface OverviewPerformanceProps {
  stats: UserStats;
}

const OverviewPerformance = ({ stats }: OverviewPerformanceProps) => {
  const getPerformanceScore = () => {
    if (stats.totalWebsites === 0) return 0;
    const score = Math.min(
      100,
      (stats.activeWebsites / Math.max(stats.totalWebsites, 1)) * 100
    );
    return Math.round(score);
  };

  const getBotProtectionScore = () => {
    if (stats.totalVisitors === 0) return 100;
    const botRate =
      (stats.totalBotsBlocked /
        (stats.totalVisitors + stats.totalBotsBlocked)) *
      100;
    return Math.min(100, Math.round(botRate));
  };

  const getEngagementScore = () => {
    if (stats.totalVisitors === 0) return 0;
    const avgPageViews =
      stats.totalPageViews / Math.max(stats.totalVisitors, 1);
    return Math.min(100, Math.round(avgPageViews * 10));
  };

  const performanceMetrics = [
    {
      title: "Website Performance",
      score: getPerformanceScore(),
      icon: Target,
      color: "from-blue-500 to-blue-600",
      description: "Active websites vs total",
      status:
        getPerformanceScore() > 80
          ? "Excellent"
          : getPerformanceScore() > 60
          ? "Good"
          : "Needs attention",
    },
    {
      title: "Bot Protection",
      score: getBotProtectionScore(),
      icon: Award,
      color: "from-green-500 to-green-600",
      description: "Threat detection rate",
      status: getBotProtectionScore() > 10 ? "Active" : "Minimal threats",
    },
    {
      title: "User Engagement",
      score: getEngagementScore(),
      icon: Star,
      color: "from-purple-500 to-purple-600",
      description: "Average page views per visitor",
      status:
        getEngagementScore() > 50
          ? "High"
          : getEngagementScore() > 20
          ? "Medium"
          : "Low",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
      case "Active":
      case "High":
        return "text-green-600 bg-green-50";
      case "Good":
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-red-600 bg-red-50";
    }
  };

  return (
    <Card className="bg-white/80 border-sky-100 h-full">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-sky-500" />
          Performance Metrics
        </CardTitle>
        <CardDescription>
          Key performance indicators and system health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}
                  >
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {metric.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {metric.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">
                    {metric.score}%
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      metric.status
                    )} border-0 text-xs`}
                  >
                    {metric.status}
                  </Badge>
                </div>
              </div>

              <Progress value={metric.score} className="h-2" />
            </div>
          ))}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-slate-900">
                {stats.activeWebsites}
              </div>
              <div className="text-xs text-slate-600">Active Sites</div>
            </div>

            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-slate-900">
                {stats.todayVisitors}
              </div>
              <div className="text-xs text-slate-600">Today's Visitors</div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-lg p-4 border border-sky-200">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-sky-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  Performance Tips
                </h4>
                <p className="text-sm text-slate-600">
                  {stats.totalWebsites === 0
                    ? "Add your first website to start tracking performance metrics"
                    : "Your tracking is performing well. Consider adding more websites for better insights."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewPerformance;
