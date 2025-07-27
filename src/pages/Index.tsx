
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Eye, 
  Globe, 
  Zap, 
  TrendingUp, 
  MousePointer, 
  Clock,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Monitor,
  Bot
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">TrackWiser</h1>
                <p className="text-sm text-slate-600">Analytics • Bot Detection • Cloaking</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-sky-100 text-sky-800 border-sky-200">
              <Zap className="w-4 h-4 mr-1" />
              Real-time Analytics Platform
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
              Analytics that{" "}
              <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
                outsmart bots
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Combine the power of Google Analytics, Hotjar, and Cloudflare Bot Management. 
              Get real-time visitor intelligence with advanced bot detection and cloaking capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-sky-200 text-sky-700">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to track smarter
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced analytics, bot detection, and cloaking in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real-time Analytics */}
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Real-time Analytics</CardTitle>
                <CardDescription>Live visitor intelligence with instant insights</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Live dashboard with real-time metrics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Visitor fingerprinting & geolocation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Device, browser, and OS detection
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Bot Detection */}
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Advanced Bot Detection</CardTitle>
                <CardDescription>Identify and block malicious traffic</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    IP reputation & user agent analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Behavioral pattern recognition
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Custom block/allow lists
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Cloaking Engine */}
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Smart Cloaking</CardTitle>
                <CardDescription>Show different content to bots vs humans</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Safe page for bots & crawlers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Money page for real users
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Intelligent routing rules
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Heatmaps */}
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <MousePointer className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Interactive Heatmaps</CardTitle>
                <CardDescription>Visualize user behavior patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Click & scroll tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Mouse movement analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Session recordings
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Easy Integration */}
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Easy Integration</CardTitle>
                <CardDescription>One-line setup for web and mobile</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Simple JavaScript snippet
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Mobile SDKs for iOS & Android
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Built-in validation tools
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* GDPR Compliance */}
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Privacy-First</CardTitle>
                <CardDescription>GDPR compliant with IP masking</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    GDPR & CCPA compliant
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Optional IP masking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
                    Cookie consent management
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to outsmart the bots?
          </h2>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Join thousands of websites using TrackWiser to get real insights from real users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-sky-300 text-white hover:bg-sky-600">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">TrackWiser</span>
              </div>
              <p className="text-sm">
                Real-time analytics with advanced bot detection and cloaking capabilities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400">Analytics</a></li>
                <li><a href="#" className="hover:text-sky-400">Bot Detection</a></li>
                <li><a href="#" className="hover:text-sky-400">Cloaking</a></li>
                <li><a href="#" className="hover:text-sky-400">Heatmaps</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400">About</a></li>
                <li><a href="#" className="hover:text-sky-400">Blog</a></li>
                <li><a href="#" className="hover:text-sky-400">Careers</a></li>
                <li><a href="#" className="hover:text-sky-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400">Documentation</a></li>
                <li><a href="#" className="hover:text-sky-400">API Reference</a></li>
                <li><a href="#" className="hover:text-sky-400">Help Center</a></li>
                <li><a href="#" className="hover:text-sky-400">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 TrackWiser. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
