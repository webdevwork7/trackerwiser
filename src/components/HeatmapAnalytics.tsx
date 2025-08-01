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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MousePointer,
  Eye,
  Target,
  Activity,
  Play,
  Pause,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Globe,
  Users,
  Clock,
  TrendingUp,
  MapPin,
  Zap,
} from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface HeatmapEvent {
  id: string;
  event_type: "click" | "scroll" | "hover" | "form_focus" | "form_submit";
  page_url: string;
  x_position: number;
  y_position: number;
  element_selector: string;
  element_text: string;
  session_id: string;
  visitor_id: string;
  created_at: string;
  website_id: string;
}

interface HeatmapStats {
  totalClicks: number;
  totalScrolls: number;
  totalHovers: number;
  totalForms: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  topClickedElements: Array<{
    element: string;
    clicks: number;
    percentage: number;
  }>;
  scrollDepth: Array<{
    depth: number;
    visitors: number;
    percentage: number;
  }>;
}

const HeatmapAnalytics = () => {
  const { websites } = useUserData();
  const { toast } = useToast();
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState("24h");
  const [heatmapEnabled, setHeatmapEnabled] = useState(true);
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [heatmapStats, setHeatmapStats] = useState<HeatmapStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [heatmapData, setHeatmapData] = useState<HeatmapEvent[]>([]);

  useEffect(() => {
    if (websites.length > 0 && !selectedWebsite) {
      setSelectedWebsite(websites[0].id);
    }
  }, [websites, selectedWebsite]);

  useEffect(() => {
    if (selectedWebsite) {
      fetchHeatmapData();
    }
  }, [selectedWebsite, timeFilter]);

  const fetchHeatmapData = async () => {
    setLoading(true);
    try {
      // Get time filter date
      const timeFilterDate = getTimeFilterDate(timeFilter);

      // Fetch heatmap events
      let query = supabase
        .from("heatmap_events")
        .select("*")
        .eq("website_id", selectedWebsite);

      if (timeFilterDate) {
        query = query.gte("created_at", timeFilterDate.toISOString());
      }

      const { data: events, error } = await query;

      if (error) throw error;

      setHeatmapData(events || []);
      processHeatmapStats(events || []);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
      toast({
        title: "Error",
        description: "Failed to load heatmap data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeFilterDate = (filter: string) => {
    const now = new Date();
    switch (filter) {
      case "1h":
        return new Date(now.getTime() - 60 * 60 * 1000);
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const processHeatmapStats = (events: HeatmapEvent[]) => {
    const totalClicks = events.filter((e) => e.event_type === "click").length;
    const totalScrolls = events.filter((e) => e.event_type === "scroll").length;
    const totalHovers = events.filter((e) => e.event_type === "hover").length;
    const totalForms = events.filter(
      (e) => e.event_type === "form_submit"
    ).length;

    const uniqueVisitors = new Set(events.map((e) => e.visitor_id)).size;

    // Calculate average session duration (mock for now)
    const avgSessionDuration =
      events.length > 0 ? Math.round(events.length * 2.5) : 0;

    // Top clicked elements
    const clickEvents = events.filter((e) => e.event_type === "click");
    const elementCounts = clickEvents.reduce((acc, event) => {
      const key = event.element_selector || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topClickedElements = Object.entries(elementCounts)
      .map(([element, clicks]) => ({
        element,
        clicks,
        percentage: Math.round((clicks / totalClicks) * 100),
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Scroll depth analysis
    const scrollEvents = events.filter((e) => e.event_type === "scroll");
    const scrollDepths = scrollEvents.map((e) => e.y_position);
    const maxScroll = Math.max(...scrollDepths, 100);

    const scrollDepth = [
      {
        depth: 25,
        visitors: scrollDepths.filter((d) => d >= maxScroll * 0.25).length,
        percentage: 0,
      },
      {
        depth: 50,
        visitors: scrollDepths.filter((d) => d >= maxScroll * 0.5).length,
        percentage: 0,
      },
      {
        depth: 75,
        visitors: scrollDepths.filter((d) => d >= maxScroll * 0.75).length,
        percentage: 0,
      },
      {
        depth: 100,
        visitors: scrollDepths.filter((d) => d >= maxScroll).length,
        percentage: 0,
      },
    ];

    // Calculate percentages
    const totalVisitors = uniqueVisitors || 1;
    scrollDepth.forEach((depth) => {
      depth.percentage = Math.round((depth.visitors / totalVisitors) * 100);
    });

    setHeatmapStats({
      totalClicks,
      totalScrolls,
      totalHovers,
      totalForms,
      uniqueVisitors,
      avgSessionDuration,
      topClickedElements,
      scrollDepth,
    });
  };

  const toggleHeatmap = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from("websites")
        .update({ heatmap_enabled: enabled })
        .eq("id", selectedWebsite);

      if (error) throw error;

      setHeatmapEnabled(enabled);
      toast({
        title: "Success",
        description: `Heatmap ${enabled ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      console.error("Error toggling heatmap:", error);
      toast({
        title: "Error",
        description: "Failed to update heatmap setting",
        variant: "destructive",
      });
    }
  };

  const toggleRecording = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from("websites")
        .update({ session_recording_enabled: enabled })
        .eq("id", selectedWebsite);

      if (error) throw error;

      setRecordingEnabled(enabled);
      toast({
        title: "Success",
        description: `Session recording ${enabled ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      console.error("Error toggling recording:", error);
      toast({
        title: "Error",
        description: "Failed to update recording setting",
        variant: "destructive",
      });
    }
  };

  const generateHeatmapScript = () => {
    return `<!-- TrackWiser Heatmap Script -->
<script>
(function() {
  var trackingCode = '${
    websites.find((w) => w.id === selectedWebsite)?.tracking_code
  }';
  var apiUrl = 'https://ltluebewuhheisbbjcss.supabase.co/functions/v1/track-heatmap';
  
  // Heatmap tracking
  function trackHeatmapEvent(eventType, element, x, y) {
    var data = {
      tracking_code: trackingCode,
      event_type: eventType,
      page_url: window.location.href,
      x_position: x,
      y_position: y,
      element_selector: element ? element.tagName + (element.className ? '.' + element.className.split(' ').join('.') : '') : '',
      element_text: element ? element.textContent?.substring(0, 100) : '',
      session_id: sessionStorage.getItem('tw_session_id') || 'session_' + Date.now(),
      visitor_id: localStorage.getItem('tw_visitor_id') || 'visitor_' + Date.now()
    };
    
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error);
  }
  
  // Click tracking
  document.addEventListener('click', function(e) {
    trackHeatmapEvent('click', e.target, e.clientX, e.clientY);
  });
  
  // Scroll tracking
  var lastScrollTime = 0;
  document.addEventListener('scroll', function() {
    var now = Date.now();
    if (now - lastScrollTime > 1000) { // Throttle to once per second
      trackHeatmapEvent('scroll', null, 0, window.scrollY);
      lastScrollTime = now;
    }
  });
  
  // Form tracking
  document.addEventListener('submit', function(e) {
    trackHeatmapEvent('form_submit', e.target, 0, 0);
  });
  
  // Hover tracking (throttled)
  var hoverTimeout;
  document.addEventListener('mouseover', function(e) {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(function() {
      trackHeatmapEvent('hover', e.target, e.clientX, e.clientY);
    }, 500);
  });
})();
</script>`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-slate-600">Loading heatmap data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <MousePointer className="w-6 h-6 mr-2 text-sky-500" />
                Heatmap Analytics
              </CardTitle>
              <CardDescription>
                Track user interactions and behavior patterns
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Heatmap</span>
                <Switch
                  checked={heatmapEnabled}
                  onCheckedChange={toggleHeatmap}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Recording</span>
                <Switch
                  checked={recordingEnabled}
                  onCheckedChange={toggleRecording}
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

      {/* Filters */}
      <Card className="bg-white/80 border-sky-100">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                Filters:
              </span>
            </div>

            <select
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md text-sm"
            >
              {websites.map((website) => (
                <option key={website.id} value={website.id}>
                  {website.name}
                </option>
              ))}
            </select>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <Button onClick={fetchHeatmapData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {heatmapStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Clicks
              </CardTitle>
              <MousePointer className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {heatmapStats.totalClicks}
              </div>
              <p className="text-xs text-lime-600 mt-1">interactions tracked</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Scroll Events
              </CardTitle>
              <Activity className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {heatmapStats.totalScrolls}
              </div>
              <p className="text-xs text-lime-600 mt-1">scroll interactions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Form Submissions
              </CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {heatmapStats.totalForms}
              </div>
              <p className="text-xs text-lime-600 mt-1">form interactions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Unique Visitors
              </CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {heatmapStats.uniqueVisitors}
              </div>
              <p className="text-xs text-lime-600 mt-1">active users</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clicks">Click Heatmap</TabsTrigger>
          <TabsTrigger value="scrolls">Scroll Depth</TabsTrigger>
          <TabsTrigger value="elements">Top Elements</TabsTrigger>
          <TabsTrigger value="script">Tracking Script</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-sky-500" />
                  Interaction Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Clicks</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-sky-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (heatmapStats?.totalClicks || 0) / 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {heatmapStats?.totalClicks || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Scrolls</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-teal-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (heatmapStats?.totalScrolls || 0) / 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {heatmapStats?.totalScrolls || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Forms</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (heatmapStats?.totalForms || 0) / 50,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {heatmapStats?.totalForms || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-teal-500" />
                  Session Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {Math.floor((heatmapStats?.avgSessionDuration || 0) / 60)}m{" "}
                    {heatmapStats?.avgSessionDuration || 0 % 60}s
                  </div>
                  <p className="text-sm text-slate-600">
                    Average session duration
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="elements" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Most Clicked Elements
              </CardTitle>
              <CardDescription>
                Elements that receive the most user attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {heatmapStats?.topClickedElements.map((element, index) => (
                  <div
                    key={element.element}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium text-slate-900 truncate max-w-xs">
                          {element.element}
                        </div>
                        <div className="text-xs text-slate-500">
                          {element.clicks} clicks
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {element.percentage}%
                      </div>
                      <div className="w-24 bg-slate-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-sky-500 to-teal-500 h-2 rounded-full"
                          style={{ width: `${element.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="script" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Heatmap Tracking Script
              </CardTitle>
              <CardDescription>
                Add this script to your website to start tracking heatmap data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{generateHeatmapScript()}</code>
                  </pre>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(generateHeatmapScript())
                    }
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Copy Script
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeatmapAnalytics;
