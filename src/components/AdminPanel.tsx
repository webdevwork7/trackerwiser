import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  RefreshCw,
  LogOut,
  BarChart3,
  Bot,
  EyeOff,
  Globe,
  Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminStats from "./admin/AdminStats";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminBotManagement from "./admin/AdminBotManagement";
import AdminCloaking from "./admin/AdminCloaking";
import AdminWebsites from "./admin/AdminWebsites";
import AdminSettings from "./admin/AdminSettings";

interface AdminStats {
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
}

const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalWebsites: 0,
    totalEvents: 0,
    totalBotDetections: 0,
    activeWebsites: 0,
    blockedBots: 0,
    todayEvents: 0,
    todayBots: 0,
    totalSessions: 0,
    avgSessionDuration: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total websites
      const { data: websitesData } = await supabase
        .from("websites")
        .select("*");

      // Fetch total events
      const { count: eventsCount } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true });

      // Fetch total bot detections
      const { count: botsCount } = await supabase
        .from("bot_detections")
        .select("*", { count: "exact", head: true });

      // Fetch today's data
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: todayEvents } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      const { count: todayBots } = await supabase
        .from("bot_detections")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      // Calculate stats
      const activeWebsites =
        websitesData?.filter((w) => w.is_active).length || 0;
      const totalSessions = Math.floor((eventsCount || 0) * 0.3);
      const avgSessionDuration = Math.round((eventsCount || 0) * 2.5);
      const conversionRate = Math.round((eventsCount || 0) * 0.042);

      setStats({
        totalUsers: usersCount || 0,
        totalWebsites: websitesData?.length || 0,
        totalEvents: eventsCount || 0,
        totalBotDetections: botsCount || 0,
        activeWebsites,
        blockedBots: Math.floor((botsCount || 0) * 0.8),
        todayEvents: todayEvents || 0,
        todayBots: todayBots || 0,
        totalSessions,
        avgSessionDuration,
        conversionRate,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-red-900 flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Admin Panel - System Overview
              </CardTitle>
              <CardDescription className="text-red-700">
                Manage all websites, monitor analytics, and control system
                settings
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={fetchAdminData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AdminStats stats={stats} />
        </CardContent>
      </Card>

      {/* Admin Tabs */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200">
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="bot-management"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <Bot className="w-4 h-4 mr-2" />
            Bot Management
          </TabsTrigger>
          <TabsTrigger
            value="cloaking"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Cloaking
          </TabsTrigger>
          <TabsTrigger
            value="websites"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <Globe className="w-4 h-4 mr-2" />
            Website Management
          </TabsTrigger>
          <TabsTrigger
            value="admin"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="bot-management">
          <AdminBotManagement stats={stats} />
        </TabsContent>

        <TabsContent value="cloaking">
          <AdminCloaking />
        </TabsContent>

        <TabsContent value="websites">
          <AdminWebsites />
        </TabsContent>

        <TabsContent value="admin">
          <AdminSettings stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
