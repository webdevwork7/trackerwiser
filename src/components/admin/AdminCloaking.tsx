import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeOff, Lock, Unlock } from "lucide-react";

const AdminCloaking = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <EyeOff className="w-5 h-5 mr-2" />
          Cloaking Engine
        </CardTitle>
        <CardDescription>
          Manage content cloaking and protection settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Content Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Text cloaking</span>
                  <Button size="sm" variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Link protection</span>
                  <Button size="sm" variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Image cloaking</span>
                  <Button size="sm" variant="outline">
                    <Unlock className="w-4 h-4 mr-2" />
                    Disable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bot access</span>
                  <Badge className="bg-red-100 text-red-800">Blocked</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Human access</span>
                  <Badge className="bg-green-100 text-green-800">Allowed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Search engines</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Limited
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCloaking;
