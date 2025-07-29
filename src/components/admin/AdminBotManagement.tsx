import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, AlertTriangle, ShieldCheck, Target } from "lucide-react";

interface AdminBotManagementProps {
  stats: {
    totalBotDetections: number;
    blockedBots: number;
    todayBots: number;
  };
}

const AdminBotManagement = ({ stats }: AdminBotManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          Bot Detection & Management
        </CardTitle>
        <CardDescription>
          Monitor and manage bot detection across all websites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Total Bot Detections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">
                {stats.totalBotDetections.toLocaleString()}
              </div>
              <p className="text-red-700 text-sm">All time detections</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2" />
                Blocked Bots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                {stats.blockedBots.toLocaleString()}
              </div>
              <p className="text-green-700 text-sm">Successfully blocked</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Today's Detections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">
                {stats.todayBots.toLocaleString()}
              </div>
              <p className="text-yellow-700 text-sm">Detected today</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Bot Detection Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">User Agent Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Bot patterns</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Crawler patterns</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Automation tools</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">IP-based Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Rate limiting</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Geographic blocking</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Partial
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Proxy detection</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminBotManagement;
