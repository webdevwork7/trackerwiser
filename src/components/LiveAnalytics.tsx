
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  MapPin, 
  Clock,
  Eye,
  MousePointer,
  Activity,
  Download,
  Filter
} from 'lucide-react';

const LiveAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  
  // Mock data for charts
  const visitorData = [
    { time: '00:00', visitors: 120, bots: 45 },
    { time: '04:00', visitors: 89, bots: 32 },
    { time: '08:00', visitors: 167, bots: 67 },
    { time: '12:00', visitors: 234, bots: 89 },
    { time: '16:00', visitors: 298, bots: 112 },
    { time: '20:00', visitors: 247, bots: 78 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#0EA5E9' },
    { name: 'Mobile', value: 38, color: '#14B8A6' },
    { name: 'Tablet', value: 17, color: '#F59E0B' },
  ];

  const topPages = [
    { page: '/landing', views: 1234, conversion: 4.2 },
    { page: '/product', views: 987, conversion: 6.8 },
    { page: '/pricing', views: 756, conversion: 12.3 },
    { page: '/blog', views: 543, conversion: 2.1 },
  ];

  const geoData = [
    { country: 'United States', visitors: 1456, flag: '🇺🇸' },
    { country: 'United Kingdom', visitors: 892, flag: '🇬🇧' },
    { country: 'Germany', visitors: 678, flag: '🇩🇪' },
    { country: 'Canada', visitors: 543, flag: '🇨🇦' },
    { country: 'Australia', visitors: 432, flag: '🇦🇺' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Real-Time Analytics</CardTitle>
              <CardDescription>Live visitor intelligence and behavioral insights</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex bg-slate-100 rounded-lg p-1">
                {['1h', '24h', '7d', '30d'].map((range) => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range)}
                    className={selectedTimeRange === range ? "bg-sky-500 text-white" : "text-slate-600"}
                  >
                    {range}
                  </Button>
                ))}
              </div>
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
      </Card>

      {/* Visitor Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-sky-500" />
              Visitor Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="visitors" stackId="1" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.3} />
                <Area type="monotone" dataKey="bots" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-teal-500" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {deviceData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages & Geo Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-sky-500" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{page.page}</div>
                      <div className="text-sm text-slate-500">{page.views.toLocaleString()} views</div>
                    </div>
                  </div>
                  <Badge className="bg-lime-100 text-lime-800 border-lime-200">
                    {page.conversion}% CVR
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-teal-500" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geoData.map((geo) => (
                <div key={geo.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{geo.flag}</span>
                    <span className="font-medium text-slate-900">{geo.country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-teal-500 h-2 rounded-full"
                        style={{ width: `${(geo.visitors / 1500) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-12 text-right">{geo.visitors}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Placeholder */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <MousePointer className="w-5 h-5 mr-2 text-sky-500" />
            Heatmap & Session Recordings
          </CardTitle>
          <CardDescription>Click patterns and user behavior analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-slate-100 to-sky-100 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MousePointer className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Interactive Heatmaps Coming Soon</h3>
            <p className="text-slate-600">Visualize where users click, scroll, and interact with your pages.</p>
            <Button className="mt-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white">
              Enable Heatmaps
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveAnalytics;
