
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import WebsiteManager from './WebsiteManager';
import DynamicLiveAnalytics from './DynamicLiveAnalytics';
import BotDetection from './BotDetection';
import CloakingEngine from './CloakingEngine';
import TrackingSetup from './TrackingSetup';
import { 
  BarChart3, 
  Shield, 
  Globe, 
  Code, 
  Settings, 
  LogOut, 
  User,
  Eye,
  Zap
} from 'lucide-react';

const DynamicDashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
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
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-slate-700">{user?.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 border border-sky-100 p-1">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="websites" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Websites</span>
            </TabsTrigger>
            <TabsTrigger value="bot-detection" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Bot Detection</span>
            </TabsTrigger>
            <TabsTrigger value="cloaking" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Cloaking</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Tracking Setup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <DynamicLiveAnalytics />
          </TabsContent>

          <TabsContent value="websites" className="space-y-6">
            <WebsiteManager />
          </TabsContent>

          <TabsContent value="bot-detection" className="space-y-6">
            <BotDetection />
          </TabsContent>

          <TabsContent value="cloaking" className="space-y-6">
            <CloakingEngine />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <TrackingSetup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DynamicDashboard;
