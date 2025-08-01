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
  EyeOff,
  Shield,
  Target,
  Users,
  Globe,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Filter,
  Search,
  RefreshCw,
  Save,
  Loader2,
  MapPin,
  Smartphone,
} from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CloakingRule {
  id: string;
  website_id: string;
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

interface CloakingStats {
  totalRules: number;
  activeRules: number;
  totalHits: number;
  blockedVisitors: number;
  safePageViews: number;
  moneyPageViews: number;
  warningPageViews: number;
  recentActivity: Array<{
    id: string;
    action: string;
    visitor_id: string;
    country: string;
    device_type: string;
    created_at: string;
  }>;
}

const CloakingDashboard = () => {
  const { websites } = useUserData();
  const { toast } = useToast();
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [cloakingRules, setCloakingRules] = useState<CloakingRule[]>([]);
  const [cloakingPages, setCloakingPages] = useState<CloakingPage[]>([]);
  const [cloakingStats, setCloakingStats] = useState<CloakingStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [cloakingEnabled, setCloakingEnabled] = useState(false);
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<CloakingRule | null>(null);
  const [editingPage, setEditingPage] = useState<CloakingPage | null>(null);

  // Form states for adding/editing rules
  const [ruleForm, setRuleForm] = useState({
    name: "",
    trigger: "user_agent" as const,
    condition: "",
    action: "safe_page" as const,
  });

  // Form states for adding/editing pages
  const [pageForm, setPageForm] = useState({
    page_type: "safe" as const,
    url: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    if (websites.length > 0 && !selectedWebsite) {
      setSelectedWebsite(websites[0].id);
    } else if (websites.length === 0) {
      setLoading(false);
    }
  }, [websites, selectedWebsite]);

  useEffect(() => {
    if (selectedWebsite) {
      fetchCloakingData();
    }
  }, [selectedWebsite]);

  const fetchCloakingData = async () => {
    if (!selectedWebsite) return;

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
        .eq("website_id", selectedWebsite)
        .order("created_at", { ascending: false });

      if (pagesError) throw pagesError;
      setCloakingPages(pages || []);

      // Fetch cloaking stats from analytics events
      const { data: events, error: eventsError } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("website_id", selectedWebsite)
        .not("cloaking_action", "is", null)
        .order("created_at", { ascending: false })
        .limit(100);

      if (eventsError) throw eventsError;

      // Calculate stats
      const stats: CloakingStats = {
        totalRules: rules?.length || 0,
        activeRules: rules?.filter((r) => r.status === "active").length || 0,
        totalHits: rules?.reduce((sum, r) => sum + r.hits, 0) || 0,
        blockedVisitors:
          events?.filter((e) => e.cloaking_action === "block").length || 0,
        safePageViews:
          events?.filter((e) => e.cloaking_action === "safe_page").length || 0,
        moneyPageViews:
          events?.filter((e) => e.cloaking_action === "money_page").length || 0,
        warningPageViews:
          events?.filter((e) => e.cloaking_action === "warning_page").length ||
          0,
        recentActivity:
          events?.slice(0, 10).map((e) => ({
            id: e.id,
            action: e.cloaking_action || "",
            visitor_id: e.visitor_id,
            country: e.country || "",
            device_type: e.device_type || "",
            created_at: e.created_at,
          })) || [],
      };

      setCloakingStats(stats);

      // Check if cloaking is enabled for this website
      const website = websites.find((w) => w.id === selectedWebsite);
      setCloakingEnabled(website?.cloaking_enabled || false);
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

  const toggleCloaking = async (enabled: boolean) => {
    if (!selectedWebsite) return;

    try {
      const { error } = await supabase
        .from("websites")
        .update({ cloaking_enabled: enabled })
        .eq("id", selectedWebsite);

      if (error) throw error;

      setCloakingEnabled(enabled);
      toast({
        title: "Success",
        description: `Cloaking ${
          enabled ? "enabled" : "disabled"
        } for this website`,
      });
    } catch (error) {
      console.error("Error toggling cloaking:", error);
      toast({
        title: "Error",
        description: "Failed to update cloaking settings",
        variant: "destructive",
      });
    }
  };

  const addCloakingRule = async () => {
    if (!selectedWebsite || !ruleForm.name || !ruleForm.condition) return;

    try {
      const { error } = await supabase.from("cloaking_rules").insert({
        website_id: selectedWebsite,
        name: ruleForm.name,
        trigger: ruleForm.trigger,
        condition: ruleForm.condition,
        action: ruleForm.action,
        status: "active",
        hits: 0,
      });

      if (error) throw error;

      setShowAddRuleDialog(false);
      setRuleForm({
        name: "",
        trigger: "user_agent",
        condition: "",
        action: "safe_page",
      });
      fetchCloakingData();
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

  const addCloakingPage = async () => {
    if (
      !selectedWebsite ||
      !pageForm.url ||
      !pageForm.title ||
      !pageForm.content
    )
      return;

    try {
      const { error } = await supabase.from("cloaking_pages").insert({
        website_id: selectedWebsite,
        page_type: pageForm.page_type,
        url: pageForm.url,
        title: pageForm.title,
        content: pageForm.content,
        is_active: true,
      });

      if (error) throw error;

      setShowAddPageDialog(false);
      setPageForm({ page_type: "safe", url: "", title: "", content: "" });
      fetchCloakingData();
      toast({
        title: "Success",
        description: "Cloaking page added successfully",
      });
    } catch (error) {
      console.error("Error adding cloaking page:", error);
      toast({
        title: "Error",
        description: "Failed to add cloaking page",
        variant: "destructive",
      });
    }
  };

  const updateRuleStatus = async (
    ruleId: string,
    status: "active" | "paused"
  ) => {
    try {
      const { error } = await supabase
        .from("cloaking_rules")
        .update({ status })
        .eq("id", ruleId);

      if (error) throw error;

      fetchCloakingData();
      toast({
        title: "Success",
        description: `Rule ${status === "active" ? "activated" : "paused"}`,
      });
    } catch (error) {
      console.error("Error updating rule status:", error);
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive",
      });
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from("cloaking_rules")
        .delete()
        .eq("id", ruleId);

      if (error) throw error;

      fetchCloakingData();
      toast({
        title: "Success",
        description: "Rule deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      });
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "user_agent":
        return <Globe className="w-4 h-4" />;
      case "country":
        return <MapPin className="w-4 h-4" />;
      case "device_type":
        return <Smartphone className="w-4 h-4" />;
      case "ip_reputation":
        return <Shield className="w-4 h-4" />;
      case "connection_type":
        return <Activity className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "safe_page":
        return "bg-green-100 text-green-800 border-green-200";
      case "money_page":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning_page":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "block":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-slate-600">Loading cloaking data...</p>
        </div>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <EyeOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No websites found
          </h3>
          <p className="text-slate-600">
            Add a website to start configuring cloaking
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
                <EyeOff className="w-6 h-6 mr-2 text-sky-500" />
                Cloaking Dashboard
              </CardTitle>
              <CardDescription>
                Manage cloaking rules and pages for visitor filtering
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
                <span className="text-sm text-slate-600">Cloaking</span>
                <Switch
                  checked={cloakingEnabled}
                  onCheckedChange={toggleCloaking}
                />
              </div>
              <Button onClick={fetchCloakingData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      {cloakingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-100 text-sm">Total Rules</p>
                  <p className="text-2xl font-bold">
                    {cloakingStats.totalRules}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Rules</p>
                  <p className="text-2xl font-bold">
                    {cloakingStats.activeRules}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Hits</p>
                  <p className="text-2xl font-bold">
                    {cloakingStats.totalHits}
                  </p>
                </div>
                <Target className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Blocked Visitors</p>
                  <p className="text-2xl font-bold">
                    {cloakingStats.blockedVisitors}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cloaking Rules */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-sky-500" />
                Cloaking Rules
              </CardTitle>
              <CardDescription>
                Define conditions for visitor filtering and actions
              </CardDescription>
            </div>
            <Dialog
              open={showAddRuleDialog}
              onOpenChange={setShowAddRuleDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Cloaking Rule</DialogTitle>
                  <DialogDescription>
                    Create a new rule to filter visitors based on specific
                    conditions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Rule Name</label>
                    <Input
                      value={ruleForm.name}
                      onChange={(e) =>
                        setRuleForm({ ...ruleForm, name: e.target.value })
                      }
                      placeholder="e.g., Block Bots"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Trigger</label>
                    <Select
                      value={ruleForm.trigger}
                      onValueChange={(value) =>
                        setRuleForm({ ...ruleForm, trigger: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user_agent">User Agent</SelectItem>
                        <SelectItem value="country">Country</SelectItem>
                        <SelectItem value="device_type">Device Type</SelectItem>
                        <SelectItem value="ip_reputation">
                          IP Reputation
                        </SelectItem>
                        <SelectItem value="connection_type">
                          Connection Type
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Condition</label>
                    <Input
                      value={ruleForm.condition}
                      onChange={(e) =>
                        setRuleForm({ ...ruleForm, condition: e.target.value })
                      }
                      placeholder="e.g., bot, crawler, etc."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Action</label>
                    <Select
                      value={ruleForm.action}
                      onValueChange={(value) =>
                        setRuleForm({ ...ruleForm, action: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safe_page">
                          Show Safe Page
                        </SelectItem>
                        <SelectItem value="money_page">
                          Show Money Page
                        </SelectItem>
                        <SelectItem value="warning_page">
                          Show Warning Page
                        </SelectItem>
                        <SelectItem value="block">Block Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddRuleDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addCloakingRule}>
                    <Save className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cloakingRules.length > 0 ? (
              cloakingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getTriggerIcon(rule.trigger)}
                    <div>
                      <div className="font-medium text-slate-900">
                        {rule.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {rule.trigger}: {rule.condition}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getActionColor(rule.action)}>
                      {rule.action.replace("_", " ")}
                    </Badge>
                    <Badge
                      variant={
                        rule.status === "active" ? "default" : "secondary"
                      }
                    >
                      {rule.status}
                    </Badge>
                    <div className="text-sm text-slate-500">
                      {rule.hits} hits
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateRuleStatus(
                            rule.id,
                            rule.status === "active" ? "paused" : "active"
                          )
                        }
                      >
                        {rule.status === "active" ? "Pause" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No cloaking rules configured
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cloaking Pages */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-sky-500" />
                Cloaking Pages
              </CardTitle>
              <CardDescription>
                Configure different pages to show to filtered visitors
              </CardDescription>
            </div>
            <Dialog
              open={showAddPageDialog}
              onOpenChange={setShowAddPageDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Page
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Cloaking Page</DialogTitle>
                  <DialogDescription>
                    Create a new page to show to visitors based on cloaking
                    rules.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Page Type</label>
                    <Select
                      value={pageForm.page_type}
                      onValueChange={(value) =>
                        setPageForm({ ...pageForm, page_type: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safe">Safe Page</SelectItem>
                        <SelectItem value="money">Money Page</SelectItem>
                        <SelectItem value="warning">Warning Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <Input
                      value={pageForm.url}
                      onChange={(e) =>
                        setPageForm({ ...pageForm, url: e.target.value })
                      }
                      placeholder="e.g., /safe-page"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={pageForm.title}
                      onChange={(e) =>
                        setPageForm({ ...pageForm, title: e.target.value })
                      }
                      placeholder="Page title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <textarea
                      value={pageForm.content}
                      onChange={(e) =>
                        setPageForm({ ...pageForm, content: e.target.value })
                      }
                      placeholder="HTML content"
                      className="w-full p-2 border border-slate-200 rounded-md"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddPageDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addCloakingPage}>
                    <Save className="w-4 h-4 mr-2" />
                    Add Page
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cloakingPages.length > 0 ? (
              cloakingPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium text-slate-900">
                        {page.title}
                      </div>
                      <div className="text-sm text-slate-500">
                        {page.page_type} • {page.url}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getActionColor(page.page_type + "_page")}>
                      {page.page_type}
                    </Badge>
                    <Badge variant={page.is_active ? "default" : "secondary"}>
                      {page.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No cloaking pages configured
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {cloakingStats?.recentActivity &&
        cloakingStats.recentActivity.length > 0 && (
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-sky-500" />
                Recent Cloaking Activity
              </CardTitle>
              <CardDescription>
                Latest cloaking actions and visitor interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cloakingStats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge className={getActionColor(activity.action)}>
                          {activity.action.replace("_", " ")}
                        </Badge>
                        <span className="text-sm text-slate-600">•</span>
                        <span className="text-sm text-slate-600">
                          {activity.country} • {activity.device_type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(activity.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default CloakingDashboard;
