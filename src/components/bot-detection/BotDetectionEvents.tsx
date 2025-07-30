import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Filter, Download } from "lucide-react";

interface BotEvent {
  id: string;
  type: string;
  ip: string;
  action: string;
  created_at: string;
  country: string;
  risk: string;
  confidence: number;
  method: string;
  details: string;
  website_id?: string;
}

interface EventsProps {
  botEvents: BotEvent[];
}

const BotDetectionEvents = ({ botEvents }: EventsProps) => {
  const getActionBadge = (action: string) => {
    switch (action) {
      case "Blocked":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Blocked
          </Badge>
        );
      case "Allowed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Allowed
          </Badge>
        );
      case "Quarantined":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Quarantined
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-200">
            Unknown
          </Badge>
        );
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Critical":
        return <Badge className="bg-red-600 text-white">Critical</Badge>;
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-500 text-white">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">
              Real-time Bot Events
            </CardTitle>
            <CardDescription>
              Live monitoring of bot detection events with detailed analysis
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-lime-100 text-lime-800 border-lime-200">
              <div className="w-2 h-2 bg-lime-500 rounded-full mr-2 animate-pulse"></div>
              Live Monitoring
            </Badge>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {botEvents.length > 0 ? (
          <div className="space-y-4">
            {botEvents.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-sky-500 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {event.type}
                      </div>
                      <div className="text-sm text-slate-500">
                        IP: {event.ip} • {event.country} • {new Date(event.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getActionBadge(event.action)}
                    {getRiskBadge(event.risk)}
                    <Badge className="bg-sky-100 text-sky-800 border-sky-200">
                      {event.confidence}% conf
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-600 mb-1">
                      Detection Method
                    </div>
                    <div className="font-medium text-slate-900">
                      {event.method}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">
                      Analysis Details
                    </div>
                    <div className="text-slate-700">{event.details}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No bot events detected yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BotDetectionEvents; 