
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
  Bot,
  Play,
  Star,
  Code,
  Copy,
  Activity,
  Target,
  Filter,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">TrackWiser</h1>
                <p className="text-sm text-slate-600">Real-time Analytics Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:from-sky-600 hover:to-teal-600">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-sky-100 to-teal-100 text-sky-800 border-sky-200 px-6 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              #1 Real-time Analytics Platform
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Stop tracking{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
                  bots
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transform scale-x-0 animate-pulse"></div>
              </span>
              <br />
              Track real{" "}
              <span className="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
                users
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Get <strong>real-time visitor insights</strong> with advanced bot detection and smart cloaking. 
              <br />
              Finally, analytics that show you what real humans are actually doing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:from-sky-600 hover:to-teal-600 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-sky-200 text-sky-700 hover:bg-sky-50 px-8 py-4 text-lg font-semibold">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600 mb-2">99.9%</div>
                <div className="text-slate-600">Bot Detection Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">&lt;50ms</div>
                <div className="text-slate-600">Real-time Processing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600 mb-2">10,000+</div>
                <div className="text-slate-600">Websites Protected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              How TrackWiser Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div className="bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Add Your Website</h3>
              <p className="text-slate-600 mb-4">
                Sign up and add your website URL to get your unique tracking code
              </p>
              <div className="bg-slate-100 p-4 rounded-lg text-left">
                <code className="text-sm text-slate-700">
                  Domain: yoursite.com<br />
                  Status: ✅ Active
                </code>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-10 h-10 text-white" />
              </div>
              <div className="bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Install Tracking Code</h3>
              <p className="text-slate-600 mb-4">
                Copy and paste one line of code into your website's head section
              </p>
              <div className="bg-slate-900 p-4 rounded-lg text-left">
                <code className="text-sm text-green-400">
                  &lt;script src="trackwiser.js"&gt;&lt;/script&gt;
                </code>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <div className="bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Get Real Insights</h3>
              <p className="text-slate-600 mb-4">
                Watch real-time analytics flow in with bot-free data
              </p>
              <div className="bg-slate-100 p-4 rounded-lg text-left">
                <div className="text-sm text-slate-700">
                  👥 Real Users: 1,234<br />
                  🤖 Bots Blocked: 456<br />
                  📊 Accuracy: 99.9%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-sky-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              See It In Action
            </h2>
            <p className="text-xl text-sky-100 max-w-3xl mx-auto">
              Watch TrackWiser detect and block bots in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Real-time Bot Detection</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium">Real User Detected</div>
                    <div className="text-sm text-sky-200">Chrome, Desktop, New York</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div>
                    <div className="font-medium">Bot Blocked</div>
                    <div className="text-sm text-sky-200">Suspicious patterns detected</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium">Real User Detected</div>
                    <div className="text-sm text-sky-200">Safari, Mobile, London</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-teal-400">94.2%</div>
                <div className="text-sky-200">Real Human Traffic</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Bots Blocked</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Real Users</span>
                  <span className="font-semibold">20,385</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Accuracy</span>
                  <span className="font-semibold text-green-400">99.9%</span>
                </div>
              </div>
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
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-white" />
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
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 hover:shadow-lg">
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
                    Machine learning detection
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Smart Cloaking */}
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 hover:shadow-lg">
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
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 hover:shadow-lg">
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
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-white" />
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
                    WordPress plugin available
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy First */}
            <Card className="bg-white/80 border-sky-100 hover:border-sky-200 transition-all duration-300 hover:shadow-lg">
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

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100 to-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Trusted by 10,000+ Websites
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From startups to enterprises, businesses trust TrackWiser to deliver accurate analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-white/80 border-sky-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "TrackWiser helped us identify that 40% of our traffic was bots. Now we make decisions based on real user data."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">JS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">John Smith</div>
                    <div className="text-sm text-slate-600">CEO, TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-white/80 border-sky-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "The real-time analytics are incredible. We can see exactly what our users are doing as it happens."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Maria Johnson</div>
                    <div className="text-sm text-slate-600">Marketing Director, StartupXYZ</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-white/80 border-sky-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "Setup was incredibly easy. We had it running in under 5 minutes and immediately saw the difference."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">RB</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Robert Brown</div>
                    <div className="text-sm text-slate-600">CTO, DataCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to see what real users are doing?
          </h2>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Join thousands of websites using TrackWiser to get real insights from real users. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50 px-8 py-4 text-lg font-semibold shadow-lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-sky-300 text-white hover:bg-sky-600 px-8 py-4 text-lg font-semibold">
              Book a Demo
            </Button>
          </div>
          <p className="text-sky-100 mt-6 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
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
              <p className="text-sm mb-4">
                Real-time analytics with advanced bot detection and cloaking capabilities.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400 transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Bot Detection</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Cloaking</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Heatmaps</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 TrackWiser. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
