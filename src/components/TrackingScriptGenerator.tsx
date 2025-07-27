
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, Code, Zap, Eye, Globe } from 'lucide-react';

interface TrackingScriptGeneratorProps {
  website: {
    id: string;
    name: string;
    domain: string;
    tracking_code: string;
  };
}

const TrackingScriptGenerator = ({ website }: TrackingScriptGeneratorProps) => {
  const [copied, setCopied] = useState(false);

  const generateTrackingScript = () => {
    return `<!-- TrackWiser Analytics - Start -->
<script>
(function() {
  // TrackWiser Configuration
  var tw = window.tw = window.tw || [];
  if (tw.initialized) return;
  
  tw.initialized = true;
  tw.config = {
    trackingCode: '${website.tracking_code}',
    apiUrl: 'https://ltluebewuhheisbbjcss.supabase.co/functions/v1/track-event',
    domain: '${website.domain}',
    enableRealtime: true,
    enableHeatmaps: true,
    enableBotDetection: true
  };
  
  // Generate unique visitor ID
  tw.visitorId = localStorage.getItem('tw_visitor_id') || 'visitor_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('tw_visitor_id', tw.visitorId);
  
  // Generate session ID
  tw.sessionId = sessionStorage.getItem('tw_session_id') || 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  sessionStorage.setItem('tw_session_id', tw.sessionId);
  
  // Track event function
  tw.track = function(eventType, data) {
    if (!tw.config.trackingCode) return;
    
    var payload = {
      tracking_code: tw.config.trackingCode,
      event_type: eventType || 'page_view',
      visitor_id: tw.visitorId,
      session_id: tw.sessionId,
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      data: data || {}
    };
    
    // Add timestamp
    payload.timestamp = new Date().toISOString();
    
    // Send to TrackWiser
    fetch(tw.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if (result.blocked) {
        console.log('TrackWiser: Bot detected and blocked');
      } else {
        console.log('TrackWiser: Event tracked successfully');
      }
    }).catch(function(error) {
      console.error('TrackWiser: Error tracking event:', error);
    });
  };
  
  // Auto-track page view
  tw.track('page_view', {
    title: document.title,
    url: window.location.href,
    referrer: document.referrer
  });
  
  // Track clicks
  if (tw.config.enableHeatmaps) {
    document.addEventListener('click', function(e) {
      tw.track('click', {
        element: e.target.tagName,
        text: e.target.textContent ? e.target.textContent.substring(0, 100) : '',
        x: e.clientX,
        y: e.clientY,
        url: window.location.href
      });
    });
  }
  
  // Track scroll depth
  var maxScroll = 0;
  window.addEventListener('scroll', function() {
    var scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      tw.track('scroll', {
        depth: scrollPercent,
        url: window.location.href
      });
    }
  });
  
  // Track time on page
  var startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    var timeOnPage = Math.round((Date.now() - startTime) / 1000);
    tw.track('time_on_page', {
      seconds: timeOnPage,
      url: window.location.href
    });
  });
  
  // Track form submissions
  document.addEventListener('submit', function(e) {
    tw.track('form_submit', {
      form_id: e.target.id || 'unknown',
      url: window.location.href
    });
  });
  
  console.log('TrackWiser Analytics loaded for ${website.domain}');
})();
</script>
<!-- TrackWiser Analytics - End -->`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateTrackingScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Code className="w-5 h-5 mr-2 text-sky-500" />
                Tracking Code for {website.name}
              </CardTitle>
              <CardDescription>
                Copy and paste this code into your website's &lt;head&gt; section
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">Domain:</span>
              <span className="font-medium text-slate-900">{website.domain}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Tracking ID:</span>
              <code className="bg-slate-200 px-2 py-1 rounded text-sm text-slate-800">
                {website.tracking_code}
              </code>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
              <code>{generateTrackingScript()}</code>
            </pre>
            <Button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white"
              size="sm"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Installation:</strong> Place this code before the closing &lt;/head&gt; tag on every page you want to track.
              The script will automatically start collecting visitor data and detecting bots.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-sky-50 rounded-lg">
              <Eye className="w-5 h-5 text-sky-500" />
              <div>
                <div className="font-medium text-slate-900">Auto-tracking</div>
                <div className="text-sm text-slate-600">Page views, clicks, scrolls</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-teal-50 rounded-lg">
              <Code className="w-5 h-5 text-teal-500" />
              <div>
                <div className="font-medium text-slate-900">Bot Detection</div>
                <div className="text-sm text-slate-600">Real-time filtering</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-lime-50 rounded-lg">
              <Zap className="w-5 h-5 text-lime-500" />
              <div>
                <div className="font-medium text-slate-900">Real-time</div>
                <div className="text-sm text-slate-600">Instant analytics</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingScriptGenerator;
