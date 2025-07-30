import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Globe, Settings, Unlock } from "lucide-react";

const BotDetectionWhitelist = () => {
  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">
              Allow Lists & Trusted Sources
            </CardTitle>
            <CardDescription>
              Manage IPs, user agents, and bot signatures that should
              never be blocked
            </CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
            <Unlock className="w-4 h-4 mr-2" />
            Add to Allowlist
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="font-medium text-green-900">
                  Search Engine Bots
                </div>
              </div>
              <div className="text-sm text-green-700">
                Google, Bing, Yahoo, DuckDuckGo, and other legitimate
                search crawlers
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <div className="font-medium text-blue-900">
                  Monitoring Tools
                </div>
              </div>
              <div className="text-sm text-blue-700">
                Uptime monitors, performance testing tools, and security
                scanners
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <div className="font-medium text-purple-900">
                  Social Media Bots
                </div>
              </div>
              <div className="text-sm text-purple-700">
                Facebook, Twitter, LinkedIn, and other social media
                crawlers
              </div>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="w-5 h-5 text-orange-600" />
                <div className="font-medium text-orange-900">
                  Custom Allowlist
                </div>
              </div>
              <div className="text-sm text-orange-700">
                Manually added IPs and user agents for specific business
                needs
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotDetectionWhitelist; 