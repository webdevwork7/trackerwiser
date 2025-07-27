
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity,
  Users,
  Eye,
  RefreshCw,
  TrendingUp,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Website {
  id: string;
  name: string;
  domain: string;
  tracking_code: string;
  is_active: boolean;
}

interface TrackingStats {
  total_events: number;
  unique_visitors: number;
  page_views: number;
  bots_blocked: number;
  last_event: string | null;
}

const TrackingStatus = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [stats, setStats] = useState<Record<string, TrackingStats>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWebsitesAndStats();
    }
  }, [user]);

  const fetchWebsitesAndStats = async () => {
    try {
      // Fetch websites
      const { data: websitesData, error: websitesError } = await supabase
        .from('websites')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (websitesError) throw websitesError;
      setWebsites(websitesData || []);

      // Fetch stats for each website
      const statsPromises = (websitesData || []).map(async (website) => {
        const [eventsResponse, botsResponse] = await Promise.all([
          supabase
            .from('analytics_events')
            .select('*')
            .eq('website_id', website.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('bot_detections')
            .select('*')
            .eq('website_id', website.id)
        ]);

        const events = eventsResponse.data || [];
        const bots = botsResponse.data || [];

        // Calculate unique visitors
        const uniqueVisitors = new Set(events.map(e => e.visitor_id)).size;
        
        // Calculate page views
        const pageViews = events.filter(e => e.event_type === 'page_view').length;

        return {
          websiteId: website.id,
          stats: {
            total_events: events.length,
            unique_visitors: uniqueVisitors,
            page_views: pageViews,
            bots_blocked: bots.length,
            last_event: events.length > 0 ? events[0].created_at : null
          }
        };
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap = statsResults.reduce((acc, { websiteId, stats }) => {
        acc[websiteId] = stats;
        return acc;
      }, {} as Record<string, TrackingStats>);

      setStats(statsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchWebsitesAndStats();
  };

  const getStatusColor = (stats: TrackingStats) => {
    if (stats.total_events === 0) return 'red';
    if (stats.last_event && new Date(stats.last_event) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return 'green';
    }
    return 'yellow';
  };

  const getStatusText = (stats: TrackingStats) => {
    if (stats.total_events === 0) return 'No data';
    if (stats.last_event && new Date(stats.last_event) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return 'Active';
    }
    return 'Inactive';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Inactive':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
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
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-sky-500" />
                Tracking Status
              </CardTitle>
              <CardDescription>
                Monitor your website tracking and analytics
              </CardDescription>
            </div>
            <Button
              onClick={refresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {websites.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No active websites found. Add a website in the Website Management section to start tracking.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => {
            const websiteStats = stats[website.id] || {
              total_events: 0,
              unique_visitors: 0,
              page_views: 0,
              bots_blocked: 0,
              last_event: null
            };
            
            const status = getStatusText(websiteStats);
            const statusColor = getStatusColor(websiteStats);

            return (
              <Card key={website.id} className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-900 text-lg">{website.name}</CardTitle>
                    <Badge 
                      className={`${
                        statusColor === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                        statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      {getStatusIcon(status)}
                      {status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    {website.domain}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-sky-600">{websiteStats.page_views}</div>
                        <div className="text-sm text-slate-600">Page Views</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-teal-600">{websiteStats.unique_visitors}</div>
                        <div className="text-sm text-slate-600">Visitors</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-lime-600">{websiteStats.total_events}</div>
                        <div className="text-sm text-slate-600">Total Events</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{websiteStats.bots_blocked}</div>
                        <div className="text-sm text-slate-600">Bots Blocked</div>
                      </div>
                    </div>

                    {websiteStats.last_event && (
                      <div className="text-xs text-slate-500 text-center">
                        Last activity: {new Date(websiteStats.last_event).toLocaleString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackingStatus;
