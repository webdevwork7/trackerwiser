
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Code, 
  Copy, 
  CheckCircle, 
  XCircle,
  Smartphone,
  Monitor,
  Globe,
  Zap,
  Download,
  Eye,
  Settings
} from 'lucide-react';

const TrackingSetup = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  
  const trackingCode = `<!-- TrackWiser Tracking Code -->
<script>
(function() {
  var tw = window.tw = window.tw || [];
  if (tw.initialized) return;
  
  tw.initialized = true;
  tw.siteId = 'TW_SITE_123456';
  tw.apiUrl = 'https://api.trackwiser.dev';
  
  // Core tracking functions
  tw.track = function(event, properties) {
    tw.push(['track', event, properties || {}]);
  };
  
  tw.identify = function(userId, traits) {
    tw.push(['identify', userId, traits || {}]);
  };
  
  tw.page = function(name, properties) {
    tw.push(['page', name || document.title, properties || {}]);
  };
  
  // Auto-track page views
  tw.page();
  
  // Load the tracking script
  var script = document.createElement('script');
  script.src = tw.apiUrl + '/tw.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>
<!-- End TrackWiser Tracking Code -->`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateSetup = () => {
    setValidationStatus('checking');
    // Simulate validation
    setTimeout(() => {
      setValidationStatus(Math.random() > 0.5 ? 'success' : 'error');
    }, 2000);
  };

  const installationSteps = [
    {
      step: 1,
      title: 'Copy the tracking code',
      description: 'Copy the JavaScript tracking code provided below',
      icon: Copy
    },
    {
      step: 2,
      title: 'Add to your website',
      description: 'Paste the code before the closing </head> tag on every page',
      icon: Code
    },
    {
      step: 3,
      title: 'Verify installation',
      description: 'Use our validator to confirm the setup is working correctly',
      icon: CheckCircle
    }
  ];

  const integrationExamples = [
    {
      platform: 'WordPress',
      description: 'Add to theme header.php or use a plugin',
      code: '// Add to functions.php\nfunction add_trackwiser_code() {\n  // Paste tracking code here\n}\nadd_action(\'wp_head\', \'add_trackwiser_code\');'
    },
    {
      platform: 'React/Next.js',
      description: 'Add to _document.js or use React Helmet',
      code: 'import { Helmet } from "react-helmet";\n\n<Helmet>\n  <script>\n    {/* Tracking code here */}\n  </script>\n</Helmet>'
    },
    {
      platform: 'Shopify',
      description: 'Add to theme.liquid in the <head> section',
      code: '<!-- In theme.liquid -->\n<!-- Paste tracking code before </head> -->'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Code className="w-6 h-6 mr-2 text-sky-500" />
            Tracking Setup
          </CardTitle>
          <CardDescription>
            Get your TrackWiser tracking code and validate your installation
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200">
          <TabsTrigger value="setup">Quick Setup</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          <TabsTrigger value="mobile">Mobile SDKs</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          {/* Installation Steps */}
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Installation Steps</CardTitle>
              <CardDescription>Follow these simple steps to get TrackWiser running on your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {installationSteps.map(({ step, title, description, icon: Icon }) => (
                  <div key={step} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                      {step}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-600 text-sm">{description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Code */}
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900">Your Tracking Code</CardTitle>
                  <CardDescription>Copy and paste this code into your website's &lt;head&gt; section</CardDescription>
                </div>
                <Button 
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                >
                  {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm">
                  <code>{trackingCode}</code>
                </pre>
              </div>
              
              <Alert className="mt-4">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Place this code before the closing &lt;/head&gt; tag on every page you want to track.
                  The code will automatically start collecting visitor data and detecting bots.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Platform Examples */}
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Platform-Specific Examples</CardTitle>
              <CardDescription>Implementation examples for popular platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrationExamples.map((example) => (
                  <div key={example.platform} className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">{example.platform}</h4>
                    <p className="text-slate-600 text-sm mb-3">{example.description}</p>
                    <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto">
                      <code className="text-slate-800">{example.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Advanced Configuration</CardTitle>
              <CardDescription>Customize your tracking setup with advanced options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="custom-domain">Custom Domain</Label>
                  <Input id="custom-domain" placeholder="analytics.yourdomain.com" />
                  <p className="text-xs text-slate-500 mt-1">Use your own domain for tracking requests</p>
                </div>
                
                <div>
                  <Label htmlFor="sampling-rate">Sampling Rate (%)</Label>
                  <Input id="sampling-rate" type="number" placeholder="100" defaultValue="100" />
                  <p className="text-xs text-slate-500 mt-1">Percentage of visitors to track</p>
                </div>

                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" placeholder="30" defaultValue="30" />
                  <p className="text-xs text-slate-500 mt-1">Time before a session expires</p>
                </div>

                <div>
                  <Label htmlFor="bot-threshold">Bot Detection Sensitivity</Label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md">
                    <option>Low (Allow more traffic)</option>
                    <option>Medium (Recommended)</option>
                    <option>High (Block aggressively)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">How strict to be with bot detection</p>
                </div>
              </div>

              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Advanced settings will be applied to your tracking code. Make sure to test thoroughly before deploying to production.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-sky-500" />
                  iOS SDK
                </CardTitle>
                <CardDescription>Track iOS app events and user behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Installation</h4>
                  <pre className="bg-slate-100 p-3 rounded text-sm">
                    <code>pod 'TrackWiser', '~> 1.0.0'</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Implementation</h4>
                  <pre className="bg-slate-100 p-3 rounded text-sm">
                    <code>{`import TrackWiser

TrackWiser.configure("YOUR_API_KEY")
TrackWiser.track("app_opened")`}</code>
                  </pre>
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download iOS SDK
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border-sky-100">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-teal-500" />
                  Android SDK
                </CardTitle>
                <CardDescription>Track Android app events and user behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Installation</h4>
                  <pre className="bg-slate-100 p-3 rounded text-sm">
                    <code>implementation 'com.trackwiser:android:1.0.0'</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Implementation</h4>
                  <pre className="bg-slate-100 p-3 rounded text-sm">
                    <code>{`TrackWiser.configure(this, "YOUR_API_KEY");
TrackWiser.track("app_opened");`}</code>
                  </pre>
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Android SDK
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card className="bg-white/80 border-sky-100">
            <CardHeader>
              <CardTitle className="text-slate-900">Setup Validation</CardTitle>
              <CardDescription>
                Verify that TrackWiser is properly installed and working on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="validate-url">Website URL</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="validate-url"
                    placeholder="https://yourwebsite.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                  <Button 
                    onClick={validateSetup}
                    disabled={!websiteUrl || validationStatus === 'checking'}
                    className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                  >
                    {validationStatus === 'checking' ? 'Checking...' : 'Validate'}
                  </Button>
                </div>
              </div>

              {validationStatus !== 'idle' && (
                <Alert className={`${
                  validationStatus === 'success' 
                    ? 'border-green-200 bg-green-50' 
                    : validationStatus === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-blue-200 bg-blue-50'
                }`}>
                  {validationStatus === 'checking' && <Zap className="h-4 w-4 text-blue-500" />}
                  {validationStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {validationStatus === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                  <AlertDescription>
                    {validationStatus === 'checking' && 'Checking your website for TrackWiser installation...'}
                    {validationStatus === 'success' && 'Great! TrackWiser is properly installed and tracking visitors.'}
                    {validationStatus === 'error' && 'TrackWiser code not detected. Please check your installation and try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Globe className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-900 mb-1">Page Views</h4>
                  <p className="text-2xl font-bold text-sky-600">1,234</p>
                  <p className="text-xs text-slate-500">Last 24 hours</p>
                </div>
                
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Eye className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-slate-900 mb-1">Unique Visitors</h4>
                  <p className="text-2xl font-bold text-teal-600">892</p>
                  <p className="text-xs text-slate-500">Last 24 hours</p>
                </div>
                
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Badge className="w-8 h-8 bg-lime-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    ✓
                  </Badge>
                  <h4 className="font-semibold text-slate-900 mb-1">Status</h4>
                  <Badge className="bg-lime-100 text-lime-800 border-lime-200">Active</Badge>
                  <p className="text-xs text-slate-500 mt-1">Tracking normally</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackingSetup;
