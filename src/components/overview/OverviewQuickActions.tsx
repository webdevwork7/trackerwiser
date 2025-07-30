import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  BarChart3,
  Code,
  Shield,
  ArrowRight,
  Zap,
  Sparkles,
  Target,
} from "lucide-react";

interface OverviewQuickActionsProps {
  setActiveTab: (tab: string) => void;
}

const OverviewQuickActions = ({ setActiveTab }: OverviewQuickActionsProps) => {
  const quickActions = [
    {
      title: "Add Website",
      description: "Start tracking a new website with our powerful analytics",
      icon: Globe,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      badge: "New",
      action: () => setActiveTab("websites"),
      features: ["Real-time tracking", "Bot protection", "Analytics"],
    },
    {
      title: "Live Analytics",
      description: "View real-time visitor data and behavioral insights",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      badge: "Live",
      action: () => setActiveTab("analytics"),
      features: ["Real-time data", "Charts", "Insights"],
    },
    {
      title: "Setup Guide",
      description: "Get step-by-step instructions for installation",
      icon: Code,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      badge: "Easy",
      action: () => setActiveTab("setup"),
      features: ["5-minute setup", "Code generator", "Validation"],
    },
    {
      title: "Security Status",
      description: "Monitor bot protection and security metrics",
      icon: Shield,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      badge: "Protected",
      action: () => setActiveTab("status"),
      features: ["Bot detection", "Threat blocking", "Security"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Quick Actions
        </h2>
        <p className="text-slate-600">
          Get started with these essential features
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="bg-white/80 border-slate-200 hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden relative"
            onClick={action.action}
          >
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <Badge
                  className={`${action.bgColor} ${action.iconColor} border-0`}
                >
                  {action.badge}
                </Badge>
              </div>

              <CardTitle className="text-slate-900 group-hover:text-sky-700 transition-colors duration-300">
                {action.title}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {action.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {action.features.map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white group-hover:from-sky-600 group-hover:to-teal-600 transition-all duration-300"
                  size="sm"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Highlights */}
      <Card className="bg-gradient-to-r from-slate-50 to-sky-50 border-sky-200">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-sky-500" />
            Why Choose TrackWiser?
          </CardTitle>
          <CardDescription>
            Powerful features that make analytics simple and effective
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-slate-600">
                Real-time analytics with sub-second response times
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Secure by Default
              </h3>
              <p className="text-sm text-slate-600">
                Advanced bot protection and threat detection
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Accurate Insights
              </h3>
              <p className="text-sm text-slate-600">
                Filter out bots for clean, actionable data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewQuickActions;
