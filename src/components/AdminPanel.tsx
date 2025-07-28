
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Globe, 
  Activity, 
  Bot, 
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface AdminWebsite {
  id: string;
  name: string;
  domain: string;
  tracking_code: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
}

interface AdminEvent {
  id: string;
  website_id: string;
  event_type: string;
  visitor_id: string;
  ip_address: string | null;
  is_bot: boolean;
  created_at: string;
}

interface AdminBotDetection {
  id: string;
  website_id: string;
  ip_address: string | null;
  detection_reason: string;
  is_blocked: boolean;
  created_at: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [websites, setWebsites] = useState<AdminWebsite[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [botDetections, setBotDetections] = useState<AdminBotDetection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch users from profiles table
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch websites
      const { data: websitesData, error: websitesError } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (websitesError) throw websitesError;
      setWebsites(websitesData || []);

      // Fetch analytics events
      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) throw eventsError;
      
      // Map the data to match our interface types
      const mappedEvents = (eventsData || []).map(event => ({
        id: event.id,
        website_id: event.website_id,
        event_type: event.event_type,
        visitor_id: event.visitor_id,
        ip_address: event.ip_address as string | null,
        is_bot: event.is_bot,
        created_at: event.created_at
      }));
      
      setEvents(mappedEvents);

      // Fetch bot detections
      const { data: botData, error: botError } = await supabase
        .from('bot_detections')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (botError) throw botError;
      
      // Map the data to match our interface types
      const mappedBotDetections = (botData || []).map(bot => ({
        id: bot.id,
        website_id: bot.website_id,
        ip_address: bot.ip_address as string | null,
        detection_reason: bot.detection_reason,
        is_blocked: bot.is_blocked,
        created_at: bot.created_at
      }));
      
      setBotDetections(mappedBotDetections);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWebsite = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website?')) return;

    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', websiteId);

      if (error) throw error;
      
      setWebsites(websites.filter(w => w.id !== websiteId));
    } catch (error) {
      console.error('Error deleting website:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWebsites = websites.filter(website => 
    website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Admin Panel - System Management
          </CardTitle>
          <CardDescription className="text-red-700">
            Manage users, websites, and monitor system activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-900">{users.length}</div>
              <div className="text-red-700 text-sm">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-900">{websites.length}</div>
              <div className="text-red-700 text-sm">Total Websites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-900">{events.length}</div>
              <div className="text-red-700 text-sm">Recent Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-900">{botDetections.length}</div>
              <div className="text-red-700 text-sm">Bot Detections</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search users, websites, or domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200">
          <TabsTrigger value="users" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="websites" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <Globe className="w-4 h-4 mr-2" />
            Websites ({websites.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <Activity className="w-4 h-4 mr-2" />
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="bots" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <Bot className="w-4 h-4 mr-2" />
            Bot Detections ({botDetections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-white/80 border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{user.full_name || 'Unknown'}</CardTitle>
                    <Badge variant="outline">User</Badge>
                  </div>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">ID:</span> {user.id.slice(0, 8)}...
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="websites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWebsites.map((website) => (
              <Card key={website.id} className="bg-white/80 border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{website.name}</CardTitle>
                    <Badge className={website.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {website.is_active ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {website.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>{website.domain}</CardDescription>
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
                      <span className="font-medium">Created:</span> {new Date(website.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2 mt-3">
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
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => (
              <Card key={event.id} className="bg-white/80 border-slate-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                        <Activity className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <div className="font-medium">{event.event_type}</div>
                        <div className="text-sm text-slate-600">
                          Visitor: {event.visitor_id.slice(0, 8)}... | IP: {event.ip_address || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={event.is_bot ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {event.is_bot ? 'Bot' : 'Human'}
                      </Badge>
                      <div className="text-sm text-slate-600 mt-1">
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {botDetections.map((bot) => (
              <Card key={bot.id} className="bg-white/80 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-red-900">{bot.detection_reason}</div>
                        <div className="text-sm text-slate-600">
                          IP: {bot.ip_address || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={bot.is_blocked ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {bot.is_blocked ? 'Blocked' : 'Detected'}
                      </Badge>
                      <div className="text-sm text-slate-600 mt-1">
                        {new Date(bot.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
