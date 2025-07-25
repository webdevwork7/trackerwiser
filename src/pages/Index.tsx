
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Zap, BarChart3, Bot, Globe, Users, Lock, ArrowRight, Play, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">TrackWiser</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-sky-600 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-sky-600 transition-colors">Pricing</a>
              <a href="#docs" className="text-slate-600 hover:text-sky-600 transition-colors">Docs</a>
              <Link to="/dashboard">
                <Button variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">
                  Login
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200">
            <div className="w-2 h-2 bg-lime-500 rounded-full mr-2 animate-pulse"></div>
            Real-time Analytics + Bot Protection
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            Analytics that
            <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent"> Actually </span>
            Matter
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Combine real-time visitor intelligence, advanced bot detection, and smart cloaking in one developer-first platform. 
            Because your traffic deserves better than fake analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white px-8 py-4 text-lg">
              Start 30-Day Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-teal-500/20 rounded-3xl blur-3xl"></div>
            <Card className="relative bg-white/60 backdrop-blur-lg border-white/80 shadow-2xl rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 text-slate-400 text-sm font-mono">trackwiser.dev/dashboard</div>
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-slate-50 to-sky-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-white/80 border-sky-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600">Live Visitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">247</div>
                      <div className="flex items-center text-sm text-lime-600">
                        <div className="w-2 h-2 bg-lime-500 rounded-full mr-1 animate-pulse"></div>
                        +12% from yesterday
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 border-sky-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600">Bots Blocked</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">1,432</div>
                      <div className="text-sm text-teal-600">Today</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 border-sky-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">4.2%</div>
                      <div className="text-sm text-sky-600">Real humans only</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Everything You Need, Nothing You Don't</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Stop guessing about your traffic. Get real insights, block the bots, and protect your revenue streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Real-Time Analytics</CardTitle>
                <CardDescription>Live visitor tracking with heatmaps, session recordings, and detailed user fingerprinting.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-sky-500 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Smart Bot Detection</CardTitle>
                <CardDescription>Advanced ML-powered bot detection with IP reputation, user agent analysis, and behavioral scoring.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Cloaking Engine</CardTitle>
                <CardDescription>Show different pages to bots vs. humans. Protect your money pages while staying compliant.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-sky-500 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Global Intelligence</CardTitle>
                <CardDescription>Worldwide IP reputation database with real-time threat intelligence and geo-blocking.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">One-Line Integration</CardTitle>
                <CardDescription>Drop in our tracking script and you're done. Built-in validator ensures perfect setup every time.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/80 border-sky-100 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-sky-500 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-900">Privacy-First</CardTitle>
                <CardDescription>GDPR compliant with IP masking, cookie consent, and user data protection built-in.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Start free, scale as you grow. No hidden fees, no surprises.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/80 border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Starter</CardTitle>
                <div className="text-4xl font-bold text-slate-900 my-4">Free</div>
                <CardDescription>Perfect for side projects and testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">10K monthly pageviews</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">Basic bot detection</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">Real-time dashboard</span>
                </div>
                <Button className="w-full mt-6 border-slate-300 text-slate-700 hover:bg-slate-50" variant="outline">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-sky-200 relative scale-105 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Professional</CardTitle>
                <div className="text-4xl font-bold text-slate-900 my-4">$49<span className="text-lg text-slate-500">/mo</span></div>
                <CardDescription>For growing businesses and agencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">500K monthly pageviews</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">Advanced bot detection</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">Cloaking engine</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">Heatmaps & recordings</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-slate-900 my-4">$199<span className="text-lg text-slate-500">/mo</span></div>
                <CardDescription>For high-traffic applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">Unlimited pageviews</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">Custom ML models</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">White-label solution</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                  <span className="text-slate-600">Priority support</span>
                </div>
                <Button className="w-full mt-6 border-slate-300 text-slate-700 hover:bg-slate-50" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-500 to-teal-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Stop Guessing About Your Traffic?</h2>
          <p className="text-xl text-sky-100 mb-8">
            Join thousands of developers who trust TrackWiser for real analytics and bot protection.
          </p>
          <Button size="lg" className="bg-white text-sky-600 hover:bg-slate-50 px-8 py-4 text-lg">
            Start Your Free 30-Day Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-sky-200 mt-4">No credit card required • Setup in under 5 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TrackWiser</span>
              </div>
              <p className="text-slate-400">Real analytics for real businesses. No bots, no BS.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block hover:text-sky-400 transition-colors">Features</a>
                <a href="#" className="block hover:text-sky-400 transition-colors">Pricing</a>
                <a href="#" className="block hover:text-sky-400 transition-colors">API Docs</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block hover:text-sky-400 transition-colors">About</a>
                <a href="#" className="block hover:text-sky-400 transition-colors">Blog</a>
                <a href="#" className="block hover:text-sky-400 transition-colors">Careers</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block hover:text-sky-400 transition-colors">Help Center</a>
                <a href="#" className="block hover:text-sky-400 transition-colors">Contact</a>
                <a href="#" className="block hover:text-sky-400 transition-colors">Status</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 TrackWiser. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
