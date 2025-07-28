import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  CheckCircle, 
  Code, 
  Globe, 
  Settings,
  Eye,
  Zap,
  Shield,
  AlertCircle,
  Download
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TrackingScriptGeneratorProps {
  websiteId: string;
  trackingCode: string;
  domain: string;
  websiteName: string;
}

const TrackingScriptGenerator: React.FC<TrackingScriptGeneratorProps> = ({
  websiteId,
  trackingCode,
  domain,
  websiteName
}) => {
  const [copied, setCopied] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const { toast } = useToast();

  const generateTrackingScript = () => {
    return `<!-- TrackWiser Analytics Script -->
<script>
(function() {
  // TrackWiser configuration
  var trackingCode = '${trackingCode}';
  var apiUrl = 'https://ltluebewuhheisbbjcss.supabase.co/functions/v1/track-event';
  
  // Generate or get visitor ID
  function getVisitorId() {
    var visitorId = localStorage.getItem('tw_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('tw_visitor_id', visitorId);
    }
    return visitorId;
  }
  
  // Generate session ID
  function getSessionId() {
    var sessionId = sessionStorage.getItem('tw_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('tw_session_id', sessionId);
    }
    return sessionId;
  }
  
  // Send tracking event
  function sendEvent(eventType, eventData) {
    var data = {
      tracking_code: trackingCode,
      event_type: eventType || 'page_view',
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      page_url: window.location.href,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      data: eventData || {}
    };
    
    console.log('TrackWiser: Sending event', eventType, data);
    
    // Use fetch to send data
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if (result.success) {
        console.log('TrackWiser: Event sent successfully', result);
      } else {
        console.error('TrackWiser: Failed to send event', result);
      }
    }).catch(function(error) {
      console.error('TrackWiser: Error sending event:', error);
    });
  }
  
  // Track page view on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      sendEvent('page_view');
    });
  } else {
    sendEvent('page_view');
  }
  
  // Track clicks on important elements
  document.addEventListener('click', function(e) {
    var target = e.target;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('trackable')) {
      sendEvent('click', {
        element: target.tagName,
        text: target.textContent || target.innerText || '',
        href: target.href || '',
        class: target.className || ''
      });
    }
  });
  
  // Track form submissions
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (form.tagName === 'FORM') {
      sendEvent('form_submit', {
        form_id: form.id || '',
        form_name: form.name || '',
        action: form.action || ''
      });
    }
  });
  
  // Track scroll depth
  var maxScroll = 0;
  window.addEventListener('scroll', function() {
    var scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      sendEvent('scroll', { depth: scrollPercent });
    }
  });
  
  // Track time on page
  var startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    var timeSpent = Math.round((Date.now() - startTime) / 1000);
    sendEvent('time_on_page', { seconds: timeSpent });
  });
  
  // Expose tracking function globally
  window.trackWiser = {
    track: sendEvent,
    getVisitorId: getVisitorId,
    getSessionId: getSessionId
  };
  
  console.log('TrackWiser Analytics initialized for ${websiteName}');
})();
</script>`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Tracking script copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const trackingScript = generateTrackingScript();

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Code className="w-6 h-6 mr-2 text-sky-500" />
            Tracking Script for {websiteName}
          </CardTitle>
          <CardDescription>
            Copy and paste this script into your website's HTML head section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-sky-100 text-sky-800 border-sky-200">
                Tracking Code: {trackingCode}
              </Badge>
              <Badge className="bg-lime-100 text-lime-800 border-lime-200">
                <Zap className="w-3 h-3 mr-1" />
                Live Tracking
              </Badge>
            </div>
            
            <Tabs defaultValue="script" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="script">Script</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
              </TabsList>
              
              <TabsContent value="script" className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={trackingScript}
                    readOnly
                    className="min-h-[400px] font-mono text-sm bg-slate-50 border-slate-200"
                  />
                  <Button
                    onClick={() => copyToClipboard(trackingScript)}
                    className="absolute top-2 right-2 bg-sky-500 hover:bg-sky-600 text-white"
                    size="sm"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This script automatically tracks page views, clicks, form submissions, scroll depth, and time on page.
                    It also includes bot detection and real-time analytics.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              
              <TabsContent value="instructions" className="space-y-4">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-sky-50 to-teal-50 p-6 rounded-lg border border-sky-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-sky-500" />
                      Quick Setup Guide
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Copy the Script</h4>
                          <p className="text-slate-600">Click the copy button above to copy the complete tracking script.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Paste in HTML Head</h4>
                          <p className="text-slate-600">Add the script to your website's HTML head section, right before the closing &lt;/head&gt; tag.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-lime-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Test & Monitor</h4>
                          <p className="text-slate-600">Visit your website to test the tracking. Check the browser console for "TrackWiser Analytics initialized" message.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">Example HTML Implementation:</h4>
                    <pre className="text-sm text-slate-600 bg-white p-3 rounded border overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- TrackWiser Analytics Script -->
    <script>
    (function() {
        // Your tracking script goes here
    })();
    </script>
</head>
<body>
    <!-- Your website content -->
</body>
</html>`}
                    </pre>
                  </div>
                  
                  <Alert>
                    <Eye className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pro Tip:</strong> The script automatically starts tracking as soon as it's loaded. 
                      You can manually track custom events using <code>window.trackWiser.track('event_name', data)</code>
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
              
              <TabsContent value="test" className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Testing Your Implementation
                    </h4>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                      <li>• Open your website in a new browser tab</li>
                      <li>• Open browser Developer Tools (F12)</li>
                      <li>• Check the Console tab for "TrackWiser Analytics initialized" message</li>
                      <li>• Navigate through your site to generate events</li>
                      <li>• Return to this dashboard to view real-time analytics</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">✅ What Gets Tracked</h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Page views and navigation</li>
                        <li>• Button and link clicks</li>
                        <li>• Form submissions</li>
                        <li>• Scroll depth (25%, 50%, 75%, 100%)</li>
                        <li>• Time spent on page</li>
                        <li>• User device and browser info</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">🔧 Custom Tracking</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Add class="trackable" to any element</li>
                        <li>• Use window.trackWiser.track() for custom events</li>
                        <li>• Check localStorage for tw_visitor_id</li>
                        <li>• Monitor sessionStorage for tw_session_id</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingScriptGenerator;
