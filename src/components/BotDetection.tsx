
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Bot, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Globe,
  Eye,
  Zap,
  Filter,
  Download,
  Settings
} from 'lucide-react';

const BotDetection = () => {
  const [autoBlockEnabled, setAutoBlockEnabled] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  // Mock data
  const botTypes = [
    { name: 'Search Crawlers', count: 456, blocked: 0, allowed: 456, color: '#10B981' },
    { name: 'Malicious Bots', count: 234, blocked: 234, allowed: 0, color: '#EF4444' },
    { name: 'Scrapers', count: 189, blocked: 167, allowed: 22, color: '#F59E0B' },
    { name: 'Monitoring', count: 123, blocked: 0, allowed: 123, color: '#6366F1' },
    { name: 'Unknown', count: 78, blocked: 65, allowed: 13, color: '#8B5CF6' },
  ];

  const threatData = [
    { time: '00:00', threats: 23, blocked: 18 },
    { time: '04:00', threats: 34, blocked: 29 },
    { time: '08:00', threats: 56, blocked: 51 },
    { time: '12:00', threats: 89, blocked: 82 },
    { time: '16:00', threats: 67, blocked: 61 },
    { time: '20:00', threats: 45, blocked: 41 },
  ];

  const recentEvents = [
    { 
      id: 1, 
      type: 'Malicious Bot', 
      ip: '192.168.1.100', 
      action: 'Blocked', 
      time: '2 min ago', 
      country: '🇷🇺 Russia',
      risk: 'High'
    },
    { 
      id: 2, 
      type: 'Scraper', 
      ip: '10.0.0.45', 
      action: 'Blocked', 
      time: '5 min ago', 
      country: '🇨🇳 China',
      risk: 'Medium'
    },
    { 
      id: 3, 
      type: 'Google Bot', 
      ip: '66.249.66.1', 
      action: 'Allowed', 
      time: '8 min ago', 
      country: '🇺🇸 USA',
      risk: 'Low'
    },
    { 
      id: 4, 
      type: 'Unknown Bot', 
      ip: '185.220.101.5', 
      action: 'Quarantined', 
      time: '12 min ago', 
      country: '🇩🇪 Germany',
      risk: 'Medium'
    },
  ];

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Blocked':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Blocked</Badge>;
      case 'Allowed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Allowed</Badge>;
      case 'Quarantined':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Quarantined</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Unknown</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
        return <Badge variant="destructive">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-500 text-white">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Bot className="w-6 h-6 mr-2 text-teal-500" />
                Bot Detection & Protection
              </CardTitle>
              <CardDescription>Advanced ML-powered bot detection with real-time blocking</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Auto Block</span>
                <Switch 
                  checked={autoBlockEnabled} 
                  onCheckedChange={setAutoBlockEnabled}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Strict Mode</span>
                <Switch 
                  checked={strictMode} 
                  onCheckedChange={setStrictMode}
                />
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bot Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Bots Detected</CardTitle>
            <Bot className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,432</div>
            <p className="text-xs text-slate-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Blocked</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1,089</div>
            <p className="text-xs text-slate-500 mt-1">76% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Allowed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">343</div>
            <p className="text-xs text-slate-500 mt-1">24% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Threat Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Medium</div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Bot Detection Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="real-time">Real-time Events</TabsTrigger>
          <TabsTrigger value="rules">Block Rules</TabsTrigger>
          <TabsTrigger value="whitelist">Allow Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bot Types Distribution */}
            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900">Bot Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
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
                <div className="space-y-2 mt-4">
                  {botTypes.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-slate-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Threat Timeline */}
            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900">Threat Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={threatData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="threats" fill="#ef4444" name="Threats Detected" />
                    <Bar dataKey="blocked" fill="#10b981" name="Blocked" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="real-time" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">Real-time Bot Events</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-lime-100 text-lime-800 border-lime-200">
                    <div className="w-2 h-2 bg-lime-500 rounded-full mr-2 animate-pulse"></div>
                    Live
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-sky-500 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{event.type}</div>
                        <div className="text-sm text-slate-500">IP: {event.ip} • {event.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-right">
                      <div>
                        {getActionBadge(event.action)}
                        <div className="text-xs text-slate-500 mt-1">{event.time}</div>
                      </div>
                      {getRiskBadge(event.risk)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Block Rules Configuration</CardTitle>
                  <CardDescription>Configure automatic blocking rules for different bot types</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {botTypes.map((type) => (
                  <div key={type.name} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                      <div>
                        <div className="font-medium text-slate-900">{type.name}</div>
                        <div className="text-sm text-slate-500">{type.count} detected today</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-600">
                        {type.blocked} blocked, {type.allowed} allowed
                      </span>
                      <Switch defaultChecked={type.blocked > type.allowed} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whitelist" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Allow Lists</CardTitle>
                  <CardDescription>IPs and user agents that should always be allowed</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                  Add to Allowlist
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-slate-100 to-sky-100 rounded-lg p-8 text-center">
                <Shield className="w-12 h-12 text-sky-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Whitelist Management</h3>
                <p className="text-slate-600">Configure trusted IPs, user agents, and bot signatures that should never be blocked.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotDetection;
