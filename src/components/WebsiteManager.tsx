
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Globe, Copy, CheckCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Website {
  id: string;
  name: string;
  domain: string;
  tracking_code: string;
  is_active: boolean;
  created_at: string;
}

const WebsiteManager = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWebsite, setNewWebsite] = useState({ name: '', domain: '' });
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWebsites();
    }
  }, [user]);

  const fetchWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast({
        title: "Error",
        description: "Failed to load websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingCode = () => {
    return `TW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addWebsite = async () => {
    if (!newWebsite.name || !newWebsite.domain) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsAddingWebsite(true);
    try {
      const trackingCode = generateTrackingCode();
      const { error } = await supabase
        .from('websites')
        .insert([
          {
            name: newWebsite.name,
            domain: newWebsite.domain,
            tracking_code: trackingCode,
            user_id: user?.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Website added successfully",
      });
      
      setNewWebsite({ name: '', domain: '' });
      setIsDialogOpen(false);
      fetchWebsites();
    } catch (error) {
      console.error('Error adding website:', error);
      toast({
        title: "Error",
        description: "Failed to add website",
        variant: "destructive",
      });
    } finally {
      setIsAddingWebsite(false);
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Website deleted successfully",
      });
      
      fetchWebsites();
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive",
      });
    }
  };

  const copyTrackingCode = (trackingCode: string) => {
    const fullTrackingCode = `<!-- TrackWiser Tracking Code -->
<script>
(function() {
  var tw = window.tw = window.tw || [];
  if (tw.initialized) return;
  
  tw.initialized = true;
  tw.siteId = '${trackingCode}';
  tw.apiUrl = 'https://ltluebewuhheisbbjcss.supabase.co';
  
  tw.track = function(event, properties) {
    tw.push(['track', event, properties || {}]);
  };
  
  tw.identify = function(userId, traits) {
    tw.push(['identify', userId, traits || {}]);
  };
  
  tw.page = function(name, properties) {
    tw.push(['page', name || document.title, properties || {}]);
  };
  
  tw.page();
  
  var script = document.createElement('script');
  script.src = tw.apiUrl + '/tw.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>
<!-- End TrackWiser Tracking Code -->`;

    navigator.clipboard.writeText(fullTrackingCode);
    toast({
      title: "Success",
      description: "Tracking code copied to clipboard",
    });
  };

  if (loading) {
    return (
      <Card className="bg-white/80 border-sky-100">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading websites...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Your Websites</CardTitle>
              <CardDescription>Manage your tracked websites and get analytics</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Website
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Website</DialogTitle>
                  <DialogDescription>
                    Add a new website to start tracking analytics
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="website-name">Website Name</Label>
                    <Input
                      id="website-name"
                      placeholder="My Awesome Website"
                      value={newWebsite.name}
                      onChange={(e) =>
                        setNewWebsite({ ...newWebsite, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="website-domain">Domain</Label>
                    <Input
                      id="website-domain"
                      placeholder="example.com"
                      value={newWebsite.domain}
                      onChange={(e) =>
                        setNewWebsite({ ...newWebsite, domain: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    onClick={addWebsite}
                    disabled={isAddingWebsite}
                    className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                  >
                    {isAddingWebsite ? 'Adding...' : 'Add Website'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {websites.length === 0 ? (
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                No websites added yet. Click &quot;Add Website&quot; to get started with tracking.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{website.name}</h3>
                      <p className="text-sm text-slate-600">{website.domain}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          className={
                            website.is_active
                              ? 'bg-lime-100 text-lime-800 border-lime-200'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }
                        >
                          {website.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {website.tracking_code}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyTrackingCode(website.tracking_code)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteWebsite(website.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteManager;
