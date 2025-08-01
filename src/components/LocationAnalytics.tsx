import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Globe,
  Users,
  Eye,
  MousePointer,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe2,
  Map as MapIcon,
  Navigation,
  Activity,
  Shield,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { supabase } from "@/integrations/supabase/client";

interface LocationEvent {
  id: string;
  event_type: string;
  page_url: string;
  visitor_id: string;
  session_id: string;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  created_at: string;
  website_id: string;
  websites?: {
    id: string;
    name: string;
  };
}

interface LocationStats {
  totalLocations: number;
  uniqueCountries: number;
  uniqueCities: number;
  totalIPs: number;
  activeSessions: number;
  topCountries: Array<{
    country: string;
    flag: string;
    visitors: number;
    events: number;
    percentage: number;
  }>;
  topCities: Array<{
    city: string;
    country: string;
    flag: string;
    visitors: number;
    events: number;
  }>;
  recentEvents: LocationEvent[];
}

const LocationAnalytics = () => {
  const { websites } = useUserData();
  const [locationStats, setLocationStats] = useState<LocationStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState("24h");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (websites.length > 0) {
      fetchLocationData();
    } else if (websites.length === 0) {
      // If no websites, stop loading
      setLoading(false);
    }
  }, [selectedWebsite, timeFilter, websites]);

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      // Get the current user's website IDs
      const currentUserWebsiteIds = websites.map((website) => website.id);

      // If no websites, show empty state
      if (currentUserWebsiteIds.length === 0) {
        setLocationStats({
          totalLocations: 0,
          uniqueCountries: 0,
          uniqueCities: 0,
          totalIPs: 0,
          activeSessions: 0,
          topCountries: [],
          topCities: [],
          recentEvents: [],
        });
        setLoading(false);
        return;
      }

      let query = supabase.from("analytics_events").select(`
          *,
          websites (
            id,
            name
          )
        `);

      // Filter by current user's websites
      query = query.in("website_id", currentUserWebsiteIds);

      // Apply specific website filter if selected
      if (selectedWebsite !== "all") {
        query = query.eq("website_id", selectedWebsite);
      }

      // Apply time filter
      const timeFilterDate = getTimeFilterDate(timeFilter);
      if (timeFilterDate) {
        query = query.gte("created_at", timeFilterDate.toISOString());
      }

      const { data: events, error } = await query;

      if (error) {
        console.error("Error fetching location data:", error);
        throw error;
      }

      if (events && events.length > 0) {
        // Cast the events to the correct type
        const typedEvents: LocationEvent[] = events.map((event) => ({
          ...event,
          ip_address: event.ip_address as string | null,
          country: event.country as string | null,
          city: event.city as string | null,
          device_type: event.device_type as string | null,
          browser: event.browser as string | null,
          os: event.os as string | null,
        }));

        const processedData = processLocationData(typedEvents);
        setLocationStats(processedData);
      } else {
        // Set empty stats if no data
        setLocationStats({
          totalLocations: 0,
          uniqueCountries: 0,
          uniqueCities: 0,
          totalIPs: 0,
          activeSessions: 0,
          topCountries: [],
          topCities: [],
          recentEvents: [],
        });
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      // Set empty stats on error
      setLocationStats({
        totalLocations: 0,
        uniqueCountries: 0,
        uniqueCities: 0,
        totalIPs: 0,
        activeSessions: 0,
        topCountries: [],
        topCities: [],
        recentEvents: [],
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

  const processLocationData = (events: LocationEvent[]): LocationStats => {
    // Group by country
    const countryMap = new Map<
      string,
      {
        country: string;
        flag: string;
        visitors: Set<string>;
        events: number;
      }
    >();
    const cityMap = new Map<
      string,
      {
        city: string;
        country: string;
        flag: string;
        visitors: Set<string>;
        events: number;
      }
    >();
    const ipSet = new Set<string>();
    const sessionSet = new Set<string>();

    events.forEach((event) => {
      // Skip events without location data
      if (!event.country || !event.city || !event.ip_address) {
        return;
      }

      // Country stats
      if (!countryMap.has(event.country)) {
        countryMap.set(event.country, {
          country: event.country,
          flag: getCountryFlag(event.country),
          visitors: new Set<string>(),
          events: 0,
        });
      }
      const countryData = countryMap.get(event.country)!;
      countryData.visitors.add(event.visitor_id);
      countryData.events += 1;

      // City stats
      const cityKey = `${event.city}, ${event.country}`;
      if (!cityMap.has(cityKey)) {
        cityMap.set(cityKey, {
          city: event.city,
          country: event.country,
          flag: getCountryFlag(event.country),
          visitors: new Set<string>(),
          events: 0,
        });
      }
      const cityData = cityMap.get(cityKey)!;
      cityData.visitors.add(event.visitor_id);
      cityData.events += 1;

      // IP and session tracking
      ipSet.add(event.ip_address);
      sessionSet.add(event.session_id);
    });

    // Convert to arrays and calculate percentages
    const totalEvents = events.length;
    const topCountries = Array.from(countryMap.values())
      .map((country) => ({
        country: country.country,
        flag: country.flag,
        visitors: country.visitors.size,
        events: country.events,
        percentage: Math.round((country.events / totalEvents) * 100),
      }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 10);

    const topCities = Array.from(cityMap.values())
      .map((city) => ({
        city: city.city,
        country: city.country,
        flag: city.flag,
        visitors: city.visitors.size,
        events: city.events,
      }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 10);

    return {
      totalLocations: countryMap.size,
      uniqueCountries: countryMap.size,
      uniqueCities: cityMap.size,
      totalIPs: ipSet.size,
      activeSessions: sessionSet.size,
      topCountries,
      topCities,
      recentEvents: events
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 50)
        .map((event) => ({
          ...event,
          website_name: event.websites?.name,
        })),
    };
  };

  const getCountryFlag = (country: string) => {
    const flagMap: { [key: string]: string } = {
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      Canada: "🇨🇦",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Japan: "🇯🇵",
      Australia: "🇦🇺",
      Brazil: "🇧🇷",
      India: "🇮🇳",
      China: "🇨🇳",
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
    return flagMap[country] || "🌍";
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "page_view":
        return <Eye className="w-3 h-3" />;
      case "click":
        return <MousePointer className="w-3 h-3" />;
      case "form_submit":
        return <Target className="w-3 h-3" />;
      case "scroll":
        return <Navigation className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredEvents = locationStats?.recentEvents.filter((event) =>
    searchTerm
      ? event.page_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.ip_address?.includes(searchTerm)
      : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-slate-600">Loading location data...</p>
        </div>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No websites found
          </h3>
          <p className="text-slate-600">
            Add a website to start tracking location analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sky-100 text-sm">Total Locations</p>
                <p className="text-2xl font-bold">
                  {locationStats?.totalLocations}
                </p>
              </div>
              <Globe2 className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Unique Countries</p>
                <p className="text-2xl font-bold">
                  {locationStats?.uniqueCountries}
                </p>
              </div>
              <MapIcon className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Unique Cities</p>
                <p className="text-2xl font-bold">
                  {locationStats?.uniqueCities}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Unique IPs</p>
                <p className="text-2xl font-bold">{locationStats?.totalIPs}</p>
              </div>
              <Shield className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Active Sessions</p>
                <p className="text-2xl font-bold">
                  {locationStats?.activeSessions}
                </p>
              </div>
              <Users className="w-8 h-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

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
              <option value="all">All Websites</option>
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

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by URL, country, city, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button onClick={fetchLocationData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Countries and Cities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-sky-500" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationStats?.topCountries.map((country, index) => (
                <div key={country.country} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <div className="font-medium text-slate-900">
                          {country.country}
                        </div>
                        <div className="text-sm text-slate-500">
                          {country.visitors} visitors
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {country.events} events
                      </div>
                      <div className="text-xs text-slate-500">
                        {country.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-teal-500" />
              Top Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationStats?.topCities.map((city, index) => (
                <div key={`${city.city}-${city.country}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{city.flag}</span>
                      <div>
                        <div className="font-medium text-slate-900">
                          {city.city}
                        </div>
                        <div className="text-sm text-slate-500">
                          {city.country}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {city.events} events
                      </div>
                      <div className="text-xs text-slate-500">
                        {city.visitors} visitors
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (city.events /
                            Math.max(
                              ...locationStats.topCities.map((c) => c.events)
                            )) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Location Events */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-sky-500" />
            Recent Location Events
          </CardTitle>
          <CardDescription>
            Detailed tracking of user interactions with location data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredEvents && filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getCountryFlag(event.country || "")}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge className={getEventColor(event.event_type)}>
                        {getEventIcon(event.event_type)}
                        {event.event_type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {event.page_url}
                      </span>
                      {event.websites?.name && (
                        <Badge variant="outline" className="text-xs">
                          {event.websites.name}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {event.city}, {event.country} • {event.ip_address} •{" "}
                      {event.device_type} • {event.browser}
                    </div>
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
                  : "No location events available"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationAnalytics;
