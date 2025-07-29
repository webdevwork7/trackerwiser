import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Database, Download, RefreshCw } from "lucide-react";

interface AdminSettingsProps {
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

const AdminSettings = ({ stats }: AdminSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Admin Settings
        </CardTitle>
        <CardDescription>
          System configuration and administrative controls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">System Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Users</span>
                  <span className="font-semibold">
                    {stats.totalUsers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Websites</span>
                  <span className="font-semibold">
                    {stats.totalWebsites.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Events</span>
                  <span className="font-semibold">
                    {stats.totalEvents.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Sessions</span>
                  <span className="font-semibold">
                    {stats.totalSessions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Session Duration</span>
                  <span className="font-semibold">
                    {stats.avgSessionDuration}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="font-semibold">{stats.conversionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">System Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
                <Button className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
                <Button className="w-full" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Database Backup
                </Button>
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
