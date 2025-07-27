
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Globe, 
  Shield, 
  Code, 
  Users, 
  Settings,
  Activity,
  Eye,
  MousePointer,
  TrendingUp,
  Clock,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DynamicLiveAnalytics from './DynamicLiveAnalytics';
import WebsiteManager from './WebsiteManager';
import TrackingSetup from './TrackingSetup';
import TrackingStatus from './TrackingStatus';

const DynamicDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">TrackWiser</h1>
                <p className="text-sm text-slate-600">Analytics Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm text-slate-600">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 border border-slate-200 p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Live Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="websites" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Websites</span>
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Setup</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Status</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-sky-500 to-teal-500 border-0 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Welcome back!</CardTitle>
                <CardDescription className="text-sky-100">
                  Here's your real-time analytics overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">5</div>
                    <div className="text-sky-100 text-sm">Active Websites</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">1,234</div>
                    <div className="text-sky-100 text-sm">Real Users Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">456</div>
                    <div className="text-sky-100 text-sm">Bots Blocked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">99.9%</div>
                    <div className="text-sky-100 text-sm">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveTab('websites')}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">Add Website</CardTitle>
                  <CardDescription>Start tracking a new website</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveTab('analytics')}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">Live Analytics</CardTitle>
                  <CardDescription>View real-time data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveTab('setup')}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">Setup Guide</CardTitle>
                  <CardDescription>Installation instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    View Setup
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveTab('status')}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">Tracking Status</CardTitle>
                  <CardDescription>Monitor your tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Check Status
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-sky-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest events from your websites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '2 minutes ago', event: 'New visitor from New York', website: 'example.com' },
                    { time: '5 minutes ago', event: 'Bot detected and blocked', website: 'mysite.com' },
                    { time: '8 minutes ago', event: 'Form submission tracked', website: 'example.com' },
                    { time: '12 minutes ago', event: 'New visitor from London', website: 'mysite.com' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{activity.event}</div>
                        <div className="text-sm text-slate-600">{activity.website} • {activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <DynamicLiveAnalytics />
          </TabsContent>

          <TabsContent value="websites">
            <WebsiteManager />
          </TabsContent>

          <TabsContent value="setup">
            <TrackingSetup />
          </TabsContent>

          <TabsContent value="status">
            <TrackingStatus />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DynamicDashboard;
