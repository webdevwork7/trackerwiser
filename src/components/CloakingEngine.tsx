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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Globe,
  Shield,
  Zap,
  Settings,
  Plus,
  Edit,
  Trash2,
  Activity,
  AlertTriangle,
  Save,
  Loader2,
} from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CloakingRule {
  id: string;
  name: string;
  trigger:
    | "user_agent"
    | "ip_reputation"
    | "connection_type"
    | "country"
    | "device_type";
  condition: string;
  action: "safe_page" | "money_page" | "warning_page" | "block";
  status: "active" | "paused";
  hits: number;
  website_id: string;
  created_at: string;
}

interface CloakingPage {
  id: string;
  website_id: string;
  page_type: "safe" | "money" | "warning";
  url: string;
  title: string;
  content: string;
  is_active: boolean;
}

const CloakingEngine = () => {
  const { websites } = useUserData();
  const { toast } = useToast();
  const [cloakingEnabled, setCloakingEnabled] = useState(true);
  const [showPreview, setShowPreview] = useState("safe");
  const [loading, setLoading] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [cloakingRules, setCloakingRules] = useState<CloakingRule[]>([]);
  const [cloakingPages, setCloakingPages] = useState<CloakingPage[]>([]);
  const [cloakingStats, setCloakingStats] = useState({
    totalCloaks: 0,
    safePageViews: 0,
    moneyPageViews: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    if (websites.length > 0 && !selectedWebsite) {
      setSelectedWebsite(websites[0].id);
    }
  }, [websites, selectedWebsite]);

  useEffect(() => {
    if (selectedWebsite) {
      fetchCloakingData();
    }
  }, [selectedWebsite]);

  const fetchCloakingData = async () => {
    setLoading(true);
    try {
      // Fetch cloaking rules
      const { data: rules, error: rulesError } = await supabase
        .from("cloaking_rules")
        .select("*")
        .eq("website_id", selectedWebsite)
        .order("created_at", { ascending: false });

      if (rulesError) throw rulesError;
      setCloakingRules(rules || []);

      // Fetch cloaking pages
      const { data: pages, error: pagesError } = await supabase
        .from("cloaking_pages")
        .select("*")
        .eq("website_id", selectedWebsite);

      if (pagesError) throw pagesError;
      setCloakingPages(pages || []);

      // Fetch cloaking stats
      await fetchCloakingStats();
    } catch (error) {
      console.error("Error fetching cloaking data:", error);
      toast({
        title: "Error",
        description: "Failed to load cloaking data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCloakingStats = async () => {
    try {
      // Get cloaking events from analytics_events table
      const { data: events, error } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("website_id", selectedWebsite)
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) throw error;

      const totalEvents = events?.length || 0;
      const safeEvents =
        events?.filter((e) => e.cloaking_action === "safe_page").length || 0;
      const moneyEvents =
        events?.filter((e) => e.cloaking_action === "money_page").length || 0;

      setCloakingStats({
        totalCloaks: totalEvents,
        safePageViews: safeEvents,
        moneyPageViews: moneyEvents,
        conversionRate:
          moneyEvents > 0 ? Math.round((moneyEvents / totalEvents) * 100) : 0,
      });
    } catch (error) {
      console.error("Error fetching cloaking stats:", error);
    }
  };

  const addCloakingRule = async (
    rule: Omit<CloakingRule, "id" | "created_at" | "hits">
  ) => {
    try {
      const { data, error } = await supabase
        .from("cloaking_rules")
        .insert({
          ...rule,
          hits: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setCloakingRules((prev) => [data, ...prev]);
      toast({
        title: "Success",
        description: "Cloaking rule added successfully",
      });
    } catch (error) {
      console.error("Error adding cloaking rule:", error);
      toast({
        title: "Error",
        description: "Failed to add cloaking rule",
        variant: "destructive",
      });
    }
  };

  const updateCloakingPage = async (page: CloakingPage) => {
    try {
      const { error } = await supabase.from("cloaking_pages").upsert(page);

      if (error) throw error;

      setCloakingPages((prev) =>
        prev.map((p) => (p.id === page.id ? page : p))
      );

      toast({
        title: "Success",
        description: "Page configuration updated",
      });
    } catch (error) {
      console.error("Error updating cloaking page:", error);
      toast({
        title: "Error",
        description: "Failed to update page configuration",
        variant: "destructive",
      });
    }
  };

  const toggleCloaking = async (enabled: boolean) => {
    setLoading(true);
    try {
      // Update website cloaking setting
      const { error } = await supabase
        .from("websites")
        .update({ cloaking_enabled: enabled })
        .eq("id", selectedWebsite);

      if (error) throw error;

      setCloakingEnabled(enabled);
      toast({
        title: "Success",
        description: `Cloaking ${enabled ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      console.error("Error toggling cloaking:", error);
      toast({
        title: "Error",
        description: "Failed to update cloaking setting",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-sky-500" />
                Cloaking Engine
              </CardTitle>
              <CardDescription>
                Smart page switching for bots vs. humans
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Cloaking</span>
                <Switch
                  checked={cloakingEnabled}
                  onCheckedChange={setCloakingEnabled}
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cloakingStats.totalCloaks > 0 && (
          <>
            <Card key="total-cloaks" className="bg-white/80 border-sky-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Cloaks Today
                </CardTitle>
                <Activity className="h-4 w-4 text-sky-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {cloakingStats.totalCloaks}
                </div>
                <p className="text-xs text-lime-600 mt-1">from yesterday</p>
              </CardContent>
            </Card>
            <Card key="safe-page-views" className="bg-white/80 border-sky-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Safe Page Views
                </CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {cloakingStats.safePageViews}
                </div>
                <p className="text-xs text-lime-600 mt-1">from yesterday</p>
              </CardContent>
            </Card>
            <Card key="money-page-views" className="bg-white/80 border-sky-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Money Page Views
                </CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {cloakingStats.moneyPageViews}
                </div>
                <p className="text-xs text-lime-600 mt-1">from yesterday</p>
              </CardContent>
            </Card>
            <Card key="conversion-rate" className="bg-white/80 border-sky-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Conversion Rate (Money)
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {cloakingStats.conversionRate}%
                </div>
                <p className="text-xs text-lime-600 mt-1">from yesterday</p>
              </CardContent>
            </Card>
          </>
        )}
        {loading && (
          <div className="col-span-4 flex justify-center items-center">
            <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Main Cloaking Tabs */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200">
          <TabsTrigger value="rules">Cloaking Rules</TabsTrigger>
          <TabsTrigger value="pages">Page Configuration</TabsTrigger>
          <TabsTrigger value="logs">Cloaking Logs</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">
                    Cloaking Rules
                  </CardTitle>
                  <CardDescription>
                    Define when to show safe vs. money pages
                  </CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cloakingRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {rule.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {rule.trigger}: {rule.condition} → {rule.action}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge
                          className={
                            rule.status === "active"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {rule.status === "active" ? "Active" : "Paused"}
                        </Badge>
                        <div className="text-xs text-slate-500 mt-1">
                          {rule.hits} hits today
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Safe Page Configuration
                </CardTitle>
                <CardDescription>
                  Page shown to bots and suspicious traffic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="safe-url">Safe Page URL</Label>
                  <Input
                    id="safe-url"
                    placeholder="https://example.com/safe"
                    defaultValue="/safe-page"
                  />
                </div>
                <div>
                  <Label htmlFor="safe-title">Page Title</Label>
                  <Input
                    id="safe-title"
                    placeholder="Page Title"
                    defaultValue="Welcome to Our Website"
                  />
                </div>
                <div>
                  <Label htmlFor="safe-content">Page Content</Label>
                  <Textarea
                    id="safe-content"
                    placeholder="Enter safe page content..."
                    defaultValue="Welcome to our website. We provide quality services and products."
                    rows={6}
                  />
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Update Safe Page
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Money Page Configuration
                </CardTitle>
                <CardDescription>
                  Page shown to real human visitors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="money-url">Money Page URL</Label>
                  <Input
                    id="money-url"
                    placeholder="https://example.com/offer"
                    defaultValue="/landing-page"
                  />
                </div>
                <div>
                  <Label htmlFor="money-title">Page Title</Label>
                  <Input
                    id="money-title"
                    placeholder="Page Title"
                    defaultValue="Special Offer - Limited Time!"
                  />
                </div>
                <div>
                  <Label htmlFor="money-content">Page Content</Label>
                  <Textarea
                    id="money-content"
                    placeholder="Enter money page content..."
                    defaultValue="🔥 Limited Time Offer! Get 50% off our premium service. Act now before it's too late!"
                    rows={6}
                  />
                </div>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  Update Money Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Cloaking Logs</CardTitle>
              <CardDescription>
                Real-time log of all cloaking decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    time: "2 min ago",
                    ip: "192.168.1.100",
                    userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1)",
                    decision: "Safe Page",
                    rule: "Search Engine Bots",
                    country: "🇺🇸",
                  },
                  {
                    time: "3 min ago",
                    ip: "10.0.0.45",
                    userAgent:
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    decision: "Money Page",
                    rule: "Human Visitor",
                    country: "🇨🇦",
                  },
                  {
                    time: "5 min ago",
                    ip: "185.220.101.5",
                    userAgent: "curl/7.68.0",
                    decision: "Safe Page",
                    rule: "Suspicious User Agent",
                    country: "🇩🇪",
                  },
                ].map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          log.decision === "Money Page"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {log.country} {log.ip} → {log.decision}
                        </div>
                        <div className="text-sm text-slate-500 truncate max-w-md">
                          {log.userAgent}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-sky-100 text-sky-800 border-sky-200">
                        {log.rule}
                      </Badge>
                      <div className="text-xs text-slate-500 mt-1">
                        {log.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Page Preview</CardTitle>
                  <CardDescription>
                    Preview how different visitors see your pages
                  </CardDescription>
                </div>
                <Select value={showPreview} onValueChange={setShowPreview}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select page type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safe">Safe Page (Bots)</SelectItem>
                    <SelectItem value="money">Money Page (Humans)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 p-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 text-slate-600 text-sm">
                    {showPreview === "safe"
                      ? "example.com/safe-page"
                      : "example.com/landing-page"}
                  </div>
                </div>
                <div className="p-8 bg-white min-h-96">
                  {showPreview === "safe" ? (
                    <div className="text-center">
                      <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h1 className="text-3xl font-bold text-slate-900 mb-4">
                        Welcome to Our Website
                      </h1>
                      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We provide quality services and products to help your
                        business grow. Our team is dedicated to delivering
                        excellence in everything we do.
                      </p>
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold mb-2">
                            Quality Service
                          </h3>
                          <p className="text-sm text-slate-600">
                            Professional services you can trust
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Expert Team</h3>
                          <p className="text-sm text-slate-600">
                            Experienced professionals
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Support</h3>
                          <p className="text-sm text-slate-600">
                            24/7 customer support
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        🔥 Limited Time Offer!
                      </h1>
                      <p className="text-xl text-slate-600 mb-6">
                        Get 50% off our premium service. Act now before it's too
                        late!
                      </p>
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg mb-6">
                        <div className="text-3xl font-bold mb-2">
                          $49.99 $24.99
                        </div>
                        <div className="text-lg">Save $25 Today Only!</div>
                      </div>
                      <Button
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg"
                      >
                        Claim Your Discount Now!
                      </Button>
                      <p className="text-sm text-slate-500 mt-4">
                        ⏰ Offer expires in 23:45:12
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CloakingEngine;
