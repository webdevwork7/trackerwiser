import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Website {
  id: string;
  name: string;
  domain: string;
  tracking_code: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
}

interface AnalyticsEvent {
  id: string;
  website_id: string;
  event_type: string;
  visitor_id: string;
  session_id: string;
  page_url: string;
  referrer: string;
  user_agent: string;
  ip_address: string;
  country: string;
  city: string;
  device_type: string;
  browser: string;
  os: string;
  is_bot: boolean;
  created_at: string;
}

interface BotDetection {
  id: string;
  website_id: string;
  ip_address: string;
  user_agent: string;
  detection_reason: string;
  is_blocked: boolean;
  created_at: string;
}

interface UserStats {
  totalWebsites: number;
  activeWebsites: number;
  totalVisitors: number;
  todayVisitors: number;
  totalBotsBlocked: number;
  todayBotsBlocked: number;
  totalPageViews: number;
  todayPageViews: number;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [botDetections, setBotDetections] = useState<BotDetection[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalWebsites: 0,
    activeWebsites: 0,
    totalVisitors: 0,
    todayVisitors: 0,
    totalBotsBlocked: 0,
    todayBotsBlocked: 0,
    totalPageViews: 0,
    todayPageViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      setWebsites([]);
      setAnalyticsEvents([]);
      setBotDetections([]);
      setStats({
        totalWebsites: 0,
        activeWebsites: 0,
        totalVisitors: 0,
        todayVisitors: 0,
        totalBotsBlocked: 0,
        todayBotsBlocked: 0,
        totalPageViews: 0,
        todayPageViews: 0,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user's websites
      const { data: websitesData, error: websitesError } = await supabase
        .from("websites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (websitesError) throw websitesError;

      setWebsites(websitesData || []);

      // Get website IDs for analytics queries
      const websiteIds = websitesData?.map((w) => w.id) || [];

      let freshAnalyticsData: AnalyticsEvent[] = [];
      let freshBotData: BotDetection[] = [];

      if (websiteIds.length > 0) {
        // Fetch analytics events for user's websites
        const { data: analyticsData, error: analyticsError } = await supabase
          .from("analytics_events")
          .select("*")
          .in("website_id", websiteIds)
          .order("created_at", { ascending: false });

        if (analyticsError) throw analyticsError;
        freshAnalyticsData = (analyticsData || []) as AnalyticsEvent[];
        setAnalyticsEvents(freshAnalyticsData);

        // Fetch bot detections for user's websites
        const { data: botData, error: botError } = await supabase
          .from("bot_detections")
          .select("*")
          .in("website_id", websiteIds)
          .order("created_at", { ascending: false });

        if (botError) throw botError;
        freshBotData = (botData || []) as BotDetection[];
        setBotDetections(freshBotData);
      } else {
        setAnalyticsEvents([]);
        setBotDetections([]);
      }

      // Calculate stats using the freshly fetched data
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeWebsites =
        websitesData?.filter((w) => w.is_active).length || 0;

      const totalVisitors = freshAnalyticsData.filter((e) => !e.is_bot).length;
      const todayVisitors = freshAnalyticsData.filter(
        (e) => !e.is_bot && new Date(e.created_at) >= today
      ).length;
      const totalBotsBlocked = freshBotData.filter((b) => b.is_blocked).length;
      const todayBotsBlocked = freshBotData.filter(
        (b) => b.is_blocked && new Date(b.created_at) >= today
      ).length;
      const totalPageViews = freshAnalyticsData.filter(
        (e) => e.event_type === "page_view"
      ).length;
      const todayPageViews = freshAnalyticsData.filter(
        (e) => e.event_type === "page_view" && new Date(e.created_at) >= today
      ).length;

      setStats({
        totalWebsites: websitesData?.length || 0,
        activeWebsites,
        totalVisitors,
        todayVisitors,
        totalBotsBlocked,
        todayBotsBlocked,
        totalPageViews,
        todayPageViews,
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user-data-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "analytics_events",
        },
        () => {
          // Refresh data when analytics events change
          fetchUserData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bot_detections",
        },
        () => {
          // Refresh data when bot detections change
          fetchUserData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "websites",
        },
        () => {
          // Refresh data when websites change
          fetchUserData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Recalculate stats when analytics data changes
  useEffect(() => {
    if (!loading && user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeWebsites = websites.filter((w) => w.is_active).length;
      const totalVisitors = analyticsEvents.filter((e) => !e.is_bot).length;
      const todayVisitors = analyticsEvents.filter(
        (e) => !e.is_bot && new Date(e.created_at) >= today
      ).length;
      const totalBotsBlocked = botDetections.filter((b) => b.is_blocked).length;
      const todayBotsBlocked = botDetections.filter(
        (b) => b.is_blocked && new Date(b.created_at) >= today
      ).length;
      const totalPageViews = analyticsEvents.filter(
        (e) => e.event_type === "page_view"
      ).length;
      const todayPageViews = analyticsEvents.filter(
        (e) => e.event_type === "page_view" && new Date(e.created_at) >= today
      ).length;

      setStats({
        totalWebsites: websites.length,
        activeWebsites,
        totalVisitors,
        todayVisitors,
        totalBotsBlocked,
        todayBotsBlocked,
        totalPageViews,
        todayPageViews,
      });
    }
  }, [websites, analyticsEvents, botDetections, loading, user]);

  const refreshData = () => {
    fetchUserData();
  };

  return {
    websites,
    analyticsEvents,
    botDetections,
    stats,
    loading,
    error,
    refreshData,
  };
};
