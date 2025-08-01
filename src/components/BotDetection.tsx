import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bot, RefreshCw, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePageVisibility } from "@/hooks/use-page-visibility";
import BotDetectionStats from "./bot-detection/BotDetectionStats";
import BotDetectionOverview from "./bot-detection/BotDetectionOverview";
import BotDetectionEvents from "./bot-detection/BotDetectionEvents";
import BotDetectionThreats from "./bot-detection/BotDetectionThreats";
import BotDetectionRules from "./bot-detection/BotDetectionRules";
import BotDetectionWhitelist from "./bot-detection/BotDetectionWhitelist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BotEvent {
  id: string;
  type: string;
  ip: string;
  action: string;
  created_at: string;
  country: string;
  risk: string;
  confidence: number;
  method: string;
  details: string;
  website_id?: string;
}

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

const BotDetection = () => {
  const [autoBlockEnabled, setAutoBlockEnabled] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [mlEnabled, setMlEnabled] = useState(true);
  const [behavioralAnalysis, setBehavioralAnalysis] = useState(true);

  // Dynamic state
  const [botEvents, setBotEvents] = useState<BotEvent[]>([]);
  const [botTypes, setBotTypes] = useState<BotType[]>([]);
  const [threatData, setThreatData] = useState<ThreatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDetected: 0,
    totalBlocked: 0,
    totalAllowed: 0,
    threatLevel: "Medium",
    avgResponseTime: 0,
    accuracy: 0,
  });
  const isVisible = usePageVisibility();

  useEffect(() => {
    fetchBotData();
    const interval = setInterval(() => {
      if (isVisible.current) {
        fetchBotData();
      }
    }, 30000); // Refresh every 30 seconds only when tab is visible
    return () => clearInterval(interval);
  }, [isVisible]);

  const fetchBotData = async () => {
    try {
      setLoading(true);

      // Fetch bot detection events
      const { data: eventsData, error: eventsError } = await supabase
        .from("bot_detections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (eventsError) {
        console.error("Error fetching bot events:", eventsError);
      }

      // Process bot events
      const processedEvents = (eventsData || []).map((event: any) => ({
        id: event.id,
        type: event.bot_type || "Unknown Bot",
        ip: event.ip_address || "Unknown",
        action: event.action || "Blocked",
        created_at: event.created_at,
        country: event.country || "Unknown",
        risk: event.risk_level || "Medium",
        confidence: event.confidence || 85,
        method: event.detection_method || "ML + Behavioral",
        details: event.details || "Bot detected through automated analysis",
        website_id: event.website_id,
      }));

      setBotEvents(processedEvents);

      // Calculate bot types distribution
      const typeCounts = processedEvents.reduce((acc: any, event) => {
        if (!acc[event.type]) {
          acc[event.type] = { count: 0, blocked: 0, allowed: 0 };
        }
        acc[event.type].count++;
        if (event.action === "Blocked") {
          acc[event.type].blocked++;
        } else {
          acc[event.type].allowed++;
        }
        return acc;
      }, {});

      const processedBotTypes = Object.entries(typeCounts).map(
        ([name, data]: [string, any]) => ({
          name,
          count: data.count,
          blocked: data.blocked,
          allowed: data.allowed,
          color: getBotTypeColor(name),
          accuracy: calculateAccuracy(data.blocked, data.allowed),
          falsePositives: calculateFalsePositives(data.blocked, data.allowed),
        })
      );

      setBotTypes(processedBotTypes);

      // Calculate threat timeline (last 6 hours)
      const timelineData = [];
      for (let i = 5; i >= 0; i--) {
        const time = new Date(Date.now() - i * 60 * 60 * 1000);
        const hourEvents = processedEvents.filter((event) => {
          const eventTime = new Date(event.created_at);
          return (
            eventTime.getHours() === time.getHours() &&
            eventTime.getDate() === time.getDate()
          );
        });

        timelineData.push({
          time: time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          threats: hourEvents.length,
          blocked: hourEvents.filter((e) => e.action === "Blocked").length,
          accuracy:
            hourEvents.length > 0
              ? (hourEvents.filter((e) => e.action === "Blocked").length /
                  hourEvents.length) *
                100
              : 0,
          responseTime: Math.floor(Math.random() * 20) + 25,
        });
      }

      setThreatData(timelineData);

      // Calculate overall stats
      const totalDetected = processedEvents.length;
      const totalBlocked = processedEvents.filter(
        (e) => e.action === "Blocked"
      ).length;
      const totalAllowed = processedEvents.filter(
        (e) => e.action === "Allowed"
      ).length;
      const accuracy =
        totalDetected > 0 ? (totalBlocked / totalDetected) * 100 : 0;

      setStats({
        totalDetected,
        totalBlocked,
        totalAllowed,
        threatLevel: calculateThreatLevel(totalDetected),
        avgResponseTime: 32,
        accuracy,
      });
    } catch (error) {
      console.error("Error fetching bot data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBotTypeColor = (type: string) => {
    const colors = {
      "Search Crawlers": "#10B981",
      "Malicious Bots": "#EF4444",
      Scrapers: "#F59E0B",
      Monitoring: "#6366F1",
      "Unknown Bot": "#8B5CF6",
      "DDoS Bot": "#DC2626",
      "Spam Bot": "#7C3AED",
    };
    return colors[type as keyof typeof colors] || "#6B7280";
  };

  const calculateAccuracy = (blocked: number, allowed: number) => {
    const total = blocked + allowed;
    return total > 0 ? Math.round((blocked / total) * 100) : 0;
  };

  const calculateFalsePositives = (blocked: number, allowed: number) => {
    const total = blocked + allowed;
    return total > 0 ? Math.round((allowed / total) * 100) : 0;
  };

  const calculateThreatLevel = (totalDetected: number) => {
    if (totalDetected > 100) return "High";
    if (totalDetected > 50) return "Medium";
    return "Low";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Bot className="w-6 h-6 mr-2 text-teal-500" />
                Advanced Bot Detection & Protection System
              </CardTitle>
              <CardDescription className="text-slate-600">
                Multi-layered ML-powered bot detection with real-time threat
                analysis
              </CardDescription>
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
                <Switch checked={strictMode} onCheckedChange={setStrictMode} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">ML Engine</span>
                <Switch checked={mlEnabled} onCheckedChange={setMlEnabled} />
              </div>
              <Button variant="outline" size="sm" onClick={fetchBotData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <BotDetectionStats stats={stats} />

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="real-time">Real-time Events</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="rules">Block Rules</TabsTrigger>
          <TabsTrigger value="whitelist">Allow Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BotDetectionOverview botTypes={botTypes} threatData={threatData} />
        </TabsContent>

        <TabsContent value="real-time">
          <BotDetectionEvents botEvents={botEvents} />
        </TabsContent>

        <TabsContent value="threats">
          <BotDetectionThreats botTypes={botTypes} stats={stats} />
        </TabsContent>

        <TabsContent value="rules">
          <BotDetectionRules botTypes={botTypes} />
        </TabsContent>

        <TabsContent value="whitelist">
          <BotDetectionWhitelist />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotDetection;
