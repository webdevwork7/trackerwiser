import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Code,
  Copy,
  CheckCircle,
  Globe,
  ArrowRight,
  Eye,
  BarChart3,
  Zap,
  Settings,
  Play,
} from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";

const TrackingSetup = () => {
  const [copied, setCopied] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const { websites } = useUserData();

  const trackingCode = `<!-- TrackWiser Tracking Code -->
<script>
(function() {
  var tw = window.tw = window.tw || [];
  if (tw.initialized) return;
  
  tw.initialized = true;
  tw.siteId = '${selectedWebsite || "YOUR_SITE_ID"}';
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

  const setupSteps = [
    {
      step: 1,
      title: "Add Your Website",
      description:
        "Go to the Websites tab and add your website to get a unique tracking code",
      icon: Globe,
      status: websites.length > 0 ? "completed" : "pending",
    },
    {
      step: 2,
      title: "Get Tracking Code",
      description:
        "Copy the JavaScript code below (it will be unique to your website)",
      icon: Code,
      status: selectedWebsite ? "completed" : "pending",
    },
    {
      step: 3,
      title: "Add to Your Website",
      description:
        "Paste the code before the closing </head> tag on every page you want to track",
      icon: Copy,
      status: "pending",
    },
    {
      step: 4,
      title: "Save Changes",
      description: "Save your website files and deploy the changes",
      icon: CheckCircle,
      status: "pending",
    },
    {
      step: 5,
      title: "See Your Stats",
      description:
        "Visit your website and check the Analytics tab to see real-time data",
      icon: BarChart3,
      status: "pending",
    },
  ];

  const getStepIcon = (
    status: string,
    Icon: React.ComponentType<{ className?: string }>
  ) => {
    if (status === "completed") {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    return <Icon className="w-6 h-6 text-slate-400" />;
  };

  const getStepStyle = (status: string) => {
    if (status === "completed") {
      return "border-green-200 bg-green-50";
    }
    return "border-slate-200 bg-white";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-sky-500 to-teal-500 border-0 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center">
            <Code className="w-6 h-6 mr-2" />
            Setup Your Website Tracking
          </CardTitle>
          <CardDescription className="text-sky-100">
            Follow these 5 simple steps to start tracking your website visitors
            and blocking bots
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Setup Steps */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900">
            Step-by-Step Setup Guide
          </CardTitle>
          <CardDescription>
            Complete each step to get your website tracking up and running
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {setupSteps.map((step, index) => (
              <div
                key={step.step}
                className={`p-4 rounded-lg border ${getStepStyle(step.status)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status, step.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          step.status === "completed"
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {step.step}
                      </div>
                      <h3 className="font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      {step.status === "completed" && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600 mt-1">{step.description}</p>
                  </div>
                  {index < setupSteps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Website Selection */}
      {websites.length > 0 && (
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900">
              Select Your Website
            </CardTitle>
            <CardDescription>
              Choose which website you want to get the tracking code for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedWebsite === website.id
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-sky-300"
                  }`}
                  onClick={() => setSelectedWebsite(website.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-sky-500" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">
                        {website.name}
                      </h4>
                      <p className="text-sm text-slate-600">{website.domain}</p>
                    </div>
                    {selectedWebsite === website.id && (
                      <CheckCircle className="w-5 h-5 text-sky-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Code */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">
                Your Tracking Code
              </CardTitle>
              <CardDescription>
                Copy this code and paste it before the closing &lt;/head&gt; tag
                on your website
              </CardDescription>
            </div>
            <Button
              onClick={copyToClipboard}
              disabled={!selectedWebsite}
              className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedWebsite ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No website selected</p>
              <p className="text-sm text-slate-500">
                {websites.length === 0
                  ? "Add a website first to get your tracking code"
                  : "Select a website above to get your tracking code"}
              </p>
            </div>
          ) : (
            <>
              <div className="relative">
                <pre className="bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm">
                  <code>{trackingCode}</code>
                </pre>
              </div>

              <Alert className="mt-4">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Place this code before the closing
                  &lt;/head&gt; tag on every page you want to track. The code
                  will automatically start collecting visitor data and detecting
                  bots.
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-sky-500" />
              Add New Website
            </CardTitle>
            <CardDescription>
              Don't have a website added yet? Add one to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white">
              <Globe className="w-4 h-4 mr-2" />
              Add Website
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-sky-100">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-teal-500" />
              View Analytics
            </CardTitle>
            <CardDescription>
              Once you've added the code, check your real-time analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Go to Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-white/80 border-sky-100">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-sky-500" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Test on a staging site first
                </p>
                <p className="text-xs text-slate-600">
                  Make sure everything works before deploying to production
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Add to all pages you want to track
                </p>
                <p className="text-xs text-slate-600">
                  Include the code on every page, not just the homepage
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Wait a few minutes for data to appear
                </p>
                <p className="text-xs text-slate-600">
                  It may take 2-5 minutes for your first analytics to show up
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingSetup;
