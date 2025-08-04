import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { usePageVisibility } from "@/hooks/use-page-visibility";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  SortAsc,
  SortDesc,
  ArrowUpRight,
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

  // Pagination state for Recent Events
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage, setEventsPerPage] = useState(20);

  // Filter and sort state for Recent Events
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Geographic detail modal state
  const [selectedGeoDetail, setSelectedGeoDetail] = useState<{
    country: string;
    visitors: number;
    flag: string;
    events: number;
  } | null>(null);
  const [showGeoModal, setShowGeoModal] = useState(false);

  // Browser detail modal state
  const [selectedBrowserDetail, setSelectedBrowserDetail] = useState<{
    name: string;
    value: number;
    color: string;
    count: number;
  } | null>(null);
  const [showBrowserModal, setShowBrowserModal] = useState(false);

  const { user } = useAuth();
  const { websites, analyticsEvents, botDetections } = useUserData();
  const isVisible = usePageVisibility();

  // Helper function for filtering and sorting events
  const getFilteredAndSortedEvents = () => {
    if (!analytics?.recentEvents) return [];

    let filteredEvents = analytics.recentEvents;

    // Apply filter
    if (eventFilter !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.event_type === eventFilter
      );
    }

    // Apply sorting
    filteredEvents.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "event_type":
          aValue = a.event_type;
          bValue = b.event_type;
          break;
        case "page_url":
          aValue = a.page_url;
          bValue = b.page_url;
          break;
        case "device_type":
          aValue = a.device_type;
          bValue = b.device_type;
          break;
        case "browser":
          aValue = a.browser;
          bValue = b.browser;
          break;
        case "country":
          aValue = a.country;
          bValue = b.country;
          break;
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredEvents;
  };

  useEffect(() => {
    if (websites.length > 0 && !selectedWebsite) {
      setSelectedWebsite(websites[0].id);
    } else if (websites.length === 0) {
      // If no websites, stop loading immediately
      setLoading(false);
    }
  }, [websites, selectedWebsite]);

  useEffect(() => {
    if (selectedWebsite) {
      processAnalyticsData();
      setupRealTimeSubscription();
    } else if (websites.length === 0) {
      // If no websites, stop loading
      setLoading(false);
    }
  }, [
    selectedWebsite,
    selectedTimeRange,
    analyticsEvents,
    botDetections,
    websites.length,
  ]);

  // Real-time counter effect only when tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (isVisible.current) {
        setRealTimeUpdates((prev) => prev + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Update relative times every minute when tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (isVisible.current) {
        // Force re-render to update relative times
        setRealTimeUpdates((prev) => prev + 1);
      }
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [isVisible]);

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
    events: Array<{
      id: string;
      event_type: string;
      page_url: string;
      visitor_id: string;
      device_type: string;
      browser: string;
      country: string;
      created_at: string;
      session_id?: string;
    }>,
    bots: Array<{
      id: string;
      website_id: string;
      created_at: string;
    }>
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
    const pageData = events.reduce(
      (acc, event) => {
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
      },
      {} as Record<
        string,
        {
          views: number;
          clicks: number;
          forms: number;
          scrolls: number;
          totalEvents: number;
          avgTime: number;
        }
      >
    );

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

    // Recent events - now with pagination support
    const allRecentEvents = events.map((event) => ({
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
      recentEvents: allRecentEvents, // Now contains all events
    };
  };

  const createEventTimeline = (
    events: Array<{
      event_type: string;
      created_at: string;
    }>,
    timeRange: string
  ) => {
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

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - eventDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.getTime() - 86400000).toDateString() === date.toDateString();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
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

  // Pagination functions for Recent Events
  const getPaginatedEvents = () => {
    const filteredEvents = getFilteredAndSortedEvents();
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  };

  const totalPages = (() => {
    const filteredEvents = getFilteredAndSortedEvents();
    return Math.ceil(filteredEvents.length / eventsPerPage);
  })();

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleEventsPerPageChange = (perPage: number) => {
    setEventsPerPage(perPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force a complete data refresh
      if (selectedWebsite) {
        // Trigger a page refresh for complete data reload
        window.location.reload();
      } else {
        // If no website selected, just refresh the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      // Fallback to page refresh
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleGeoCardClick = (geoData: {
    country: string;
    visitors: number;
    flag: string;
    events: number;
  }) => {
    setSelectedGeoDetail(geoData);
    setShowGeoModal(true);
  };

  const closeGeoModal = () => {
    setShowGeoModal(false);
    setSelectedGeoDetail(null);
  };

  const handleBrowserCardClick = (browserData: {
    name: string;
    value: number;
    color: string;
    count: number;
  }) => {
    setSelectedBrowserDetail(browserData);
    setShowBrowserModal(true);
  };

  const closeBrowserModal = () => {
    setShowBrowserModal(false);
    setSelectedBrowserDetail(null);
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
                    className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-slate-100 relative"
                    onClick={() => handleBrowserCardClick(browser)}
                  >
                    {/* Arrow Icon */}
                    <div className="absolute top-1 right-1 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity border border-green-200">
                      <ArrowUpRight className="w-2.5 h-2.5 text-green-600" />
                    </div>
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
                    className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-slate-100 relative"
                    onClick={() => handleGeoCardClick(geo)}
                  >
                    {/* Arrow Icon */}
                    <div className="absolute top-1 right-1 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity border border-green-200">
                      <ArrowUpRight className="w-2.5 h-2.5 text-green-600" />
                    </div>
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

      {/* Recent Events with Pagination */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-sky-500" />
                Recent Events
              </CardTitle>
              <CardDescription>
                Latest tracking events from your website
                {analytics?.recentEvents && (
                  <span className="ml-2 text-slate-500">
                    • {getFilteredAndSortedEvents().length} filtered events
                    {eventFilter !== "all" && (
                      <span className="text-slate-400">
                        {" "}
                        (of {analytics.recentEvents.length} total)
                      </span>
                    )}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              {/* Filter Dropdown */}
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="page_view">Page Views</SelectItem>
                  <SelectItem value="click">Clicks</SelectItem>
                  <SelectItem value="form_submit">Form Submissions</SelectItem>
                  <SelectItem value="scroll">Scroll Events</SelectItem>
                  <SelectItem value="time_on_page">Time on Page</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Dropdown */}
              <Select
                value={sortBy}
                onValueChange={(value) => handleSort(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date & Time</SelectItem>
                  <SelectItem value="event_type">Event Type</SelectItem>
                  <SelectItem value="page_url">Page URL</SelectItem>
                  <SelectItem value="device_type">Device Type</SelectItem>
                  <SelectItem value="browser">Browser</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort(sortBy)}
                className="w-8 h-8 p-0 border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                title={`Sort ${
                  sortOrder === "asc" ? "Descending" : "Ascending"
                }`}
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4 text-orange-600" />
                ) : (
                  <SortDesc className="w-4 h-4 text-orange-600" />
                )}
              </Button>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-8 h-8 p-0 border-green-200 hover:border-green-300 hover:bg-green-50"
                title="Refresh Events"
              >
                <RefreshCw
                  className={`w-4 h-4 text-green-600 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </Button>

              {/* Items Per Page */}
              <Select
                value={eventsPerPage.toString()}
                onValueChange={(value) =>
                  handleEventsPerPageChange(parseInt(value))
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-slate-500">per page</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getPaginatedEvents().map((event) => (
              <div
                key={event.id}
                className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{event.device_type}</span>
                        <span>•</span>
                        <span>{event.browser}</span>
                        <span>•</span>
                        <span>{event.country}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <span>{getFormattedDate(event.created_at)}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-600">
                          {getRelativeTime(event.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center text-slate-500 py-8">
                No recent events available
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {(() => {
            const filteredEvents = getFilteredAndSortedEvents();
            return (
              filteredEvents.length > 0 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span>
                      Showing {(currentPage - 1) * eventsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * eventsPerPage,
                        filteredEvents.length
                      )}{" "}
                      of {filteredEvents.length} events
                      {eventFilter !== "all" && (
                        <span className="text-slate-400">
                          {" "}
                          (filtered from {analytics?.recentEvents.length} total)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 p-0"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 p-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 p-0"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            );
          })()}
        </CardContent>
      </Card>

      {/* Geographic Detail Modal */}
      <Dialog open={showGeoModal} onOpenChange={setShowGeoModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <span className="text-2xl">{selectedGeoDetail?.flag}</span>
              <div>
                <div className="text-xl font-bold">
                  {selectedGeoDetail?.country}
                </div>
                <div className="text-sm text-slate-500">
                  Geographic Analytics
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Detailed analytics and insights for {selectedGeoDetail?.country}
            </DialogDescription>
          </DialogHeader>

          {selectedGeoDetail && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedGeoDetail.events.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">Total Events</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedGeoDetail.visitors.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Unique Visitors</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(
                      (selectedGeoDetail.visitors / selectedGeoDetail.events) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-purple-700">Engagement Rate</div>
                </div>
              </div>

              {/* Event Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Event Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const countryEvents =
                      analytics?.recentEvents.filter(
                        (event) => event.country === selectedGeoDetail.country
                      ) || [];

                    const eventTypes = countryEvents.reduce((acc, event) => {
                      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);

                    return Object.entries(eventTypes).map(([type, count]) => (
                      <div key={type} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getEventColor(type)}>
                            {getEventIcon(type)}
                            {type.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-xl font-bold text-slate-900">
                          {count.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          {Math.round((count / selectedGeoDetail.events) * 100)}
                          % of total
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Device & Browser Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Device Types
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const countryEvents =
                        analytics?.recentEvents.filter(
                          (event) => event.country === selectedGeoDetail.country
                        ) || [];

                      const deviceTypes = countryEvents.reduce((acc, event) => {
                        acc[event.device_type] =
                          (acc[event.device_type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);

                      return Object.entries(deviceTypes)
                        .sort(([, a], [, b]) => b - a)
                        .map(([device, count]) => (
                          <div
                            key={device}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                              <span className="font-medium capitalize">
                                {device}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900">
                                {count}
                              </div>
                              <div className="text-sm text-slate-500">
                                {Math.round(
                                  (count / selectedGeoDetail.events) * 100
                                )}
                                %
                              </div>
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Top Browsers
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const countryEvents =
                        analytics?.recentEvents.filter(
                          (event) => event.country === selectedGeoDetail.country
                        ) || [];

                      const browsers = countryEvents.reduce((acc, event) => {
                        acc[event.browser] = (acc[event.browser] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);

                      return Object.entries(browsers)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([browser, count]) => (
                          <div
                            key={browser}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="font-medium">{browser}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900">
                                {count}
                              </div>
                              <div className="text-sm text-slate-500">
                                {Math.round(
                                  (count / selectedGeoDetail.events) * 100
                                )}
                                %
                              </div>
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Recent Events from this Country */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Events
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(() => {
                    const countryEvents =
                      analytics?.recentEvents
                        .filter(
                          (event) => event.country === selectedGeoDetail.country
                        )
                        .slice(0, 10) || [];

                    return countryEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge className={getEventColor(event.event_type)}>
                              {getEventIcon(event.event_type)}
                              {event.event_type.replace("_", " ")}
                            </Badge>
                            <span className="text-sm text-slate-600">•</span>
                            <span className="text-sm text-slate-600 truncate">
                              {event.page_url}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            <span>{event.device_type}</span>
                            <span> • </span>
                            <span>{event.browser}</span>
                            <span> • </span>
                            <span className="font-medium text-slate-600">
                              {getRelativeTime(event.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button onClick={closeGeoModal} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Browser Detail Modal */}
      <Dialog open={showBrowserModal} onOpenChange={setShowBrowserModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">
                  {selectedBrowserDetail?.name}
                </div>
                <div className="text-sm text-slate-500">Browser Analytics</div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Detailed analytics and insights for {selectedBrowserDetail?.name}{" "}
              users
            </DialogDescription>
          </DialogHeader>

          {selectedBrowserDetail && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedBrowserDetail.count.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">Total Users</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedBrowserDetail.value}%
                  </div>
                  <div className="text-sm text-green-700">Market Share</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {(() => {
                      const browserEvents =
                        analytics?.recentEvents.filter(
                          (event) =>
                            event.browser === selectedBrowserDetail.name
                        ) || [];
                      return browserEvents.length.toLocaleString();
                    })()}
                  </div>
                  <div className="text-sm text-purple-700">Total Events</div>
                </div>
              </div>

              {/* Event Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Event Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(() => {
                    const browserEvents =
                      analytics?.recentEvents.filter(
                        (event) => event.browser === selectedBrowserDetail.name
                      ) || [];

                    const eventTypes = browserEvents.reduce((acc, event) => {
                      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);

                    return Object.entries(eventTypes).map(([type, count]) => (
                      <div key={type} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getEventColor(type)}>
                            {getEventIcon(type)}
                            {type.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-xl font-bold text-slate-900">
                          {count.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          {Math.round((count / browserEvents.length) * 100)}% of
                          total
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Device & Geographic Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Device Types
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const browserEvents =
                        analytics?.recentEvents.filter(
                          (event) =>
                            event.browser === selectedBrowserDetail.name
                        ) || [];

                      const deviceTypes = browserEvents.reduce((acc, event) => {
                        acc[event.device_type] =
                          (acc[event.device_type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);

                      return Object.entries(deviceTypes)
                        .sort(([, a], [, b]) => b - a)
                        .map(([device, count]) => (
                          <div
                            key={device}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                              <span className="font-medium capitalize">
                                {device}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900">
                                {count}
                              </div>
                              <div className="text-sm text-slate-500">
                                {Math.round(
                                  (count / browserEvents.length) * 100
                                )}
                                %
                              </div>
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Top Countries
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const browserEvents =
                        analytics?.recentEvents.filter(
                          (event) =>
                            event.browser === selectedBrowserDetail.name
                        ) || [];

                      const countries = browserEvents.reduce((acc, event) => {
                        acc[event.country] = (acc[event.country] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);

                      return Object.entries(countries)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([country, count]) => (
                          <div
                            key={country}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {getCountryFlag(country)}
                              </span>
                              <span className="font-medium">{country}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900">
                                {count}
                              </div>
                              <div className="text-sm text-slate-500">
                                {Math.round(
                                  (count / browserEvents.length) * 100
                                )}
                                %
                              </div>
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Recent Events from this Browser */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Events
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(() => {
                    const browserEvents =
                      analytics?.recentEvents
                        .filter(
                          (event) =>
                            event.browser === selectedBrowserDetail.name
                        )
                        .slice(0, 10) || [];

                    return browserEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge className={getEventColor(event.event_type)}>
                              {getEventIcon(event.event_type)}
                              {event.event_type.replace("_", " ")}
                            </Badge>
                            <span className="text-sm text-slate-600">•</span>
                            <span className="text-sm text-slate-600 truncate">
                              {event.page_url}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            <span>{event.device_type}</span>
                            <span> • </span>
                            <span>{event.country}</span>
                            <span> • </span>
                            <span className="font-medium text-slate-600">
                              {getRelativeTime(event.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button onClick={closeBrowserModal} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DynamicLiveAnalytics;
