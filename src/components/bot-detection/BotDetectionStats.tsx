import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, XCircle, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface StatsProps {
  stats: {
    totalDetected: number;
    totalBlocked: number;
    totalAllowed: number;
    threatLevel: string;
    avgResponseTime: number;
    accuracy: number;
  };
}

const BotDetectionStats = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white border border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Total Bots Detected
          </CardTitle>
          <Bot className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {stats.totalDetected.toLocaleString()}
          </div>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            Real-time data
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Successfully Blocked
          </CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.totalBlocked.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.accuracy.toFixed(1)}% accuracy rate
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Legitimate Traffic
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.totalAllowed.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {(100 - stats.accuracy).toFixed(1)}% false positive rate
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            System Health
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.threatLevel}
          </div>
          <Progress 
            value={stats.threatLevel === 'High' ? 80 : stats.threatLevel === 'Medium' ? 50 : 20} 
            className="mt-2" 
          />
          <div className="text-xs text-slate-500 mt-1">
            {stats.avgResponseTime}ms avg response time
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BotDetectionStats; 