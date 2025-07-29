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
import { Globe, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
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

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const { data: websitesData } = await supabase
        .from("websites")
        .select(
          `
          *,
          profiles!websites_user_id_fkey(email)
        `
        )
        .order("created_at", { ascending: false });

      const websitesWithStats = await Promise.all(
        (websitesData || []).map(async (website: any) => {
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
            user_email: website.profiles?.email || "Unknown",
            total_events: totalEvents || 0,
            total_bots: totalBots || 0,
            today_events: todayEvents || 0,
            today_bots: todayBots || 0,
            last_activity: lastActivity?.created_at || null,
          };
        })
      );

      setWebsites(websitesWithStats);
    } catch (error) {
      console.error("Error fetching websites:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website?")) return;

    try {
      const { error } = await supabase
        .from("websites")
        .delete()
        .eq("id", websiteId);

      if (error) throw error;
      await fetchWebsites();
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };

  const toggleWebsiteStatus = async (
    websiteId: string,
    currentStatus: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("websites")
        .update({ is_active: !currentStatus })
        .eq("id", websiteId);

      if (error) throw error;
      await fetchWebsites();
    } catch (error) {
      console.error("Error updating website status:", error);
    }
  };

  const updateWebsite = async (websiteData: Partial<Website>) => {
    try {
      const { error } = await supabase
        .from("websites")
        .update(websiteData)
        .eq("id", websiteData.id);

      if (error) throw error;
      await fetchWebsites();
      setWebsiteDialogOpen(false);
      setEditingWebsite(null);
    } catch (error) {
      console.error("Error updating website:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Website Management
            </CardTitle>
            <CardDescription>
              Manage all tracked websites and their settings
            </CardDescription>
          </div>
          <Button onClick={() => setWebsiteDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Website
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websites.map((website) => (
            <Card key={website.id} className="bg-white/80 border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{website.name}</CardTitle>
                  <Badge
                    className={
                      website.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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
                <CardDescription>{website.domain}</CardDescription>
                <div className="text-sm text-slate-500">
                  Owner: {website.user_email}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Tracking Code:</span>
                    <code className="ml-2 bg-slate-100 px-2 py-1 rounded text-xs">
                      {website.tracking_code}
                    </code>
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(website.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toggleWebsiteStatus(website.id, website.is_active)
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Website Edit Dialog */}
        <Dialog open={websiteDialogOpen} onOpenChange={setWebsiteDialogOpen}>
          <DialogContent>
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
                onClick={() => setWebsiteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => editingWebsite && updateWebsite(editingWebsite)}
              >
                {editingWebsite ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminWebsites;
