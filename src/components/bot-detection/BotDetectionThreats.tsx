import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

interface BotType {
  name: string;
  count: number;
  blocked: number;
  allowed: number;
  color: string;
  accuracy: number;
  falsePositives: number;
}

interface Stats {
  totalDetected: number;
  totalBlocked: number;
  totalAllowed: number;
  threatLevel: string;
  avgResponseTime: number;
  accuracy: number;
}

interface ThreatsProps {
  botTypes: BotType[];
  stats: Stats;
}

const BotDetectionThreats = ({ botTypes, stats }: ThreatsProps) => {
  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">
              Threat Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive threat analysis and geographic distribution
            </CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
            <Target className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Threat Categories</h3>
            {botTypes.length > 0 ? (
              botTypes.map((type) => (
                <div
                  key={type.name}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-slate-900">
                      {type.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {type.count} detected today
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">
                      {type.count}
                    </div>
                    <div className="text-xs text-green-600">
                      {type.accuracy}% accuracy
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No threat categories available
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">System Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">
                  {stats.accuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-slate-600">
                  Detection Accuracy
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">
                  {stats.avgResponseTime}ms
                </div>
                <div className="text-sm text-slate-600">
                  Avg Response Time
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Detected</span>
                <span className="font-medium">{stats.totalDetected}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Successfully Blocked</span>
                <span className="font-medium">{stats.totalBlocked}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Legitimate Traffic</span>
                <span className="font-medium">{stats.totalAllowed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Threat Level</span>
                <span className="font-medium">{stats.threatLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotDetectionThreats; 