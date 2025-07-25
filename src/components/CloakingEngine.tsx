
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, 
  EyeOff, 
  Globe, 
  Shield, 
  Zap,
  Settings,
  Plus,
  Edit,
  Trash2,
  Activity,
  AlertTriangle
} from 'lucide-react';

const CloakingEngine = () => {
  const [cloakingEnabled, setCloakingEnabled] = useState(true);
  const [showPreview, setShowPreview] = useState('safe');

  // Mock cloaking rules
  const cloakingRules = [
    {
      id: 1,
      name: 'Search Engine Bots',
      trigger: 'User Agent',
      condition: 'Contains "Googlebot", "Bingbot"',
      action: 'Show Safe Page',
      status: 'Active',
      hits: 1247
    },
    {
      id: 2,
      name: 'Suspicious IPs',
      trigger: 'IP Reputation',
      condition: 'Threat Score > 70',
      action: 'Show Safe Page',
      status: 'Active',
      hits: 892
    },
    {
      id: 3,
      name: 'VPN/Proxy Users',
      trigger: 'Connection Type',
      condition: 'VPN or Proxy detected',
      action: 'Show Warning Page',
      status: 'Active',
      hits: 543
    },
    {
      id: 4,
      name: 'Datacenter IPs',
      trigger: 'IP Classification',
      condition: 'Datacenter/Hosting',
      action: 'Show Safe Page',
      status: 'Paused',
      hits: 234
    },
  ];

  const cloakingStats = [
    { label: 'Total Cloaks Today', value: '2,916', change: '+15%' },
    { label: 'Safe Page Views', value: '2,373', change: '+12%' },
    { label: 'Money Page Views', value: '8,847', change: '+8%' },
    { label: 'Conversion Rate (Money)', value: '4.2%', change: '+0.3%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-sky-500" />
                Cloaking Engine
              </CardTitle>
              <CardDescription>Smart page switching for bots vs. humans</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Cloaking</span>
                <Switch 
                  checked={cloakingEnabled} 
                  onCheckedChange={setCloakingEnabled}
                />
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cloakingStats.map((stat) => (
          <Card key={stat.label} className="bg-white/80 border-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
              <Activity className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-lime-600 mt-1">{stat.change} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Cloaking Tabs */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200">
          <TabsTrigger value="rules">Cloaking Rules</TabsTrigger>
          <TabsTrigger value="pages">Page Configuration</TabsTrigger>
          <TabsTrigger value="logs">Cloaking Logs</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Cloaking Rules</CardTitle>
                  <CardDescription>Define when to show safe vs. money pages</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cloakingRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{rule.name}</div>
                        <div className="text-sm text-slate-500">
                          {rule.trigger}: {rule.condition} → {rule.action}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge 
                          className={rule.status === 'Active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }
                        >
                          {rule.status}
                        </Badge>
                        <div className="text-xs text-slate-500 mt-1">{rule.hits} hits today</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Safe Page Configuration
                </CardTitle>
                <CardDescription>Page shown to bots and suspicious traffic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="safe-url">Safe Page URL</Label>
                  <Input id="safe-url" placeholder="https://example.com/safe" defaultValue="/safe-page" />
                </div>
                <div>
                  <Label htmlFor="safe-title">Page Title</Label>
                  <Input id="safe-title" placeholder="Page Title" defaultValue="Welcome to Our Website" />
                </div>
                <div>
                  <Label htmlFor="safe-content">Page Content</Label>
                  <Textarea 
                    id="safe-content" 
                    placeholder="Enter safe page content..."
                    defaultValue="Welcome to our website. We provide quality services and products."
                    rows={6}
                  />
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Update Safe Page
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Money Page Configuration
                </CardTitle>
                <CardDescription>Page shown to real human visitors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="money-url">Money Page URL</Label>
                  <Input id="money-url" placeholder="https://example.com/offer" defaultValue="/landing-page" />
                </div>
                <div>
                  <Label htmlFor="money-title">Page Title</Label>
                  <Input id="money-title" placeholder="Page Title" defaultValue="Special Offer - Limited Time!" />
                </div>
                <div>
                  <Label htmlFor="money-content">Page Content</Label>
                  <Textarea 
                    id="money-content" 
                    placeholder="Enter money page content..."
                    defaultValue="🔥 Limited Time Offer! Get 50% off our premium service. Act now before it's too late!"
                    rows={6}
                  />
                </div>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  Update Money Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Cloaking Logs</CardTitle>
              <CardDescription>Real-time log of all cloaking decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    time: '2 min ago',
                    ip: '192.168.1.100',
                    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
                    decision: 'Safe Page',
                    rule: 'Search Engine Bots',
                    country: '🇺🇸'
                  },
                  {
                    time: '3 min ago',
                    ip: '10.0.0.45',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    decision: 'Money Page',
                    rule: 'Human Visitor',
                    country: '🇨🇦'
                  },
                  {
                    time: '5 min ago',
                    ip: '185.220.101.5',
                    userAgent: 'curl/7.68.0',
                    decision: 'Safe Page',
                    rule: 'Suspicious User Agent',
                    country: '🇩🇪'
                  },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        log.decision === 'Money Page' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {log.country} {log.ip} → {log.decision}
                        </div>
                        <div className="text-sm text-slate-500 truncate max-w-md">
                          {log.userAgent}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-sky-100 text-sky-800 border-sky-200">
                        {log.rule}
                      </Badge>
                      <div className="text-xs text-slate-500 mt-1">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Page Preview</CardTitle>
                  <CardDescription>Preview how different visitors see your pages</CardDescription>
                </div>
                <Select value={showPreview} onValueChange={setShowPreview}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select page type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safe">Safe Page (Bots)</SelectItem>
                    <SelectItem value="money">Money Page (Humans)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 p-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 text-slate-600 text-sm">
                    {showPreview === 'safe' ? 'example.com/safe-page' : 'example.com/landing-page'}
                  </div>
                </div>
                <div className="p-8 bg-white min-h-96">
                  {showPreview === 'safe' ? (
                    <div className="text-center">
                      <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to Our Website</h1>
                      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We provide quality services and products to help your business grow. 
                        Our team is dedicated to delivering excellence in everything we do.
                      </p>
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Quality Service</h3>
                          <p className="text-sm text-slate-600">Professional services you can trust</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Expert Team</h3>
                          <p className="text-sm text-slate-600">Experienced professionals</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold mb-2">Support</h3>
                          <p className="text-sm text-slate-600">24/7 customer support</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        🔥 Limited Time Offer!
                      </h1>
                      <p className="text-xl text-slate-600 mb-6">
                        Get 50% off our premium service. Act now before it's too late!
                      </p>
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg mb-6">
                        <div className="text-3xl font-bold mb-2">$49.99 $24.99</div>
                        <div className="text-lg">Save $25 Today Only!</div>
                      </div>
                      <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg">
                        Claim Your Discount Now!
                      </Button>
                      <p className="text-sm text-slate-500 mt-4">⏰ Offer expires in 23:45:12</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CloakingEngine;
