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
  Clock,
  Eye,
  Shield,
  Users,
  Globe,
  Activity,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
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

interface OverviewRecentActivityProps {
  stats: UserStats;
}

const OverviewRecentActivity = ({ stats }: OverviewRecentActivityProps) => {
  const getTimeAgo = (minutes: number) => {
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const generateActivities = () => {
    const activities = [];
    const now = new Date();

    if (stats.totalWebsites === 0) {
      return [
        {
          id: 1,
          type: "info",
          title: "Welcome to TrackWiser!",
          description: "Get started by adding your first website",
          time: "Just now",
          icon: Info,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
        },
      ];
    }

    if (stats.todayVisitors > 0) {
      activities.push({
        id: 1,
        type: "visitor",
        title: `${stats.todayVisitors} visitors today`,
        description: `Across ${stats.activeWebsites} active websites`,
        time: getTimeAgo(5),
        icon: Users,
        color: "text-green-500",
        bgColor: "bg-green-50",
      });
    }

    if (stats.todayBotsBlocked > 0) {
      activities.push({
        id: 2,
        type: "security",
        title: `${stats.todayBotsBlocked} bots blocked`,
        description: "Security protection active",
        time: getTimeAgo(8),
        icon: Shield,
        color: "text-red-500",
        bgColor: "bg-red-50",
      });
    }

    if (stats.todayPageViews > 0) {
      activities.push({
        id: 3,
        type: "pageview",
        title: `${stats.todayPageViews} page views`,
        description: "Content engagement tracking",
        time: getTimeAgo(12),
        icon: Eye,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
      });
    }

    activities.push({
      id: 4,
      type: "system",
      title: "Dashboard loaded successfully",
      description: "Your personalized data is ready",
      time: getTimeAgo(1),
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50",
    });

    return activities;
  };

  const activities = generateActivities();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "visitor":
        return <Users className="w-4 h-4" />;
      case "security":
        return <Shield className="w-4 h-4" />;
      case "pageview":
        return <Eye className="w-4 h-4" />;
      case "system":
        return <CheckCircle className="w-4 h-4" />;
      case "info":
        return <Info className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white/80 border-sky-100 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-sky-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest events from your tracking system
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {stats.totalWebsites === 0 ? (
          <div className="text-center py-8">
            <Globe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No websites added yet
            </h3>
            <p className="text-slate-600 mb-4">
              Add your first website to start seeing activity here
            </p>
            <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
              <Globe className="w-4 h-4 mr-2" />
              Add Your First Website
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-sm ${
                  index === 0
                    ? "bg-slate-50 border-slate-200"
                    : "bg-white border-slate-100"
                }`}
              >
                <div
                  className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <div className={activity.color}>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                className="w-full text-sky-600 hover:text-sky-700 hover:bg-sky-50"
              >
                View All Activity
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewRecentActivity;
