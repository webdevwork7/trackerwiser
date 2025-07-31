import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/use-user-data";
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
  TrendingUp,
  FileText,
  Scroll,
  Zap,
  Users,
  Target,
  BarChart3,
} from "lucide-react";

interface AnalyticsData {
  // Event counts
  totalEvents: number;
  pageViews: number;
  clicks: number;
  formSubmissions: number;
  scrollEvents: number;
  timeOnPage: number;
  customEvents: number;

  // Visitor metrics
  uniqueVisitors: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;

  // Bot metrics
  totalBots: number;
  botDetectionRate: number;

  // Device breakdown
  deviceData: Array<{
    name: string;
    value: number;
    color: string;
    count: number;
  }>;

  // Browser breakdown
  browserData: Array<{
    name: string;
    value: number;
    color: string;
    count: number;
  }>;

  // Geographic data
  geoData: Array<{
    country: string;
    visitors: number;
    flag: string;
    events: number;
  }>;

  // Top pages with all event types
  topPages: Array<{
    page: string;
    views: number;
    clicks: number;
    forms: number;
    scrolls: number;
    totalEvents: number;
    conversion: number;
    avgTime: number;
  }>;

  // Event timeline
  eventTimeline: Array<{
    time: string;
    pageViews: number;
    clicks: number;
    forms: number;
    scrolls: number;
    total: number;
  }>;

  // Recent events
  recentEvents: Array<{
    id: string;
    event_type: string;
    page_url: string;
    visitor_id: string;
    device_type: string;
    browser: string;
    country: string;
    created_at: string;
  }>;
}

