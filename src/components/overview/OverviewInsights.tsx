import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  TrendingUp,
  Shield,
  Globe,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
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

interface OverviewInsightsProps {
  stats: UserStats;
}

const OverviewInsights = ({ stats }: OverviewInsightsProps) => {
  const getInsights = () => {
    const insights = [];

    if (stats.totalWebsites === 0) {
      insights.push({
        type: "primary",
        title: "Get Started with TrackWiser",
        description:
          "Add your first website to unlock powerful analytics and bot protection",
        icon: Globe,
        color: "from-blue-500 to-blue-600",
        action: "Add Website",
        priority: "high",
      });
    } else if (stats.activeWebsites === 0) {
      insights.push({
        type: "warning",
        title: "Activate Your Websites",
        description:
          "You have websites but none are currently active. Activate them to start tracking",
        icon: AlertCircle,
        color: "from-yellow-500 to-yellow-600",
        action: "Activate Sites",
        priority: "high",
      });
    } else {
      if (stats.todayVisitors === 0) {
        insights.push({
          type: "info",
          title: "No Visitors Today",
          description:
            "Your websites are active but no visitors detected. Check your tracking code installation",
          icon: Target,
          color: "from-sky-500 to-sky-600",
          action: "Check Setup",
          priority: "medium",
        });
      }

      if (stats.todayBotsBlocked > 0) {
        insights.push({
          type: "success",
          title: "Bot Protection Active",
          description: `Successfully blocked ${stats.todayBotsBlocked} bot threats today`,
          icon: Shield,
          color: "from-green-500 to-green-600",
          action: "View Details",
          priority: "low",
        });
      }

      if (stats.todayVisitors > 0 && stats.todayPageViews > 0) {
        const avgPageViews = stats.todayPageViews / stats.todayVisitors;
        if (avgPageViews < 2) {
          insights.push({
            type: "info",
            title: "Low Engagement Detected",
            description:
              "Visitors are viewing few pages. Consider improving content or navigation",
            icon: TrendingUp,
            color: "from-purple-500 to-purple-600",
            action: "Optimize",
            priority: "medium",
          });
        }
      }
    }

    // Add general insights
    insights.push({
      type: "tip",
      title: "Pro Tip: Real-time Analytics",
      description:
        "Visit the Analytics tab to see live visitor data and behavioral insights",
      icon: Sparkles,
      color: "from-teal-500 to-teal-600",
      action: "View Analytics",
      priority: "low",
    });

    return insights;
  };

  const insights = getInsights();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-slate-200 bg-slate-50";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "primary":
        return "text-blue-600";
      case "warning":
        return "text-yellow-600";
      case "success":
        return "text-green-600";
      case "info":
        return "text-sky-600";
      case "tip":
        return "text-teal-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Insights Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center">
          <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
          Smart Insights
        </h2>
        <p className="text-slate-600">
          AI-powered recommendations to improve your tracking
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className={`bg-white/80 border transition-all duration-300 hover:shadow-lg ${getPriorityColor(
              insight.priority
            )}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <insight.icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {insight.title}
                    </h3>
                    <Badge
                      className={`${getTypeColor(
                        insight.type
                      )} bg-white border-0 text-xs`}
                    >
                      {insight.priority === "high"
                        ? "Important"
                        : insight.priority === "medium"
                        ? "Medium"
                        : "Info"}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    {insight.description}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-200 hover:border-slate-300"
                  >
                    {insight.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats Summary */}
      <Card className="bg-gradient-to-r from-slate-50 to-sky-50 border-sky-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-sky-500" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {stats.activeWebsites}
              </div>
              <div className="text-sm text-slate-600">Active Sites</div>
            </div>

            <div className="text-center p-3 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {stats.todayVisitors}
              </div>
              <div className="text-sm text-slate-600">Visitors</div>
            </div>

            <div className="text-center p-3 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {stats.todayPageViews}
              </div>
              <div className="text-sm text-slate-600">Page Views</div>
            </div>

            <div className="text-center p-3 bg-white/60 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">
                {stats.todayBotsBlocked}
              </div>
              <div className="text-sm text-slate-600">Bots Blocked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {stats.totalWebsites > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  Great Progress!
                </h3>
                <p className="text-sm text-slate-600">
                  You're successfully tracking {stats.totalWebsites} website
                  {stats.totalWebsites > 1 ? "s" : ""} with TrackWiser. Keep
                  monitoring your analytics for insights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewInsights;
