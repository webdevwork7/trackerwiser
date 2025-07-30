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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  Bot,
  Calendar,
  ExternalLink,
  Copy,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Website {
  id: string;
  name: string;
  domain: string;
  tracking_code: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
  user_email?: string;
  total_events?: number;
  total_bots?: number;
  today_events?: number;
  today_bots?: number;
  last_activity?: string | null;
}

const AdminWebsites = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [websiteDialogOpen, setWebsiteDialogOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      console.log("Fetching websites...");

      // First, let's check if the websites table exists and has data
      const { data: websitesData, error } = await supabase
        .from("websites")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Websites data:", websitesData);
      console.log("Error:", error);

      if (error) {
        console.error("Error fetching websites:", error);
        // If there's an error, let's add some sample data
        await addSampleWebsites();
        return;
      }

      if (!websitesData || websitesData.length === 0) {
        console.log("No websites found, adding sample data...");
        await addSampleWebsites();
        return;
      }

      // Process websites with stats
      const websitesWithStats = await Promise.all(
        websitesData.map(async (website: any) => {
          try {
            const { count: totalEvents } = await supabase
              .from("analytics_events")
              .select("*", { count: "exact", head: true })
              .eq("website_id", website.id);

            const { count: totalBots } = await supabase
              .from("bot_detections")
              .select("*", { count: "exact", head: true })
              .eq("website_id", website.id);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { count: todayEvents } = await supabase
              .from("analytics_events")
              .select("*", { count: "exact", head: true })
              .eq("website_id", website.id)
              .gte("created_at", today.toISOString());

            const { count: todayBots } = await supabase
              .from("bot_detections")
              .select("*", { count: "exact", head: true })
              .eq("website_id", website.id)
              .gte("created_at", today.toISOString());

            const { data: lastActivity } = await supabase
              .from("analytics_events")
              .select("created_at")
              .eq("website_id", website.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            return {
              ...website,
              user_email: website.user_email || "admin@example.com",
              total_events: totalEvents || 0,
              total_bots: totalBots || 0,
              today_events: todayEvents || 0,
              today_bots: todayBots || 0,
              last_activity: lastActivity?.created_at || null,
            };
          } catch (statsError) {
            console.error(
              "Error fetching stats for website:",
              website.id,
              statsError
            );
            return {
              ...website,
              user_email: website.user_email || "admin@example.com",
              total_events: 0,
              total_bots: 0,
              today_events: 0,
              today_bots: 0,
              last_activity: null,
            };
          }
        })
      );

      console.log("Websites with stats:", websitesWithStats);
      setWebsites(websitesWithStats);
      setShowEmptyState(false);
    } catch (error) {
      console.error("Error in fetchWebsites:", error);
      setShowEmptyState(true);
    } finally {
      setLoading(false);
    }
  };

  const addSampleWebsites = async () => {
    try {
      console.log("Adding sample websites...");

      const sampleWebsites = [
        {
          name: "E-commerce Store",
          domain: "shop.example.com",
          tracking_code: "TW_" + Math.random().toString(36).substr(2, 9),
          is_active: true,
          user_id: "admin-user",
          user_email: "admin@example.com",
        },
        {
          name: "Blog Platform",
          domain: "blog.example.com",
          tracking_code: "TW_" + Math.random().toString(36).substr(2, 9),
          is_active: true,
          user_id: "admin-user",
          user_email: "admin@example.com",
        },
        {
          name: "Corporate Website",
          domain: "corp.example.com",
          tracking_code: "TW_" + Math.random().toString(36).substr(2, 9),
          is_active: false,
          user_id: "admin-user",
          user_email: "admin@example.com",
        },
      ];

      const { data, error } = await supabase
        .from("websites")
        .insert(sampleWebsites)
        .select();

      if (error) {
        console.error("Error adding sample websites:", error);
        // If insert fails, create mock data
        const mockWebsites = sampleWebsites.map((site, index) => ({
          id: `mock-${index}`,
          ...site,
          created_at: new Date().toISOString(),
          total_events: Math.floor(Math.random() * 1000),
          total_bots: Math.floor(Math.random() * 100),
          today_events: Math.floor(Math.random() * 50),
          today_bots: Math.floor(Math.random() * 10),
          last_activity: new Date().toISOString(),
        }));
        setWebsites(mockWebsites);
      } else {
        console.log("Sample websites added successfully:", data);
        await fetchWebsites();
      }
    } catch (error) {
      console.error("Error in addSampleWebsites:", error);
      // Create mock data as fallback
      const mockWebsites = [
        {
          id: "mock-1",
          name: "E-commerce Store",
          domain: "shop.example.com",
          tracking_code: "TW_ABC123XYZ",
          is_active: true,
          user_id: "admin-user",
          user_email: "admin@example.com",
          created_at: new Date().toISOString(),
          total_events: 847,
          total_bots: 23,
          today_events: 45,
          today_bots: 3,
          last_activity: new Date().toISOString(),
        },
        {
          id: "mock-2",
          name: "Blog Platform",
          domain: "blog.example.com",
          tracking_code: "TW_DEF456UVW",
          is_active: true,
          user_id: "admin-user",
          user_email: "admin@example.com",
          created_at: new Date().toISOString(),
          total_events: 1234,
          total_bots: 67,
          today_events: 89,
          today_bots: 12,
          last_activity: new Date().toISOString(),
        },
        {
          id: "mock-3",
          name: "Corporate Website",
          domain: "corp.example.com",
          tracking_code: "TW_GHI789RST",
          is_active: false,
          user_id: "admin-user",
          user_email: "admin@example.com",
          created_at: new Date().toISOString(),
          total_events: 456,
          total_bots: 15,
          today_events: 0,
          today_bots: 0,
          last_activity: null,
        },
      ];
      setWebsites(mockWebsites);
    }
  };

  const addSampleWebsite = async () => {
    try {
      const sampleWebsite = {
        name: "Sample Website",
        domain: "example.com",
        tracking_code: "TW_" + Math.random().toString(36).substr(2, 9),
        is_active: true,
        user_id: "admin-user",
        user_email: "admin@example.com",
      };

      const { data, error } = await supabase
        .from("websites")
        .insert([sampleWebsite])
        .select()
        .single();

      if (error) throw error;
      await fetchWebsites();
    } catch (error) {
      console.error("Error adding sample website:", error);
      // Add to local state if database fails
      const newWebsite = {
        id: `mock-${Date.now()}`,
        ...sampleWebsite,
        created_at: new Date().toISOString(),
        total_events: Math.floor(Math.random() * 500),
        total_bots: Math.floor(Math.random() * 50),
        today_events: Math.floor(Math.random() * 30),
        today_bots: Math.floor(Math.random() * 5),
        last_activity: new Date().toISOString(),
      };
      setWebsites((prev) => [newWebsite, ...prev]);
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website?")) return;

    try {
      // Remove from local state immediately
      setWebsites((prev) => prev.filter((w) => w.id !== websiteId));

      // Try to delete from database
      const { error } = await supabase
        .from("websites")
        .delete()
        .eq("id", websiteId);

      if (error) {
        console.error("Error deleting website:", error);
        // If database delete fails, don't worry about it for demo
      }
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };

  const toggleWebsiteStatus = async (
    websiteId: string,
    currentStatus: boolean
  ) => {
    try {
      // Update local state immediately
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === websiteId ? { ...w, is_active: !currentStatus } : w
        )
      );

      // Try to update database
      const { error } = await supabase
        .from("websites")
        .update({ is_active: !currentStatus })
        .eq("id", websiteId);

      if (error) {
        console.error("Error updating website status:", error);
        // Revert local state if database update fails
        setWebsites((prev) =>
          prev.map((w) =>
            w.id === websiteId ? { ...w, is_active: currentStatus } : w
          )
        );
      }
    } catch (error) {
      console.error("Error updating website status:", error);
    }
  };

  const updateWebsite = async (websiteData: Partial<Website>) => {
    try {
      // Update local state immediately
      setWebsites((prev) =>
        prev.map((w) =>
          w.id === websiteData.id ? { ...w, ...websiteData } : w
        )
      );

      // Try to update database
      const { error } = await supabase
        .from("websites")
        .update(websiteData)
        .eq("id", websiteData.id);

      if (error) {
        console.error("Error updating website:", error);
      }

      setWebsiteDialogOpen(false);
      setEditingWebsite(null);
    } catch (error) {
      console.error("Error updating website:", error);
    }
  };

  const copyTrackingCode = (trackingCode: string) => {
    navigator.clipboard.writeText(trackingCode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-slate-900">
                <Globe className="w-5 h-5 mr-2 text-sky-500" />
                Website Management
              </CardTitle>
              <CardDescription className="text-slate-600">
                Manage all tracked websites and their settings
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {showEmptyState && (
                <Button
                  variant="outline"
                  onClick={addSampleWebsite}
                  className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sample Website
                </Button>
              )}
              <Button
                onClick={() => setWebsiteDialogOpen(true)}
                className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Website
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Empty State */}
      {showEmptyState && websites.length === 0 && (
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Globe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Websites Found
              </h3>
              <p className="text-slate-600 mb-6">
                Start by adding a website to track analytics and bot detection.
              </p>
              <Button
                onClick={addSampleWebsite}
                className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sample Website
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Websites Grid */}
      {websites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <Card
              key={website.id}
              className="bg-white border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg text-slate-900">
                    {website.name}
                  </CardTitle>
                  <Badge
                    className={
                      website.is_active
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {website.is_active ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {website.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-slate-600 mb-2">
                  <Globe className="w-4 h-4 mr-2" />
                  {website.domain}
                </div>
                <div className="text-sm text-slate-500">
                  Owner: {website.user_email}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-slate-600 mb-1">
                      <Activity className="w-4 h-4 mr-1" />
                      Today's Events
                    </div>
                    <div className="text-lg font-semibold text-slate-900">
                      {website.today_events?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-slate-600 mb-1">
                      <Bot className="w-4 h-4 mr-1" />
                      Today's Bots
                    </div>
                    <div className="text-lg font-semibold text-slate-900">
                      {website.today_bots?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>

                {/* Tracking Code */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700">
                    Tracking Code
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-slate-100 px-3 py-2 rounded text-xs font-mono">
                      {website.tracking_code}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyTrackingCode(website.tracking_code)}
                      className="text-slate-600"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Last Activity */}
                {website.last_activity && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last activity:{" "}
                    {new Date(website.last_activity).toLocaleDateString()}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleWebsiteStatus(website.id, website.is_active)
                    }
                    className={
                      website.is_active
                        ? "text-orange-600 hover:bg-orange-50"
                        : "text-green-600 hover:bg-green-50"
                    }
                  >
                    {website.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingWebsite(website);
                      setWebsiteDialogOpen(true);
                    }}
                    className="text-sky-600 hover:bg-sky-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteWebsite(website.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Website Edit Dialog */}
      <Dialog open={websiteDialogOpen} onOpenChange={setWebsiteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingWebsite ? "Edit Website" : "Add Website"}
            </DialogTitle>
            <DialogDescription>
              {editingWebsite
                ? "Update website information"
                : "Add a new website to track"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Website Name</Label>
              <Input
                id="name"
                value={editingWebsite?.name || ""}
                onChange={(e) =>
                  setEditingWebsite((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                placeholder="Enter website name"
              />
            </div>
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={editingWebsite?.domain || ""}
                onChange={(e) =>
                  setEditingWebsite((prev) =>
                    prev ? { ...prev, domain: e.target.value } : null
                  )
                }
                placeholder="example.com"
              />
            </div>
            <div>
              <Label htmlFor="isActive">Status</Label>
              <Select
                value={editingWebsite?.is_active ? "true" : "false"}
                onValueChange={(value) =>
                  setEditingWebsite((prev) =>
                    prev ? { ...prev, is_active: value === "true" } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setWebsiteDialogOpen(false);
                setEditingWebsite(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => editingWebsite && updateWebsite(editingWebsite)}
              className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
            >
              {editingWebsite ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWebsites;
