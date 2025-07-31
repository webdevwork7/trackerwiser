import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart3,
  Globe,
  Shield,
  Code,
  Users,
  Settings,
  Activity,
  Eye,
  MousePointer,
  TrendingUp,
  Clock,
  LogOut,
  Loader2,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/use-user-data";
import DynamicLiveAnalytics from "./DynamicLiveAnalytics";
import WebsiteManager from "./WebsiteManager";
import TrackingSetup from "./TrackingSetup";
import TrackingStatus from "./TrackingStatus";
import LocationAnalytics from "./LocationAnalytics";
import OverviewHeader from "./overview/OverviewHeader";
import OverviewStats from "./overview/OverviewStats";
import OverviewQuickActions from "./overview/OverviewQuickActions";
import OverviewRecentActivity from "./overview/OverviewRecentActivity";
import OverviewPerformance from "./overview/OverviewPerformance";
import OverviewInsights from "./overview/OverviewInsights";
import OverviewLiveVisitors from "./overview/OverviewLiveVisitors";

const DynamicDashboard = () => {
  const { user, signOut } = useAuth();
  const { stats, loading, error } = useUserData();
  const [activeTab, setActiveTab] = useState("overview");

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-slate-600">
            Loading your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-slate-600">
            Loading your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">TrackWiser</h1>
                <p className="text-sm text-slate-600">Analytics Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm text-slate-600">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white/80 border border-slate-200 p-1">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Live Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="websites"
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Websites</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Setup</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Status</span>
            </TabsTrigger>
            <TabsTrigger
              value="location"
              className="flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewHeader user={user} />
            <OverviewStats stats={stats} />
            <OverviewLiveVisitors />
            <OverviewQuickActions setActiveTab={setActiveTab} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OverviewRecentActivity stats={stats} />
              <OverviewPerformance stats={stats} />
            </div>
            <OverviewInsights stats={stats} />
          </TabsContent>

          <TabsContent value="analytics">
            <DynamicLiveAnalytics />
          </TabsContent>

          <TabsContent value="websites">
            <WebsiteManager />
          </TabsContent>

          <TabsContent value="setup">
            <TrackingSetup />
          </TabsContent>

          <TabsContent value="status">
            <TrackingStatus />
          </TabsContent>

          <TabsContent value="location">
            <LocationAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DynamicDashboard;
