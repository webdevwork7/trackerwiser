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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Layers,
  MousePointer,
  Eye,
  TrendingUp,
  Activity,
  Settings,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  Save,
  Loader2,
  Target,
  Users,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HeatmapEvent {
  id: string;
  website_id: string;
  session_id: string;
  visitor_id: string;
  event_type: "click" | "scroll" | "hover" | "form_submit";
  page_url: string;
  x_position: number | null;
  y_position: number | null;
  element_selector: string;
  element_text: string;
  scroll_depth: number | null;
  created_at: string;
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
  deviceBreakdown: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  recentEvents: HeatmapEvent[];
  // New analytics sections
  topPages: Array<{
    page: string;
    interactions: number;
    percentage: number;
  }>;
  userJourney: Array<{
    sequence: string;
    count: number;
    percentage: number;
  }>;
  hourlyActivity: Array<{
    hour: number;
    events: number;
  }>;
  engagementScore: number;
  conversionFunnel: Array<{
    stage: string;
    visitors: number;
    conversionRate: number;
  }>;
}

const HeatmapDashboard = () => {
  const { websites } = useUserData();
  const { toast } = useToast();
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [heatmapStats, setHeatmapStats] = useState<HeatmapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [timeFilter, setTimeFilter] = useState("24h");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (websites.length > 0 && !selectedWebsite) {
      setSelectedWebsite(websites[0].id);
    } else if (websites.length === 0) {
      setLoading(false);
    }
  }, [websites, selectedWebsite]);

  useEffect(() => {
    if (selectedWebsite) {
      fetchHeatmapData();
    }
  }, [selectedWebsite, timeFilter]);

  useEffect(() => {
    // Show toast when heatmap is disabled
    if (selectedWebsite && !heatmapEnabled) {
      toast({
        title: "Heatmap Tracking Disabled",
        description:
          "Enable heatmap tracking to see user interaction analytics and behavior patterns.",
        variant: "default",
      });
    }
  }, [selectedWebsite, heatmapEnabled, toast]);

  const fetchHeatmapData = async () => {
    if (!selectedWebsite) return;

    setLoading(true);
    try {
      // Get time filter
      const timeFilterDate = getTimeFilterDate(timeFilter);

      // Fetch heatmap events
      let query = supabase
        .from("heatmap_events")
        .select("*")
        .eq("website_id", selectedWebsite);

      if (timeFilterDate) {
        query = query.gte("created_at", timeFilterDate.toISOString());
      }

      const { data: events, error: eventsError } = await query;

      if (eventsError) throw eventsError;

      // Process heatmap data with proper typing
      const typedEvents: HeatmapEvent[] = (events || []).map((event) => ({
        ...event,
        event_type: event.event_type as
          | "click"
          | "scroll"
          | "hover"
          | "form_submit",
        scroll_depth: event.scroll_depth || null,
      }));

      const stats = processHeatmapStats(typedEvents);
      setHeatmapStats(stats);

      // Check if heatmap is enabled for this website
      const website = websites.find((w) => w.id === selectedWebsite);
      setHeatmapEnabled(website?.heatmap_enabled || false);
      setRecordingEnabled(website?.session_recording_enabled || false);
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

  const processHeatmapStats = (events: HeatmapEvent[]): HeatmapStats => {
    // Count event types
    const totalClicks = events.filter((e) => e.event_type === "click").length;
    const totalScrolls = events.filter((e) => e.event_type === "scroll").length;
    const totalHovers = events.filter((e) => e.event_type === "hover").length;
    const totalForms = events.filter(
      (e) => e.event_type === "form_submit"
    ).length;

    // Unique visitors
    const uniqueVisitors = new Set(events.map((e) => e.visitor_id)).size;

    // Top clicked elements
    const clickEvents = events.filter((e) => e.event_type === "click");
    const elementMap = new Map<string, number>();
    clickEvents.forEach((event) => {
      const element = event.element_selector || "unknown";
      elementMap.set(element, (elementMap.get(element) || 0) + 1);
    });

    const topClickedElements = Array.from(elementMap.entries())
      .map(([element, clicks]) => ({
        element,
        clicks,
        percentage: Math.round((clicks / totalClicks) * 100),
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Scroll depth analysis
    const scrollEvents = events.filter(
      (e) => e.event_type === "scroll" && e.scroll_depth
    );
    const depthMap = new Map<number, number>();
    scrollEvents.forEach((event) => {
      if (event.scroll_depth) {
        const depth = Math.round(event.scroll_depth / 100) * 100; // Round to nearest 100
        depthMap.set(depth, (depthMap.get(depth) || 0) + 1);
      }
    });

    const scrollDepth = Array.from(depthMap.entries())
      .map(([depth, visitors]) => ({
        depth,
        visitors,
        percentage: Math.round((visitors / scrollEvents.length) * 100),
      }))
      .sort((a, b) => a.depth - b.depth);

    // Device breakdown (from analytics events)
    const deviceMap = new Map<string, number>();
    events.forEach((event) => {
      // This would need to be joined with analytics_events for device info
      // For now, we'll use a placeholder
      deviceMap.set("desktop", (deviceMap.get("desktop") || 0) + 1);
    });

    const deviceBreakdown = Array.from(deviceMap.entries()).map(
      ([device, count]) => ({
        device,
        count,
        percentage: Math.round((count / events.length) * 100),
      })
    );

    // Calculate average session duration (placeholder)
    const avgSessionDuration = 120; // seconds

    // Top pages by interactions
    const pageMap = new Map<string, number>();
    events.forEach((event) => {
      const page = event.page_url;
      pageMap.set(page, (pageMap.get(page) || 0) + 1);
    });

    const topPages = Array.from(pageMap.entries())
      .map(([page, interactions]) => ({
        page: page.length > 50 ? page.substring(0, 50) + "..." : page,
        interactions,
        percentage: Math.round((interactions / events.length) * 100),
      }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 10);

    // User journey analysis (click sequences)
    const sessionMap = new Map<string, string[]>();
    events
      .filter((e) => e.event_type === "click")
      .forEach((event) => {
        const session = event.session_id;
        if (!sessionMap.has(session)) {
          sessionMap.set(session, []);
        }
        const element = event.element_text || event.element_selector;
        sessionMap.get(session)?.push(element.substring(0, 20));
      });

    const journeyMap = new Map<string, number>();
    sessionMap.forEach((sequence) => {
      if (sequence.length >= 2) {
        const journey = sequence.slice(0, 3).join(" → ");
        journeyMap.set(journey, (journeyMap.get(journey) || 0) + 1);
      }
    });

    const userJourney = Array.from(journeyMap.entries())
      .map(([sequence, count]) => ({
        sequence,
        count,
        percentage: Math.round((count / sessionMap.size) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Hourly activity
    const hourlyMap = new Map<number, number>();
    events.forEach((event) => {
      const hour = new Date(event.created_at).getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      events: hourlyMap.get(i) || 0,
    }));

    // Engagement score (based on interactions per session)
    const avgInteractionsPerSession = events.length / sessionMap.size || 0;
    const engagementScore = Math.min(
      100,
      Math.round(avgInteractionsPerSession * 10)
    );

    // Conversion funnel (form submissions)
    const formEvents = events.filter((e) => e.event_type === "form_submit");
    const conversionFunnel = [
      {
        stage: "Page Views",
        visitors: uniqueVisitors,
        conversionRate: 100,
      },
      {
        stage: "Interactions",
        visitors: Math.round(uniqueVisitors * 0.8),
        conversionRate: 80,
      },
      {
        stage: "Form Submissions",
        visitors: formEvents.length,
        conversionRate: Math.round((formEvents.length / uniqueVisitors) * 100),
      },
    ];

    return {
      totalClicks,
      totalScrolls,
      totalHovers,
      totalForms,
      uniqueVisitors,
      avgSessionDuration,
      topClickedElements,
      scrollDepth,
      deviceBreakdown,
      recentEvents: events
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 50),
      topPages,
      userJourney,
      hourlyActivity,
      engagementScore,
      conversionFunnel,
    };
  };

  const toggleHeatmap = async (enabled: boolean) => {
    if (!selectedWebsite) return;

    try {
      const { error } = await supabase
        .from("websites")
        .update({ heatmap_enabled: enabled })
        .eq("id", selectedWebsite);

      if (error) throw error;

      setHeatmapEnabled(enabled);
      toast({
        title: "Success",
        description: `Heatmap ${
          enabled ? "enabled" : "disabled"
        } for this website`,
      });
    } catch (error) {
      console.error("Error toggling heatmap:", error);
      toast({
        title: "Error",
        description: "Failed to update heatmap settings",
        variant: "destructive",
      });
    }
  };

  const toggleRecording = async (enabled: boolean) => {
    if (!selectedWebsite) return;

    try {
      const { error } = await supabase
        .from("websites")
        .update({ session_recording_enabled: enabled })
        .eq("id", selectedWebsite);

      if (error) throw error;

      setRecordingEnabled(enabled);
      toast({
        title: "Success",
        description: `Session recording ${
          enabled ? "enabled" : "disabled"
        } for this website`,
      });
    } catch (error) {
      console.error("Error toggling recording:", error);
      toast({
        title: "Error",
        description: "Failed to update recording settings",
        variant: "destructive",
      });
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "click":
        return <MousePointer className="w-4 h-4" />;
      case "scroll":
        return <TrendingUp className="w-4 h-4" />;
      case "hover":
        return <Eye className="w-4 h-4" />;
      case "form_submit":
        return <Target className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "click":
        return "bg-green-100 text-green-800 border-green-200";
      case "scroll":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "hover":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "form_submit":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredEvents = heatmapStats?.recentEvents.filter((event) =>
    searchTerm
      ? event.page_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.element_selector
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        event.element_text.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-slate-600">Loading heatmap data...</p>
        </div>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No websites found
          </h3>
          <p className="text-slate-600">
            Add a website to start tracking heatmap data
          </p>
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
                <Layers className="w-6 h-6 mr-2 text-sky-500" />
                Heatmap Dashboard
              </CardTitle>
              <CardDescription>
                Track user interactions and behavior patterns
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
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
              <Button onClick={fetchHeatmapData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Heatmap Disabled Banner */}
      {selectedWebsite && !heatmapEnabled && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Heatmap Tracking is Disabled
                </h3>
                <p className="text-amber-700 mb-4">
                  Enable heatmap tracking to see detailed user interaction
                  analytics, behavior patterns, and engagement insights. You'll
                  be able to track clicks, scrolls, hovers, and form
                  submissions.
                </p>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => toggleHeatmap(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    Enable Heatmap Tracking
                  </Button>
                  <span className="text-sm text-amber-600">
                    Toggle the "Heatmap" switch above to get started
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {heatmapStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-100 text-sm">Total Clicks</p>
                  <p className="text-2xl font-bold">
                    {heatmapStats.totalClicks}
                  </p>
                </div>
                <MousePointer className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Scrolls</p>
                  <p className="text-2xl font-bold">
                    {heatmapStats.totalScrolls}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Hovers</p>
                  <p className="text-2xl font-bold">
                    {heatmapStats.totalHovers}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Form Submissions</p>
                  <p className="text-2xl font-bold">
                    {heatmapStats.totalForms}
                  </p>
                </div>
                <Target className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by URL, element, or text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Clicked Elements */}
      {heatmapStats && heatmapStats.topClickedElements.length > 0 && (
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <MousePointer className="w-5 h-5 mr-2 text-sky-500" />
              Top Clicked Elements
            </CardTitle>
            <CardDescription>
              Most frequently clicked elements on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heatmapStats.topClickedElements.map((element, index) => (
                <div key={element.element} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-900">
                        {index + 1}.
                      </span>
                      <div>
                        <div className="font-medium text-slate-900">
                          {element.element.length > 50
                            ? element.element.substring(0, 50) + "..."
                            : element.element}
                        </div>
                        <div className="text-sm text-slate-500">
                          {element.clicks} clicks
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {element.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${element.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scroll Depth Analysis */}
      {heatmapStats && heatmapStats.scrollDepth.length > 0 && (
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-sky-500" />
              Scroll Depth Analysis
            </CardTitle>
            <CardDescription>
              How far users scroll on your pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heatmapStats.scrollDepth.map((depth) => (
                <div key={depth.depth} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-900">
                        {depth.depth}px
                      </span>
                      <div className="text-sm text-slate-500">
                        {depth.visitors} visitors
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {depth.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${depth.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Score */}
      {heatmapStats && (
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-sky-500" />
              Engagement Score
            </CardTitle>
            <CardDescription>
              Overall user engagement based on interactions per session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">
                {heatmapStats.engagementScore}/100
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-sky-500 to-teal-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${heatmapStats.engagementScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {heatmapStats.engagementScore >= 80
                  ? "Excellent engagement!"
                  : heatmapStats.engagementScore >= 60
                  ? "Good engagement"
                  : heatmapStats.engagementScore >= 40
                  ? "Average engagement"
                  : "Low engagement - needs improvement"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Pages */}
      {heatmapStats && heatmapStats.topPages.length > 0 && (
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-sky-500" />
              Top Pages by Interactions
            </CardTitle>
            <CardDescription>
              Pages with the most user interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heatmapStats.topPages.map((page, index) => (
                <div key={page.page} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-900">
                        {index + 1}.
                      </span>
                      <div>
                        <div className="font-medium text-slate-900">
                          {page.page}
                        </div>
                        <div className="text-sm text-slate-500">
                          {page.interactions} interactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {page.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${page.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Journey */}
      {heatmapStats && heatmapStats.userJourney.length > 0 && (
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-sky-500" />
              User Journey Analysis
            </CardTitle>
            <CardDescription>
              Most common click sequences and user paths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heatmapStats.userJourney.map((journey, index) => (
                <div key={journey.sequence} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-900">
                        {index + 1}.
                      </span>
                      <div>
                        <div className="font-medium text-slate-900">
                          {journey.sequence}
                        </div>
                        <div className="text-sm text-slate-500">
                          {journey.count} users
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {journey.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${journey.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hourly Activity */}
      {heatmapStats && (
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-sky-500" />
              Hourly Activity
            </CardTitle>
            <CardDescription>
              User activity patterns throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1">
              {heatmapStats.hourlyActivity.map((hour) => (
                <div key={hour.hour} className="text-center">
                  <div className="text-xs text-slate-600 mb-1">
                    {hour.hour}:00
                  </div>
                  <div
                    className="bg-gradient-to-t from-sky-500 to-teal-500 rounded-sm transition-all duration-300"
                    style={{
                      height: `${Math.max(
                        4,
                        (hour.events /
                          Math.max(
                            ...heatmapStats.hourlyActivity.map((h) => h.events)
                          )) *
                          100
                      )}px`,
                    }}
                  ></div>
                  <div className="text-xs text-slate-500 mt-1">
                    {hour.events}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Funnel */}
      {heatmapStats && heatmapStats.conversionFunnel.length > 0 && (
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-sky-500" />
              Conversion Funnel
            </CardTitle>
            <CardDescription>
              User progression from page views to form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heatmapStats.conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-900">
                        {index + 1}.
                      </span>
                      <div>
                        <div className="font-medium text-slate-900">
                          {stage.stage}
                        </div>
                        <div className="text-sm text-slate-500">
                          {stage.visitors} visitors
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {stage.conversionRate}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${stage.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Heatmap Events */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-sky-500" />
            Recent Heatmap Events
          </CardTitle>
          <CardDescription>
            Latest user interactions and behavior patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents && filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge className={getEventColor(event.event_type)}>
                      {getEventIcon(event.event_type)}
                      {event.event_type.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {event.page_url}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {event.element_text && event.element_text.trim()
                        ? event.element_text.substring(0, 50) +
                          (event.element_text.length > 50 ? "..." : "")
                        : event.element_selector.substring(0, 50) +
                          (event.element_selector.length > 50 ? "..." : "")}
                    </div>
                    {event.x_position && event.y_position && (
                      <div className="text-xs text-slate-400 mt-1">
                        Position: ({event.x_position}, {event.y_position})
                      </div>
                    )}
                  </div>

                  <div className="text-right text-xs text-slate-500">
                    <div>{new Date(event.created_at).toLocaleDateString()}</div>
                    <div>{new Date(event.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                {searchTerm
                  ? "No events match your search criteria"
                  : !heatmapEnabled
                  ? "Enable heatmap tracking to see user interaction data"
                  : "No heatmap events available"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapDashboard;