const DynamicLiveAnalytics = () => {
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(0);
  const { user } = useAuth();
  const { websites, analyticsEvents, botDetections } = useUserData();

  useEffect(() => {
    if (websites.length > 0 && !selectedWebsite) {
      setSelectedWebsite(websites[0].id);
    }
  }, [websites, selectedWebsite]);

  useEffect(() => {
    if (selectedWebsite) {
      processAnalyticsData();
      setupRealTimeSubscription();
    }
  }, [selectedWebsite, selectedTimeRange, analyticsEvents, botDetections]);

  // Real-time counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdates((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const setupRealTimeSubscription = () => {
    const channel = supabase
      .channel("analytics-events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "analytics_events",
          filter: `website_id=eq.${selectedWebsite}`,
        },
        () => {
          // Data will be updated through the useUserData hook
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bot_detections",
          filter: `website_id=eq.${selectedWebsite}`,
        },
        () => {
          // Data will be updated through the useUserData hook
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const processAnalyticsData = () => {
    if (!selectedWebsite) return;

    const timeFilter = getTimeFilter(selectedTimeRange);

    // Filter events for selected website and time range
    const filteredEvents = analyticsEvents.filter(
      (event) =>
        event.website_id === selectedWebsite &&
        new Date(event.created_at) >= timeFilter
    );

    // Filter bot detections for selected website and time range
    const filteredBots = botDetections.filter(
      (bot) =>
        bot.website_id === selectedWebsite &&
        new Date(bot.created_at) >= timeFilter
    );

    // Process the data
    const processedData = processAnalyticsDataHelper(
      filteredEvents,
      filteredBots
    );
    setAnalytics(processedData);
    setLoading(false);
  };

  const getTimeFilter = (range: string) => {
    const now = new Date();
    switch (range) {
      case "1h":
        return new Date(now.getTime() - 60 * 60 * 1000);
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  };

  const processAnalyticsDataHelper = (
    events: any[],
    bots: any[]
  ): AnalyticsData => {
    // Event type counts
    const eventCounts = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pageViews = eventCounts["page_view"] || 0;
    const clicks = eventCounts["click"] || 0;
    const formSubmissions = eventCounts["form_submit"] || 0;
    const scrollEvents = eventCounts["scroll"] || 0;
    const timeOnPage = eventCounts["time_on_page"] || 0;
    const customEvents =
      events.length -
      (pageViews + clicks + formSubmissions + scrollEvents + timeOnPage);

    // Visitor metrics
    const uniqueVisitors = new Set(events.map((e) => e.visitor_id)).size;
    const uniqueSessions = new Set(events.map((e) => e.session_id)).size;

    // Calculate average session duration (mock for now)
    const avgSessionDuration = Math.round(
      events.length > 0 ? events.length * 2.5 : 0
    );

    // Calculate bounce rate (single page view sessions)
    const singlePageSessions = new Set(
      events
        .filter((e) => e.event_type === "page_view")
        .map((e) => e.session_id)
        .filter(
          (sessionId, index, arr) =>
            arr.filter((s) => s === sessionId).length === 1
        )
    );
    const bounceRate =
      uniqueSessions > 0
        ? Math.round((singlePageSessions.size / uniqueSessions) * 100)
        : 0;

    // Bot metrics
    const totalBots = bots.length;
    const botDetectionRate =
      events.length > 0
        ? Math.round((totalBots / (events.length + totalBots)) * 100)
        : 0;

    // Device breakdown
    const deviceCounts = events.reduce((acc, event) => {
      if (event.device_type) {
        acc[event.device_type] = (acc[event.device_type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const totalEvents = events.length || 1;
    const deviceData = Object.entries(deviceCounts).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / totalEvents) * 100),
      color:
        name === "desktop"
          ? "#0EA5E9"
          : name === "mobile"
          ? "#14B8A6"
          : "#F59E0B",
      count: count,
    }));

    // Browser breakdown
    const browserCounts = events.reduce((acc, event) => {
      if (event.browser) {
        acc[event.browser] = (acc[event.browser] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const browserData = Object.entries(browserCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count], index) => ({
        name,
        value: Math.round((count / totalEvents) * 100),
        color:
          ["#0EA5E9", "#14B8A6", "#F59E0B", "#EF4444", "#8B5CF6"][index] ||
          "#6B7280",
        count: count,
      }));

    // Geographic data
    const countryCounts = events.reduce((acc, event) => {
      if (event.country) {
        acc[event.country] = (acc[event.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const geoData = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([country, events]) => ({
        country,
        visitors: Math.ceil(events * 0.8), // Estimate unique visitors
        flag: getCountryFlag(country),
        events: events,
      }));

    // Top pages with comprehensive event data
    const pageData = events.reduce((acc, event) => {
      if (event.page_url) {
        if (!acc[event.page_url]) {
          acc[event.page_url] = {
            views: 0,
            clicks: 0,
            forms: 0,
            scrolls: 0,
            totalEvents: 0,
            avgTime: 0,
          };
        }

        acc[event.page_url].totalEvents++;

        switch (event.event_type) {
          case "page_view":
            acc[event.page_url].views++;
            break;
          case "click":
            acc[event.page_url].clicks++;
            break;
          case "form_submit":
            acc[event.page_url].forms++;
            break;
          case "scroll":
            acc[event.page_url].scrolls++;
            break;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    const topPages = Object.entries(pageData)
      .sort(([, a], [, b]) => b.totalEvents - a.totalEvents)
      .slice(0, 6)
      .map(([page, data]) => ({
        page: page.length > 40 ? page.substring(0, 40) + "..." : page,
        views: data.views,
        clicks: data.clicks,
        forms: data.forms,
        scrolls: data.scrolls,
        totalEvents: data.totalEvents,
        conversion: Math.random() * 8 + 2, // Mock conversion rate
        avgTime: Math.round(Math.random() * 180 + 30), // Mock average time
      }));

    // Event timeline
    const eventTimeline = createEventTimeline(events, selectedTimeRange);

    // Recent events
    const recentEvents = events.slice(0, 10).map((event) => ({
      id: event.id,
      event_type: event.event_type,
      page_url: event.page_url,
      visitor_id: event.visitor_id,
      device_type: event.device_type,
      browser: event.browser,
      country: event.country,
      created_at: event.created_at,
    }));

    return {
      totalEvents: events.length,
      pageViews,
      clicks,
      formSubmissions,
      scrollEvents,
      timeOnPage,
      customEvents,
      uniqueVisitors,
      totalSessions: uniqueSessions,
      avgSessionDuration,
      bounceRate,
      totalBots,
      botDetectionRate,
      deviceData,
      browserData,
      geoData,
      topPages,
      eventTimeline,
      recentEvents,
    };
  };

  const createEventTimeline = (events: any[], timeRange: string) => {
    const now = new Date();
    let intervals: number;
    let intervalMs: number;

    switch (timeRange) {
      case "1h":
        intervals = 12; // 5-minute intervals
        intervalMs = 5 * 60 * 1000;
        break;
      case "24h":
        intervals = 24; // Hourly intervals
        intervalMs = 60 * 60 * 1000;
        break;
      case "7d":
        intervals = 7; // Daily intervals
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      case "30d":
        intervals = 30; // Daily intervals
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      default:
        intervals = 24;
        intervalMs = 60 * 60 * 1000;
    }

    const timeline = [];
    for (let i = intervals - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMs);
      const timeLabel =
        timeRange === "1h"
          ? time.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : timeRange === "24h"
          ? time.toLocaleTimeString("en-US", { hour: "2-digit" })
          : time.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

      // Count events in this time interval
      const intervalStart = time.getTime();
      const intervalEnd = intervalStart + intervalMs;

      const intervalEvents = events.filter((event) => {
        const eventTime = new Date(event.created_at).getTime();
        return eventTime >= intervalStart && eventTime < intervalEnd;
      });

      const pageViews = intervalEvents.filter(
        (e) => e.event_type === "page_view"
      ).length;
      const clicks = intervalEvents.filter(
        (e) => e.event_type === "click"
      ).length;
      const forms = intervalEvents.filter(
        (e) => e.event_type === "form_submit"
      ).length;
      const scrolls = intervalEvents.filter(
        (e) => e.event_type === "scroll"
      ).length;

      timeline.push({
        time: timeLabel,
        pageViews,
        clicks,
        forms,
        scrolls,
        total: pageViews + clicks + forms + scrolls,
      });
    }

    return timeline;
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      Germany: "🇩🇪",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      France: "🇫🇷",
      Italy: "🇮🇹",
      Spain: "🇪🇸",
      Netherlands: "🇳🇱",
      Japan: "🇯🇵",
      Brazil: "🇧🇷",
      India: "🇮🇳",
      China: "🇨🇳",
      "South Korea": "🇰🇷",
      Mexico: "🇲🇽",
    };
    return flags[country] || "🌍";
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "page_view":
        return <Eye className="w-4 h-4" />;
      case "click":
        return <MousePointer className="w-4 h-4" />;
      case "form_submit":
        return <FileText className="w-4 h-4" />;
      case "scroll":
        return <Scroll className="w-4 h-4" />;
      case "time_on_page":
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "page_view":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "click":
        return "bg-green-100 text-green-800 border-green-200";
      case "form_submit":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "scroll":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "time_on_page":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No websites found
          </h3>
          <p className="text-slate-600">
            Add a website to start tracking analytics
          </p>
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
              <CardTitle className="text-slate-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-sky-500" />
                Real-Time Analytics
                <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>
                Comprehensive visitor intelligence and behavioral insights
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                value={selectedWebsite}
                onValueChange={setSelectedWebsite}
              >
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
                {["1h", "24h", "7d", "30d"].map((range) => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range)}
                    className={
                      selectedTimeRange === range
                        ? "bg-sky-500 text-white"
                        : "text-slate-600"
                    }
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Event Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Events</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.totalEvents.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  All tracking events
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-sky-600" />
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
                  {analytics?.pageViews.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Page visits</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Clicks</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.clicks.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">User interactions</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Forms</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.formSubmissions.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Submissions</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitor & Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.uniqueVisitors.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Individual users</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Sessions</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.totalSessions.toLocaleString() || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">User sessions</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
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
                  {analytics?.avgSessionDuration || 0}s
                </p>
                <p className="text-xs text-slate-500 mt-1">Duration</p>
              </div>
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-lime-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.bounceRate || 0}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Single page visits
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Timeline Chart */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-sky-500" />
            Event Timeline
          </CardTitle>
          <CardDescription>Real-time event tracking over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analytics?.eventTimeline || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
                name="Page Views"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="Clicks"
              />
              <Area
                type="monotone"
                dataKey="forms"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
                name="Forms"
              />
              <Area
                type="monotone"
                dataKey="scrolls"
                stackId="1"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.6}
                name="Scrolls"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device & Browser Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-600">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-sky-500" />
              Browser Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simple Browser Distribution - Easy to understand */}
            <div className="space-y-4">
              {analytics?.browserData && analytics.browserData.length > 0 ? (
                analytics.browserData.map((browser, index) => (
                  <div key={browser.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {browser.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {browser.value}% ({browser.count} users)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${browser.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No browser data available
                </div>
              )}
            </div>

            {/* Browser Stats Summary */}
            {analytics?.browserData && analytics.browserData.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {analytics.browserData.slice(0, 4).map((browser, index) => (
                  <div
                    key={browser.name}
                    className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="text-lg font-bold text-slate-900">
                      {browser.value}%
                    </div>
                    <div className="text-sm text-slate-600">{browser.name}</div>
                    <div className="text-xs text-slate-500">
                      {browser.count} users
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages & Geographic Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-sky-500" />
              Top Pages (All Events)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topPages.map((page, index) => (
                <div key={page.page} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {page.page}
                        </div>
                        <div className="text-sm text-slate-500">
                          {page.totalEvents} total events
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-lime-100 text-lime-800 border-lime-200">
                      {page.conversion.toFixed(1)}% CVR
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {page.views}
                      </div>
                      <div className="text-slate-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {page.clicks}
                      </div>
                      <div className="text-slate-500">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">
                        {page.forms}
                      </div>
                      <div className="text-slate-500">Forms</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">
                        {page.scrolls}
                      </div>
                      <div className="text-slate-500">Scrolls</div>
                    </div>
                  </div>
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
            {/* Enhanced Geographic Distribution Chart */}
            <div className="space-y-4">
              {analytics?.geoData && analytics.geoData.length > 0 ? (
                analytics.geoData.map((geo, index) => (
                  <div key={geo.country} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{geo.flag}</span>
                        <div>
                          <div className="font-medium text-slate-900">
                            {geo.country}
                          </div>
                          <div className="text-sm text-slate-500">
                            {geo.visitors} visitors
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-slate-900">
                          {geo.events} events
                        </span>
                        <span className="text-xs text-slate-500">
                          {Math.round(
                            (geo.events /
                              analytics.geoData.reduce(
                                (sum, g) => sum + g.events,
                                0
                              )) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-4 rounded-full transition-all duration-300 shadow-sm"
                        style={{
                          width: `${Math.min(
                            (geo.events /
                              Math.max(
                                ...analytics.geoData.map((g) => g.events)
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-8">
                  No geographic data available
                </div>
              )}
            </div>

            {/* Geographic Stats Summary */}
            {analytics?.geoData && analytics.geoData.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.geoData.slice(0, 6).map((geo, index) => (
                  <div
                    key={geo.country}
                    className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{geo.flag}</span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {geo.country}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">
                          {geo.events}
                        </div>
                        <div className="text-xs text-slate-500">events</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Visitors</span>
                        <span className="font-medium text-slate-900">
                          {geo.visitors}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Share</span>
                        <span className="font-medium text-slate-900">
                          {Math.round(
                            (geo.events /
                              analytics.geoData.reduce(
                                (sum, g) => sum + g.events,
                                0
                              )) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-sky-500" />
            Recent Events
          </CardTitle>
          <CardDescription>
            Latest tracking events from your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge className={getEventColor(event.event_type)}>
                      {getEventIcon(event.event_type)}
                      {event.event_type.replace("_", " ")}
                    </Badge>
                    <span className="text-sm text-slate-600">•</span>
                    <span className="text-sm text-slate-600">
                      {event.page_url}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {event.device_type} • {event.browser} • {event.country} •{" "}
                    {new Date(event.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center text-slate-500 py-8">
                No recent events available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicLiveAnalytics;
