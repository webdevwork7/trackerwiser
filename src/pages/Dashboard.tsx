
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Shield, 
  Eye, 
  Users, 
  Bot, 
  Globe, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  Filter,
  Download,
  Settings,
  Plus
} from 'lucide-react';
import DynamicLiveAnalytics from '@/components/DynamicLiveAnalytics';
import BotDetection from '@/components/BotDetection';
import CloakingEngine from '@/components/CloakingEngine';
import TrackingSetup from '@/components/TrackingSetup';
import AdminPanel from '@/components/AdminPanel';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [liveVisitors, setLiveVisitors] = useState(247);
  const [botsBlocked, setBotsBlocked] = useState(1432);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user.id)
            .single();
          setIsAdmin(!!data);
        } catch (error) {
          setIsAdmin(false);
        }
      }
    };
    checkAdminStatus();
  }, [user]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => prev + Math.floor(Math.random() * 5) - 2);
      setBotsBlocked(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  TrackWiser Dashboard
                  {isAdmin && <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">Admin</Badge>}
                </h1>
                <p className="text-sm text-slate-600">Real-time analytics and bot protection</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-lime-100 text-lime-800 border-lime-200">
                <div className="w-2 h-2 bg-lime-500 rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
              <Button size="sm" className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Site
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Live Visitors</CardTitle>
              <Users className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{liveVisitors.toLocaleString()}</div>
              <div className="flex items-center text-sm text-lime-600 mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% from yesterday
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Bots Blocked</CardTitle>
              <Bot className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{botsBlocked.toLocaleString()}</div>
              <div className="text-sm text-slate-500 mt-2">Today</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">4.2%</div>
              <div className="text-sm text-sky-600 mt-2">Real humans only</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Threat Level</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">Medium</div>
              <Progress value={45} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="bg-white/80 border border-slate-200">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="bot-detection" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <Bot className="w-4 h-4 mr-2" />
              Bot Detection
            </TabsTrigger>
            <TabsTrigger value="cloaking" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
              <Eye className="w-4 h-4 mr-2" />
              Cloaking
            </TabsTrigger>
            <TabsTrigger value="setup" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Setup
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <DynamicLiveAnalytics />
          </TabsContent>

          <TabsContent value="bot-detection" className="space-y-6">
            <BotDetection />
          </TabsContent>

          <TabsContent value="cloaking" className="space-y-6">
            <CloakingEngine />
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <TrackingSetup />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
