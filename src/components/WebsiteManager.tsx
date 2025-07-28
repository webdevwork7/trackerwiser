
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart3, 
  Globe, 
  Plus,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Trash2,
  Code
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext';
import TrackingScriptGenerator from './TrackingScriptGenerator';

interface Website {
  id: string;
  name: string;
  domain: string;
  tracking_code: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
}

const WebsiteManager = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [newWebsite, setNewWebsite] = useState({ name: '', domain: '' });
  const [loading, setLoading] = useState(false);
  const [activeWebsites, setActiveWebsites] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [showGuide, setShowGuide] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchWebsites();
  }, []);

  useEffect(() => {
    updateMetrics();
  }, [websites]);

  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching websites:', error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to fetch websites. Please try again.",
        })
      }

      setWebsites(data || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to fetch websites. Please check your connection.",
      })
    }
  };

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
      const trackingCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const { data, error } = await supabase
        .from('websites')
        .insert([{ 
          name: newWebsite.name, 
          domain: newWebsite.domain,
          tracking_code: trackingCode,
          user_id: user.id
        }]);

      if (error) {
        console.error('Error adding website:', error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to add website. Please try again.",
        })
      } else {
        setNewWebsite({ name: '', domain: '' });
        fetchWebsites();
        toast({
          title: "Success!",
          description: "Website added successfully.",
        })
      }
    } catch (error) {
      console.error('Error adding website:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to add website. Please check your connection.",
      })
    } finally {
      setLoading(false);
    }
  };

  const toggleWebsite = async (websiteId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('websites')
        .update({ is_active: isActive })
        .eq('id', websiteId);

      if (error) {
        console.error('Error toggling website:', error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to toggle website status. Please try again.",
        })
      } else {
        setWebsites(websites.map(w => w.id === websiteId ? { ...w, is_active: isActive } : w));
        toast({
          title: "Success!",
          description: "Website status updated successfully.",
        })
      }
    } catch (error) {
      console.error('Error toggling website:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to update website status. Please check your connection.",
      })
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website?')) return;

    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);

      if (error) {
        console.error('Error deleting website:', error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to delete website. Please try again.",
        })
      } else {
        setWebsites(websites.filter(w => w.id !== websiteId));
        toast({
          title: "Success!",
          description: "Website deleted successfully.",
        })
      }
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to delete website. Please check your connection.",
      })
    }
  };

  const updateMetrics = () => {
    setActiveWebsites(websites.filter(w => w.is_active).length);
    setTotalVisitors(12345); // Replace with actual data fetching
    setTodayVisitors(678);   // Replace with actual data fetching
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
              <div className="text-3xl font-bold text-white">{websites.length}</div>
              <div className="text-sky-100 text-sm">Total Websites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{activeWebsites}</div>
              <div className="text-sky-100 text-sm">Active Sites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalVisitors}</div>
              <div className="text-sky-100 text-sm">Total Visitors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{todayVisitors}</div>
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
            <CardDescription>Start tracking analytics for a new website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="website-name" className="text-slate-700">Website Name</Label>
                <Input
                  id="website-name"
                  placeholder="My Awesome Website"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({...newWebsite, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="website-domain" className="text-slate-700">Domain</Label>
                <Input
                  id="website-domain"
                  placeholder="example.com"
                  value={newWebsite.domain}
                  onChange={(e) => setNewWebsite({...newWebsite, domain: e.target.value})}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={addWebsite}
                disabled={!newWebsite.name || !newWebsite.domain}
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
            <CardDescription>Overview of your tracking performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Active Websites</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {activeWebsites} / {websites.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Page Views</span>
                <span className="font-semibold text-slate-900">{totalVisitors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Today's Visitors</span>
                <span className="font-semibold text-slate-900">{todayVisitors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Conversion Rate</span>
                <span className="font-semibold text-green-600">4.2%</span>
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
          <CardDescription>Manage and monitor all your tracked websites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {websites.map((website) => (
              <Card key={website.id} className="bg-slate-50/80 border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900">{website.name}</CardTitle>
                    <Badge className={website.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                      {website.is_active ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {website.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-600">{website.domain}</CardDescription>
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
                      <span className="text-slate-900">{new Date(website.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleWebsite(website.id, !website.is_active)}
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
                        <span className="text-sm font-medium text-slate-700">Installation Guide</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowGuide(showGuide === website.id ? null : website.id)}
                          className="text-sky-600 hover:text-sky-700"
                        >
                          <Code className="w-4 h-4 mr-1" />
                          {showGuide === website.id ? 'Hide' : 'Show'}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteManager;
