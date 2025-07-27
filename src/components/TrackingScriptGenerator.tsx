
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
    return `<script>
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
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateTrackingScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Step by Step Instructions */}
      <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-sky-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center text-xl">
            <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
            📋 Step-by-Step Installation Guide
          </CardTitle>
          <CardDescription className="text-slate-700">
            Follow these exact steps to install TrackWiser on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border-l-4 border-blue-500">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-slate-900">Copy the Tracking Script</h3>
                <p className="text-slate-600 text-sm">Click the "Copy Script" button below to copy the complete tracking code</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border-l-4 border-green-500">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-slate-900">Open Your Website Files</h3>
                <p className="text-slate-600 text-sm">Open your website's HTML files in your code editor or file manager</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border-l-4 border-purple-500">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-slate-900">Find the &lt;head&gt; Section</h3>
                <p className="text-slate-600 text-sm">Look for the <code className="bg-gray-100 px-2 py-1 rounded">&lt;head&gt;</code> tag in your HTML file</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border-l-4 border-orange-500">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
              <div>
                <h3 className="font-semibold text-slate-900">Paste the Script</h3>
                <p className="text-slate-600 text-sm">Paste the copied script inside the <code className="bg-gray-100 px-2 py-1 rounded">&lt;head&gt;</code> section, before the closing <code className="bg-gray-100 px-2 py-1 rounded">&lt;/head&gt;</code> tag</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border-l-4 border-teal-500">
              <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">5</div>
              <div>
                <h3 className="font-semibold text-slate-900">Save & Upload</h3>
                <p className="text-slate-600 text-sm">Save your HTML file and upload it to your web server</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border-l-4 border-pink-500">
              <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">6</div>
              <div>
                <h3 className="font-semibold text-slate-900">Test Your Website</h3>
                <p className="text-slate-600 text-sm">Visit your website and check your dashboard - you should see visitor data within seconds!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website Info */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 flex items-center">
                <Code className="w-5 h-5 mr-2 text-sky-500" />
                Your Complete Tracking Script
              </CardTitle>
              <CardDescription>
                This is the COMPLETE script for <strong>{website.name}</strong> - just copy and paste it!
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Ready to Use
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {/* The Complete Script */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">🚀 COMPLETE TRACKING SCRIPT (Copy This!)</span>
              <Button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white"
                size="sm"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                {copied ? 'Copied!' : 'Copy Complete Script'}
              </Button>
            </div>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96 border">
              <code>{generateTrackingScript()}</code>
            </pre>
          </div>

          {/* Example Implementation */}
          <Alert className="border-orange-200 bg-orange-50">
            <Code className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <strong>💡 Example: How it should look in your HTML:</strong>
              <pre className="mt-2 bg-slate-100 p-3 rounded text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- PASTE YOUR TRACKING SCRIPT HERE -->
  ${generateTrackingScript()}
  <!-- END OF TRACKING SCRIPT -->
  
</head>
<body>
  <h1>Your Website Content</h1>
  <!-- Rest of your website -->
</body>
</html>`}
              </pre>
            </AlertDescription>
          </Alert>

          {/* What Gets Tracked */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-slate-900">Page Views</h3>
              </div>
              <p className="text-sm text-slate-600">Every page visit is automatically tracked</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-slate-900">User Actions</h3>
              </div>
              <p className="text-sm text-slate-600">Button clicks, link clicks, form submissions</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-slate-900">Scroll Tracking</h3>
              </div>
              <p className="text-sm text-slate-600">How far users scroll on your pages</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-slate-900">Device Info</h3>
              </div>
              <p className="text-sm text-slate-600">Browser, OS, device type, location</p>
            </div>
          </div>

          {/* Testing */}
          <Alert className="border-blue-200 bg-blue-50">
            <Eye className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <strong>🧪 Testing:</strong> After installing the script, visit your website and then refresh this dashboard. 
              You should see visitor data appearing in real-time within a few seconds!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingScriptGenerator;
