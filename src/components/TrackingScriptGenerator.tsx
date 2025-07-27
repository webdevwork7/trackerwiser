
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle, Code, Zap, Eye, Globe, AlertTriangle } from 'lucide-react';

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
    return `<!-- TrackWiser Analytics - START -->
<script>
(function() {
  // TrackWiser Analytics - Self-contained tracking script
  var tw = window.tw = window.tw || [];
  if (tw.initialized) return;
  
  tw.initialized = true;
  tw.config = {
    trackingCode: '${website.tracking_code}',
    apiUrl: 'https://ltluebewuhheisbbjcss.supabase.co/functions/v1/track-event',
    domain: '${website.domain}',
    debug: false
  };
  
  // Generate unique visitor ID (persists across sessions)
  tw.visitorId = localStorage.getItem('tw_visitor_id') || 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  localStorage.setItem('tw_visitor_id', tw.visitorId);
  
  // Generate session ID (new for each session)
  tw.sessionId = sessionStorage.getItem('tw_session_id') || 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  sessionStorage.setItem('tw_session_id', tw.sessionId);
  
  // Main tracking function
  tw.track = function(eventType, data) {
    if (!tw.config.trackingCode) return;
    
    var payload = {
      tracking_code: tw.config.trackingCode,
      event_type: eventType || 'page_view',
      visitor_id: tw.visitorId,
      session_id: tw.sessionId,
      page_url: window.location.href,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      data: data || {}
    };
    
    // Add screen resolution
    if (screen.width && screen.height) {
      payload.data.screen_resolution = screen.width + 'x' + screen.height;
    }
    
    // Add viewport size
    if (window.innerWidth && window.innerHeight) {
      payload.data.viewport_size = window.innerWidth + 'x' + window.innerHeight;
    }
    
    // Add language
    payload.data.language = navigator.language || 'unknown';
    
    // Send to TrackWiser API
    fetch(tw.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if (tw.config.debug) {
        if (result.blocked) {
          console.log('TrackWiser: Bot detected and blocked', result);
        } else {
          console.log('TrackWiser: Event tracked successfully', result);
        }
      }
    }).catch(function(error) {
      if (tw.config.debug) {
        console.error('TrackWiser: Error tracking event:', error);
      }
    });
  };
  
  // Auto-track page view on load
  tw.track('page_view', {
    title: document.title,
    url: window.location.href,
    referrer: document.referrer,
    loaded_at: new Date().toISOString()
  });
  
  // Track clicks on important elements
  document.addEventListener('click', function(e) {
    var element = e.target;
    var elementType = element.tagName.toLowerCase();
    
    // Track button clicks
    if (elementType === 'button' || element.type === 'submit') {
      tw.track('button_click', {
        button_text: element.textContent ? element.textContent.substring(0, 50) : '',
        button_id: element.id || 'no-id',
        button_class: element.className || 'no-class',
        url: window.location.href
      });
    }
    
    // Track link clicks
    if (elementType === 'a' && element.href) {
      tw.track('link_click', {
        link_url: element.href,
        link_text: element.textContent ? element.textContent.substring(0, 50) : '',
        is_external: element.hostname !== window.location.hostname,
        url: window.location.href
      });
    }
    
    // Track form submissions
    if (elementType === 'form' || element.type === 'submit') {
      tw.track('form_interaction', {
        form_id: element.id || 'no-id',
        form_action: element.action || 'no-action',
        url: window.location.href
      });
    }
  });
  
  // Track scroll depth
  var maxScroll = 0;
  var scrollTimer = null;
  
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      var scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      
      if (scrollPercent > maxScroll && scrollPercent >= 25 && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        tw.track('scroll_depth', {
          depth_percent: scrollPercent,
          url: window.location.href
        });
      }
    }, 100);
  });
  
  // Track time on page before leaving
  var startTime = Date.now();
  var heartbeatInterval = setInterval(function() {
    var timeOnPage = Math.round((Date.now() - startTime) / 1000);
    
    // Send heartbeat every 30 seconds
    if (timeOnPage > 0 && timeOnPage % 30 === 0) {
      tw.track('heartbeat', {
        time_on_page: timeOnPage,
        url: window.location.href
      });
    }
  }, 30000);
  
  // Track page exit
  window.addEventListener('beforeunload', function() {
    clearInterval(heartbeatInterval);
    var timeOnPage = Math.round((Date.now() - startTime) / 1000);
    
    // Use sendBeacon for reliable exit tracking
    if (navigator.sendBeacon) {
      navigator.sendBeacon(tw.config.apiUrl, JSON.stringify({
        tracking_code: tw.config.trackingCode,
        event_type: 'page_exit',
        visitor_id: tw.visitorId,
        session_id: tw.sessionId,
        page_url: window.location.href,
        referrer: document.referrer || '',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        data: {
          time_on_page: timeOnPage,
          exit_type: 'beforeunload'
        }
      }));
    }
  });
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', function() {
    tw.track('visibility_change', {
      visibility_state: document.visibilityState,
      url: window.location.href
    });
  });
  
  if (tw.config.debug) {
    console.log('TrackWiser Analytics loaded successfully for: ' + tw.config.domain);
    console.log('Tracking Code: ' + tw.config.trackingCode);
    console.log('Visitor ID: ' + tw.visitorId);
    console.log('Session ID: ' + tw.sessionId);
  }
})();
</script>
<!-- TrackWiser Analytics - END -->`;
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
                Copy and paste this complete tracking script into your website's &lt;head&gt; section
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Ready to Use
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Website Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">Domain:</span>
              <span className="font-medium text-slate-900">{website.domain}</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">Tracking ID:</span>
              <code className="bg-slate-200 px-2 py-1 rounded text-sm text-slate-800 font-mono">
                {website.tracking_code}
              </code>
            </div>
          </div>

          {/* Installation Instructions */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <strong>Installation Steps:</strong>
              <ol className="mt-2 ml-4 list-decimal space-y-1">
                <li>Copy the tracking code below</li>
                <li>Open your website's HTML file</li>
                <li>Paste the code inside the <code>&lt;head&gt;</code> section</li>
                <li>Save and upload your website</li>
                <li>Visit your website to start tracking</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Tracking Script */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Complete Tracking Script</span>
              <Button
                onClick={copyToClipboard}
                className="bg-slate-800 hover:bg-slate-700 text-white"
                size="sm"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                {copied ? 'Copied!' : 'Copy Script'}
              </Button>
            </div>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 border">
              <code>{generateTrackingScript()}</code>
            </pre>
          </div>

          {/* Example Implementation */}
          <Alert>
            <Code className="h-4 w-4" />
            <AlertDescription>
              <strong>Example HTML Structure:</strong>
              <pre className="mt-2 bg-slate-100 p-3 rounded text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
  ${generateTrackingScript()}
</head>
<body>
  <!-- Your website content -->
</body>
</html>`}
              </pre>
            </AlertDescription>
          </Alert>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-sky-50 rounded-lg">
              <Eye className="w-5 h-5 text-sky-500" />
              <div>
                <div className="font-medium text-slate-900">Page Views</div>
                <div className="text-sm text-slate-600">Automatic tracking</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-teal-50 rounded-lg">
              <Zap className="w-5 h-5 text-teal-500" />
              <div>
                <div className="font-medium text-slate-900">User Actions</div>
                <div className="text-sm text-slate-600">Clicks, scrolls, forms</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-lime-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-lime-500" />
              <div>
                <div className="font-medium text-slate-900">Bot Detection</div>
                <div className="text-sm text-slate-600">Smart filtering</div>
              </div>
            </div>
          </div>

          {/* Testing */}
          <Alert className="border-blue-200 bg-blue-50">
            <Eye className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <strong>Testing:</strong> After installing the script, visit your website and then check your dashboard here. 
              You should see visitor data appearing within a few seconds.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingScriptGenerator;
