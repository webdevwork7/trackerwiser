import { Users, Globe, Activity, Bot } from "lucide-react";

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalWebsites: number;
    totalEvents: number;
    totalBotDetections: number;
    activeWebsites: number;
    blockedBots: number;
    todayEvents: number;
    todayBots: number;
    totalSessions: number;
    avgSessionDuration: number;
    conversionRate: number;
  };
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Websites",
      value: stats.totalWebsites,
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Today's Events",
      value: stats.todayEvents,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Today's Bots",
      value: stats.todayBots,
      icon: Bot,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`text-center p-4 ${stat.bgColor} rounded-lg border ${stat.borderColor}`}
        >
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value.toLocaleString()}
          </div>
          <div className={`${stat.color} text-sm font-medium`}>
            {stat.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
