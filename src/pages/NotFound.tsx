import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, BarChart3, Shield, Activity } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                404
              </h1>
            </div>

            {/* Main Message */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <p className="text-sm text-gray-500">
                Attempted to access:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {location.pathname}
                </code>
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Analytics
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Protection
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                <Activity className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Monitoring
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            {/* Brand */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                TrackWiser Analytics - Website Intelligence Platform
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
