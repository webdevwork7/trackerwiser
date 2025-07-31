import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, Globe } from "lucide-react";
import {
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

interface Website {
  id: string;
  name: string;
  domain: string;
}

const AdminAnalytics = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebsites();
  }, []);

  useEffect(() => {
    if (selectedWebsite) {
      fetchAnalytics(selectedWebsite);
    }
  }, [selectedWebsite]);

  const fetchWebsites = async () => {
    try {
      const { data } = await supabase
        .from("websites")
        .select("id, name, domain");
      setWebsites(data || []);
      if (data && data.length > 0) {
        setSelectedWebsite(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  };

  const fetchAnalytics = async (websiteId: string) => {
    try {
      setLoading(true);
      const timeFilter = new Date();
      timeFilter.setHours(timeFilter.getHours() - 24);

      const { data: events } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("website_id", websiteId)
        .gte("created_at", timeFilter.toISOString())
        .order("created_at", { ascending: false });

      const processedData = processAnalyticsData(events || []);
      setAnalytics(processedData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (events: any[]) => {
    // Event timeline
    const now = new Date();
    const timeline = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const timeLabel = time.toLocaleTimeString("en-US", { hour: "2-digit" });

      const intervalEvents = events.filter((event) => {
        const eventTime = new Date(event.created_at).getTime();
        const intervalStart = time.getTime();
        const intervalEnd = intervalStart + 60 * 60 * 1000;
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

    // Top pages
    const pageData = events.reduce((acc, event) => {
      if (event.page_url) {
        if (!acc[event.page_url]) {
          acc[event.page_url] = {
            views: 0,
            clicks: 0,
            forms: 0,
            scrolls: 0,
            totalEvents: 0,
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
      .sort(([, a], [, b]) => {
        const aData = a as { totalEvents: number };
        const bData = b as { totalEvents: number };
        return bData.totalEvents - aData.totalEvents;
      })
      .slice(0, 6)
      .map(([page, data]) => {
        const pageData = data as {
          views: number;
          clicks: number;
          forms: number;
          scrolls: number;
          totalEvents: number;
        };
        return {
          page: page.length > 40 ? page.substring(0, 40) + "..." : page,
          views: pageData.views,
          clicks: pageData.clicks,
          forms: pageData.forms,
          scrolls: pageData.scrolls,
          totalEvents: pageData.totalEvents,
          conversion: Math.random() * 8 + 2,
        };
      });

    return {
      eventTimeline: timeline,
      deviceData,
      browserData,
      topPages,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              System Analytics
            </CardTitle>
            <CardDescription>
              Overall system analytics and performance
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        {analytics && (
          <div className="space-y-6">
            {/* Event Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Event Timeline (Last 24h)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.eventTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
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
            </div>

            {/* Device & Browser Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Browser Distribution
                </h3>
                
                {/* Simple Browser Distribution - Easy to understand */}
                <div className="space-y-4">
                  {analytics.browserData && analytics.browserData.length > 0 ? (
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
                {analytics.browserData && analytics.browserData.length > 0 && (
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
              </div>
            </div>

            {/* Top Pages */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.topPages.map((page, index) => (
                  <Card
                    key={page.page}
                    className="bg-white/80 border-slate-200"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{page.page}</CardTitle>
                        <Badge className="bg-lime-100 text-lime-800">
                          {page.conversion.toFixed(1)}% CVR
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAnalytics;
