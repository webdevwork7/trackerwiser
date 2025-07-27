
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Globe, 
  Settings, 
  Trash2, 
  Edit, 
  Copy,
  CheckCircle,
  XCircle,
  Code,
  BarChart3,
  Eye,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TrackingScriptGenerator from './TrackingScriptGenerator';

interface Website {
  id: string;
  name: string;
  domain: string;
  tracking_code: string;
  is_active: boolean;
  created_at: string;
}

const WebsiteManager = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingWebsite, setAddingWebsite] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [newWebsite, setNewWebsite] = useState({ name: '', domain: '' });

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
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingCode = () => {
    return 'TW_' + Math.random().toString(36).substr(2, 12).toUpperCase();
  };

  const validateDomain = (domain: string) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const addWebsite = async () => {
    if (!newWebsite.name || !newWebsite.domain) return;

    // Clean domain (remove protocol and www)
    const cleanDomain = newWebsite.domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .toLowerCase();

    if (!validateDomain(cleanDomain)) {
      alert('Please enter a valid domain name');
      return;
    }

    setAddingWebsite(true);
    try {
      const { data, error } = await supabase
        .from('websites')
        .insert([
          {
            name: newWebsite.name,
            domain: cleanDomain,
            tracking_code: generateTrackingCode(),
            user_id: user?.id,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setWebsites([data, ...websites]);
      setNewWebsite({ name: '', domain: '' });
      setSelectedWebsite(data);
    } catch (error) {
      console.error('Error adding website:', error);
      alert('Error adding website. Please try again.');
    } finally {
      setAddingWebsite(false);
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);

      if (error) throw error;

      setWebsites(websites.filter(w => w.id !== websiteId));
      if (selectedWebsite?.id === websiteId) {
        setSelectedWebsite(null);
      }
    } catch (error) {
      console.error('Error deleting website:', error);
      alert('Error deleting website. Please try again.');
    }
  };

  const toggleWebsiteStatus = async (websiteId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('websites')
        .update({ is_active: !isActive })
        .eq('id', websiteId);

      if (error) throw error;

      setWebsites(websites.map(w => 
        w.id === websiteId ? { ...w, is_active: !isActive } : w
      ));
    } catch (error) {
      console.error('Error updating website status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Guide */}
      <Card className="bg-gradient-to-r from-sky-50 to-teal-50 border-sky-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-sky-500" />
            🚀 Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get your website tracking in 3 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mx-auto mb-2">1</div>
              <h3 className="font-semibold text-slate-900 mb-1">Add Website</h3>
              <p className="text-sm text-slate-600">Enter your website name and domain below</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mx-auto mb-2">2</div>
              <h3 className="font-semibold text-slate-900 mb-1">Get Tracking Code</h3>
              <p className="text-sm text-slate-600">Click on "Tracking Code" tab to get your script</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mx-auto mb-2">3</div>
              <h3 className="font-semibold text-slate-900 mb-1">Paste & Go Live</h3>
              <p className="text-sm text-slate-600">Copy script to your website's &lt;head&gt; section</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-sky-500" />
            Website Management
          </CardTitle>
          <CardDescription>
            Add and manage your websites for tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website-name">Website Name</Label>
                <Input
                  id="website-name"
                  placeholder="My Awesome Website"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website-domain">Domain (without https://)</Label>
                <Input
                  id="website-domain"
                  placeholder="example.com"
                  value={newWebsite.domain}
                  onChange={(e) => setNewWebsite({ ...newWebsite, domain: e.target.value })}
                />
              </div>
            </div>
            <Button
              onClick={addWebsite}
              disabled={addingWebsite || !newWebsite.name || !newWebsite.domain}
              className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
            >
              {addingWebsite ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {addingWebsite ? 'Adding...' : 'Add Website'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {websites.length > 0 ? (
        <Tabs defaultValue="websites" className="space-y-6">
          <TabsList className="bg-white/80 border border-slate-200">
            <TabsTrigger value="websites">My Websites</TabsTrigger>
            <TabsTrigger value="tracking" disabled={!selectedWebsite}>
              📋 Get Tracking Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="websites" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {websites.map((website) => (
                <Card
                  key={website.id}
                  className={`bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 cursor-pointer ${
                    selectedWebsite?.id === website.id ? 'ring-2 ring-sky-500' : ''
                  }`}
                  onClick={() => setSelectedWebsite(website)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-900 text-lg">{website.name}</CardTitle>
                      <Badge className={website.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                        {website.is_active ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {website.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {website.domain}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Tracking ID:</span>
                        <code className="ml-2 bg-slate-100 px-2 py-1 rounded text-xs">
                          {website.tracking_code}
                        </code>
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Created:</span>
                        <span className="ml-2">{new Date(website.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWebsiteStatus(website.id, website.is_active);
                          }}
                        >
                          {website.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWebsite(website.id);
                          }}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedWebsite && (
              <Alert className="border-blue-200 bg-blue-50">
                <Code className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>✅ Selected:</strong> {selectedWebsite.name} - Click on the "📋 Get Tracking Code" tab above to get your complete installation script.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="tracking">
            {selectedWebsite ? (
              <TrackingScriptGenerator website={selectedWebsite} />
            ) : (
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  Please select a website from the "My Websites" tab to view its tracking code.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-white/80 border-sky-100">
          <CardContent className="py-12 text-center">
            <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No websites added yet</h3>
            <p className="text-slate-600 mb-4">
              Add your first website to start tracking real-time analytics
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <BarChart3 className="w-4 h-4" />
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Eye className="w-4 h-4" />
                <span>Bot Detection</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Zap className="w-4 h-4" />
                <span>Live Updates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebsiteManager;
