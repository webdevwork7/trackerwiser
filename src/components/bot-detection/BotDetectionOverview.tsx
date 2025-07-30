import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";

interface BotType {
  name: string;
  count: number;
  blocked: number;
  allowed: number;
  color: string;
  accuracy: number;
  falsePositives: number;
}

interface ThreatData {
  time: string;
  threats: number;
  blocked: number;
  accuracy: number;
  responseTime: number;
}

interface OverviewProps {
  botTypes: BotType[];
  threatData: ThreatData[];
}

const BotDetectionOverview = ({ botTypes, threatData }: OverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bot Types Distribution */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">
            Bot Types Distribution
          </CardTitle>
          <CardDescription>
            Real-time breakdown of detected bot categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {botTypes.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={botTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {botTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 mt-4">
                {botTypes.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.blocked} blocked, {item.allowed} allowed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {item.accuracy}%
                      </div>
                      <div className="text-xs text-slate-500">accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No bot data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Threat Timeline */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">
            Threat Timeline & Performance
          </CardTitle>
          <CardDescription>
            Real-time threat detection with accuracy metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {threatData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={threatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#fecaca"
                    name="Threats Detected"
                  />
                  <Area
                    type="monotone"
                    dataKey="blocked"
                    stackId="1"
                    stroke="#10b981"
                    fill="#d1fae5"
                    name="Successfully Blocked"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Avg Accuracy</div>
                  <div className="text-lg font-bold text-slate-900">
                    {threatData.reduce((sum, d) => sum + d.accuracy, 0) / threatData.length}%
                  </div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Avg Response</div>
                  <div className="text-lg font-bold text-slate-900">
                    {threatData.reduce((sum, d) => sum + d.responseTime, 0) / threatData.length}ms
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No threat data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BotDetectionOverview; 