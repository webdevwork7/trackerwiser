import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  Globe,
  Plus,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Trash2,
  Code,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/use-user-data";
import TrackingScriptGenerator from "./TrackingScriptGenerator";

const WebsiteManager = () => {
  const [newWebsite, setNewWebsite] = useState({ name: "", domain: "" });
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { websites, stats, refreshData } = useUserData();

  const addWebsite = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to add a website.",
      });
      return;
    }

    setLoading(true);
    try {
      const trackingCode =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const { data, error } = await supabase.from("websites").insert([
        {
          name: newWebsite.name,
          domain: newWebsite.domain,
          tracking_code: trackingCode,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error("Error adding website:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to add website. Please try again.",
        });
      } else {
        setNewWebsite({ name: "", domain: "" });
        refreshData(); // Refresh user data
        toast({
          title: "Success!",
          description: "Website added successfully.",
        });
      }
    } catch (error) {
      console.error("Error adding website:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to add website. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWebsite = async (websiteId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("websites")
        .update({ is_active: isActive })
        .eq("id", websiteId);

      if (error) {
        console.error("Error toggling website:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to toggle website status. Please try again.",
        });
      } else {
        refreshData(); // Refresh user data
        toast({
          title: "Success!",
          description: "Website status updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error toggling website:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "Failed to update website status. Please check your connection.",
      });
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website?")) return;

    try {
      const { error } = await supabase
        .from("websites")
        .delete()
        .eq("id", websiteId);

      if (error) {
        console.error("Error deleting website:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to delete website. Please try again.",
        });
      } else {
        refreshData(); // Refresh user data
        toast({
          title: "Success!",
          description: "Website deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting website:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete website. Please check your connection.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-sky-500 to-teal-500 border-0 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Website Manager</CardTitle>
          <CardDescription className="text-sky-100">
            Manage your websites and tracking codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats.totalWebsites}
              </div>
              <div className="text-sky-100 text-sm">Total Websites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats.activeWebsites}
              </div>
              <div className="text-sky-100 text-sm">Active Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats.totalVisitors}
              </div>
              <div className="text-sky-100 text-sm">Total Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats.todayVisitors}
              </div>
              <div className="text-sky-100 text-sm">Today's Visitors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-sky-500" />
              Add New Website
            </CardTitle>
            <CardDescription>
              Start tracking analytics for a new website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="website-name" className="text-slate-700">
                  Website Name
                </Label>
                <Input
                  id="website-name"
                  placeholder="My Awesome Website"
                  value={newWebsite.name}
                  onChange={(e) =>
                    setNewWebsite({ ...newWebsite, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="website-domain" className="text-slate-700">
                  Domain
                </Label>
                <Input
                  id="website-domain"
                  placeholder="example.com"
                  value={newWebsite.domain}
                  onChange={(e) =>
                    setNewWebsite({ ...newWebsite, domain: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <Button
                onClick={addWebsite}
                disabled={!newWebsite.name || !newWebsite.domain || loading}
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Website
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-sky-500" />
              Quick Stats
            </CardTitle>
            <CardDescription>
              Overview of your tracking performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Active Websites</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {stats.activeWebsites} / {stats.totalWebsites}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Page Views</span>
                <span className="font-semibold text-slate-900">
                  {stats.totalPageViews.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Today's Visitors</span>
                <span className="font-semibold text-slate-900">
                  {stats.todayVisitors.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Bots Blocked</span>
                <span className="font-semibold text-red-600">
                  {stats.totalBotsBlocked.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-sky-500" />
            Your Websites
          </CardTitle>
          <CardDescription>
            Manage and monitor all your tracked websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {websites.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No websites yet
              </h3>
              <p className="text-slate-600 mb-4">
                Start by adding your first website to begin tracking analytics
              </p>
              <Button
                onClick={() => document.getElementById("website-name")?.focus()}
                className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Website
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {websites.map((website) => (
                <Card
                  key={website.id}
                  className="bg-slate-50/80 border-slate-200 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
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
                    <CardDescription className="text-slate-600">
                      {website.domain}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Tracking Code:</span>
                        <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono text-slate-800">
                          {website.tracking_code}
                        </code>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Created:</span>
                        <span className="text-slate-900">
                          {new Date(website.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toggleWebsite(website.id, !website.is_active)
                          }
                          className="flex-1"
                        >
                          {website.is_active ? (
                            <>
                              <Pause className="w-4 h-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteWebsite(website.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            Installation Guide
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setShowGuide(
                                showGuide === website.id ? null : website.id
                              )
                            }
                            className="text-sky-600 hover:text-sky-700"
                          >
                            <Code className="w-4 h-4 mr-1" />
                            {showGuide === website.id ? "Hide" : "Show"}
                          </Button>
                        </div>

                        {showGuide === website.id && (
                          <TrackingScriptGenerator
                            websiteId={website.id}
                            trackingCode={website.tracking_code}
                            domain={website.domain}
                            websiteName={website.name}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteManager;
