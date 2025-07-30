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
  Users,
  Globe,
  Activity,
  TrendingUp,
  Eye,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";

interface LiveVisitor {
  id: string;
  visitor_id: string;
  website_id: string;
  page_url: string;
  country: string;
  city: string;
  device_type: string;
  browser: string;
  os: string;
  created_at: string;
  is_active: boolean;
  last_seen: string;
}

const OverviewLiveVisitors = () => {
  const { analyticsEvents, websites } = useUserData();
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [deviceStats, setDeviceStats] = useState({
    desktop: 0,
    mobile: 0,
    tablet: 0,
  });
  const [countryStats, setCountryStats] = useState<
    Array<{
      country: string;
      count: number;
      flag: string;
    }>
  >([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);

  // Update time since last update
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceUpdate(
        Math.floor((Date.now() - lastUpdate.getTime()) / 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Generate live visitor data from analytics events
  useEffect(() => {
    const generateLiveVisitors = () => {
      if (!analyticsEvents.length) return;

      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      // Get recent events and create live visitors
      const recentEvents = analyticsEvents.filter(
        (event) => new Date(event.created_at) >= fiveMinutesAgo && !event.is_bot
      );

      // Group by visitor_id to create unique visitors
      const visitorMap = new Map<string, LiveVisitor>();

      recentEvents.forEach((event) => {
        if (!visitorMap.has(event.visitor_id)) {
          visitorMap.set(event.visitor_id, {
            id: event.visitor_id,
            visitor_id: event.visitor_id,
            website_id: event.website_id,
            page_url: event.page_url,
            country: event.country || "Unknown",
            city: event.city || "Unknown",
            device_type: event.device_type || "desktop",
            browser: event.browser || "Unknown",
            os: event.os || "Unknown",
            created_at: event.created_at,
            is_active:
              new Date(event.created_at) >=
              new Date(now.getTime() - 2 * 60 * 1000),
            last_seen: event.created_at,
          });
        } else {
          // Update existing visitor
          const existing = visitorMap.get(event.visitor_id);
          existing.page_url = event.page_url;
          existing.last_seen = event.created_at;
          existing.is_active =
            new Date(event.created_at) >=
            new Date(now.getTime() - 2 * 60 * 1000);
        }
      });

      const visitors = Array.from(visitorMap.values());
      setLiveVisitors(visitors);
      setVisitorCount(visitors.length);
      setActiveCount(visitors.filter((v) => v.is_active).length);

      // Calculate device stats
      const deviceCounts = visitors.reduce(
        (acc, visitor) => {
          const device = visitor.device_type.toLowerCase();
          if (device.includes("mobile")) acc.mobile++;
          else if (device.includes("tablet")) acc.tablet++;
          else acc.desktop++;
          return acc;
        },
        { desktop: 0, mobile: 0, tablet: 0 }
      );

      setDeviceStats(deviceCounts);

      // Calculate country stats
      const countryCounts = visitors.reduce((acc, visitor) => {
        const country = visitor.country;
        const existing = acc.find((c) => c.country === country);
        if (existing) {
          existing.count++;
        } else {
          acc.push({
            country,
            count: 1,
            flag: getCountryFlag(country),
          });
        }
        return acc;
      }, [] as Array<{ country: string; count: number; flag: string }>);

      setCountryStats(
        countryCounts.sort((a, b) => b.count - a.count).slice(0, 5)
      );
      setLastUpdate(new Date());
    };

    generateLiveVisitors();

    // Update every second
    const interval = setInterval(generateLiveVisitors, 1000);

    return () => clearInterval(interval);
  }, [analyticsEvents]);

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      Japan: "🇯🇵",
      India: "🇮🇳",
      Brazil: "🇧🇷",
      Mexico: "🇲🇽",
      Spain: "🇪🇸",
      Italy: "🇮🇹",
      Netherlands: "🇳🇱",
      Sweden: "🇸🇪",
      Norway: "🇳🇴",
      Denmark: "🇩🇰",
      Finland: "🇫🇮",
      Switzerland: "🇨🇭",
      Austria: "🇦🇹",
      Belgium: "🇧🇪",
    };
    return flags[country] || "🌍";
  };

  const getDeviceIcon = (deviceType: string) => {
    const device = deviceType.toLowerCase();
    if (device.includes("mobile")) return <Smartphone className="w-4 h-4" />;
    if (device.includes("tablet")) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Live Visitor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Total Visitors
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {visitorCount}
                  </p>
                </div>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Active Now
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {activeCount}
                  </p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Countries
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {countryStats.length}
                  </p>
                </div>
              </div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Visitors List */}
      <Card className="bg-white/80 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-sky-500" />
            <span>Live Visitors</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Wifi className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <span className="text-xs text-slate-500 ml-2">
              Last updated: {lastUpdate.toLocaleTimeString()} ({timeSinceUpdate}
              s ago)
            </span>
          </CardTitle>
          <CardDescription>
            Real-time visitor activity from the last 5 minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {liveVisitors.length === 0 ? (
            <div className="text-center py-8">
              <WifiOff className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No active visitors</p>
              <p className="text-sm text-slate-500">
                Visitors will appear here when they browse your websites
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveVisitors.slice(0, 10).map((visitor, index) => (
                <div
                  key={visitor.id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    visitor.is_active
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            visitor.is_active
                              ? "bg-green-500 animate-pulse"
                              : "bg-slate-400"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-slate-900">
                          {visitor.visitor_id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">
                          {getCountryFlag(visitor.country)}
                        </span>
                        <span className="text-xs text-slate-600">
                          {visitor.country}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        {getDeviceIcon(visitor.device_type)}
                        <span className="text-xs">{visitor.device_type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">
                        {new Date(visitor.last_seen).toLocaleTimeString()}
                      </span>
                      <Badge
                        variant={visitor.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {visitor.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="font-medium">Page:</span>{" "}
                    {visitor.page_url}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device & Country Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Distribution */}
        <Card className="bg-white/80 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-sky-500" />
              <span>Device Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Desktop</span>
                </div>
                <span className="text-sm font-bold text-blue-900">
                  {deviceStats.desktop}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Mobile</span>
                </div>
                <span className="text-sm font-bold text-green-900">
                  {deviceStats.mobile}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Tablet className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Tablet</span>
                </div>
                <span className="text-sm font-bold text-purple-900">
                  {deviceStats.tablet}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card className="bg-white/80 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-sky-500" />
              <span>Top Countries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countryStats.map((country, index) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm font-medium">
                      {country.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (country.count /
                              Math.max(...countryStats.map((c) => c.count))) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {country.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewLiveVisitors;
