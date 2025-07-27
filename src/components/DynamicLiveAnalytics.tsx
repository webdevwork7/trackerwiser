
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  Filter,
  TrendingUp
} from 'lucide-react';

interface Website {
  id: string;
  name: string;
  domain: string;
}

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  totalBots: number;
  avgSessionTime: number;
  bounceRate: number;
  visitorData: Array<{ time: string; visitors: number; bots: number }>;
  deviceData: Array<{ name: string; value: number; color: string }>;
  topPages: Array<{ page: string; views: number; conversion: number }>;
  geoData: Array<{ country: string; visitors: number; flag: string }>;
}

const DynamicLiveAnalytics = () => {
  const [selectedWebsite, setSelectedWebsite] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [websites, setWebsites] = useState<Website[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWebsites();
    }
  }, [user]);

  useEffect(() => {
    if (selectedWebsite) {
      fetchAnalytics();
      // Set up real-time subscription
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'analytics_events',
            filter: `website_id=eq.${selectedWebsite}`,
          },
          () => {
            fetchAnalytics();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedWebsite, selectedTimeRange]);

  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('id, name, domain')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
      if (data && data.length > 0) {
        setSelectedWebsite(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedWebsite) return;

    try {
      const timeFilter = getTimeFilter(selectedTimeRange);
      
      // Fetch analytics events
      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('website_id', selectedWebsite)
        .gte('created_at', timeFilter);

      if (eventsError) throw eventsError;

      // Fetch bot detections
      const { data: bots, error: botsError } = await supabase
        .from('bot_detections')
        .select('*')
        .eq('website_id', selectedWebsite)
        .gte('created_at', timeFilter);

      if (botsError) throw botsError;

      // Process the data
      const processedData = processAnalyticsData(events || [], bots || []);
      setAnalytics(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getTimeFilter = (range: string) => {
    const now = new Date();
    switch (range) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const processAnalyticsData = (events: any[], bots: any[]): AnalyticsData => {
    const uniqueVisitors = new Set(events.map(e => e.visitor_id)).size;
    const totalPageViews = events.filter(e => e.event_type === 'page_view').length;
    const totalBots = bots.length;

    // Create time series data
    const timeSeriesData = createTimeSeriesData(events, bots);
    
    // Process device data
    const deviceCounts = events.reduce((acc, event) => {
      if (event.device_type) {
        acc[event.device_type] = (acc[event.device_type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const totalEvents = events.length || 1; // Prevent division by zero
    const deviceData = Object.entries(deviceCounts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((Number(count) / totalEvents) * 100),
      color: name === 'desktop' ? '#0EA5E9' : name === 'mobile' ? '#14B8A6' : '#F59E0B'
    }));

    // Process top pages
    const pageCounts = events.reduce((acc, event) => {
      if (event.page_url) {
        acc[event.page_url] = (acc[event.page_url] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .slice(0, 4)
      .map(([page, views]) => ({
        page: page.length > 30 ? page.substring(0, 30) + '...' : page,
        views: Number(views),
        conversion: Math.random() * 10 + 2 // Mock conversion rate
      }));

    // Process geo data
    const countryCounts = events.reduce((acc, event) => {
      if (event.country) {
        acc[event.country] = (acc[event.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const geoData = Object.entries(countryCounts)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .slice(0, 5)
      .map(([country, visitors]) => ({
        country,
        visitors: Number(visitors),
        flag: getCountryFlag(country)
      }));

    return {
      totalVisitors: uniqueVisitors,
      totalPageViews,
      totalBots,
      avgSessionTime: 145, // Mock data
      bounceRate: 42.5, // Mock data
      visitorData: timeSeriesData,
      deviceData,
      topPages,
      geoData
    };
  };

  const createTimeSeriesData = (events: any[], bots: any[]) => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      return hour.toISOString().slice(11, 16);
    });

    return hours.map(hour => ({
      time: hour,
      visitors: Math.floor(Math.random() * 200) + 50,
      bots: Math.floor(Math.random() * 100) + 20
    }));
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Japan': '🇯🇵'
    };
    return flags[country] || '🌍';
  };

  if (loading) {
    return (
      <Card className="bg-white/80 border-sky-100">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (websites.length === 0) {
    return (
      <Card className="bg-white/80 border-sky-100">
        <CardContent className="p-6 text-center">
          <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No websites found</h3>
          <p className="text-slate-600">Add a website to start tracking analytics</p>
        </CardContent>
      </Card>
    );
  }

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
              <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select website" />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((website) => (
                    <SelectItem key={website.id} value={website.id}>
                      {website.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Visitors</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.totalVisitors.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Page Views</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.totalPageViews.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Bots Detected</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.totalBots.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Session</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.avgSessionTime || 0}s
                </p>
              </div>
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-lime-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
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
              <AreaChart data={analytics?.visitorData || []}>
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
                  data={analytics?.deviceData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics?.deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {analytics?.deviceData.map((item) => (
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
              {analytics?.topPages.map((page, index) => (
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
                    {page.conversion.toFixed(1)}% CVR
                  </Badge>
                </div>
              )) || (
                <div className="text-center text-slate-500 py-8">
                  No page data available
                </div>
              )}
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
              {analytics?.geoData.map((geo) => (
                <div key={geo.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{geo.flag}</span>
                    <span className="font-medium text-slate-900">{geo.country}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-teal-500 h-2 rounded-full"
                        style={{ width: `${Math.min((geo.visitors / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-12 text-right">{geo.visitors}</span>
                  </div>
                </div>
              )) || (
                <div className="text-center text-slate-500 py-8">
                  No geographic data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicLiveAnalytics;
