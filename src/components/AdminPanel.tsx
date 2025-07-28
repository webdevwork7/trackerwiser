
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Users, 
  Globe, 
  Activity, 
  Bot, 
  Eye,
  Settings,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminStats {
  totalUsers: number;
  totalWebsites: number;
  totalEvents: number;
  totalBots: number;
  activeUsers: number;
  recentActivity: any[];
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalWebsites: 0,
    totalEvents: 0,
    totalBots: 0,
    activeUsers: 0,
    recentActivity: []
  });
  const [users, setUsers] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch websites
      const { data: websitesData } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch events
      const { data: eventsData } = await supabase
        .from('analytics_events')
        .select('*, websites(name, domain)')
        .order('created_at', { ascending: false })
        .limit(100);
      
      // Fetch bots
      const { data: botsData } = await supabase
        .from('bot_detections')
        .select('*, websites(name, domain)')
        .order('created_at', { ascending: false })
        .limit(100);

      setUsers(usersData || []);
      setWebsites(websitesData || []);
      setEvents(eventsData || []);
      setBots(botsData || []);
      
      // Calculate stats
      const uniqueVisitors = new Set(eventsData?.map(e => e.visitor_id) || []).size;
      const recentEvents = eventsData?.slice(0, 10) || [];
      
      setStats({
        totalUsers: usersData?.length || 0,
        totalWebsites: websitesData?.length || 0,
        totalEvents: eventsData?.length || 0,
        totalBots: botsData?.length || 0,
        activeUsers: uniqueVisitors,
        recentActivity: recentEvents
      });
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWebsites = websites.filter(website => 
    website.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-sky-500" />
            Admin Dashboard
          </CardTitle>
          <CardDescription>
            Manage users, websites, and monitor system activity
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-sky-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Websites</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalWebsites}</p>
              </div>
              <Globe className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Events</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalEvents}</p>
              </div>
              <Activity className="w-8 h-8 text-lime-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Bots Detected</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalBots}</p>
              </div>
              <Bot className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bots">Bot Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{user.full_name || 'Unknown'}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                      <div className="text-sm text-slate-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="websites" className="space-y-4">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Website Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search websites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWebsites.map((website) => (
                  <div key={website.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-8 h-8 text-teal-500" />
                      <div>
                        <div className="font-medium text-slate-900">{website.name}</div>
                        <div className="text-sm text-slate-500">{website.domain}</div>
                        <div className="text-xs text-slate-400">Code: {website.tracking_code}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={website.is_active ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                        {website.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="text-sm text-slate-500">
                        {new Date(website.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 20).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-6 h-6 text-sky-500" />
                      <div>
                        <div className="font-medium text-slate-900">{event.event_type}</div>
                        <div className="text-sm text-slate-500">{event.page_url}</div>
                        <div className="text-xs text-slate-400">
                          {event.websites?.name} • {event.visitor_id}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(event.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle>Bot Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bots.slice(0, 20).map((bot) => (
                  <div key={bot.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-6 h-6 text-red-500" />
                      <div>
                        <div className="font-medium text-slate-900">{bot.detection_reason}</div>
                        <div className="text-sm text-slate-500">{bot.ip_address}</div>
                        <div className="text-xs text-slate-400">
                          {bot.websites?.name} • {bot.user_agent?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {bot.is_blocked ? 'Blocked' : 'Detected'}
                      </Badge>
                      <div className="text-sm text-slate-500">
                        {new Date(bot.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
