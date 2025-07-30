import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface BotType {
  name: string;
  count: number;
  blocked: number;
  allowed: number;
  color: string;
  accuracy: number;
  falsePositives: number;
}

interface RulesProps {
  botTypes: BotType[];
}

const BotDetectionRules = ({ botTypes }: RulesProps) => {
  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">
              Block Rules Configuration
            </CardTitle>
            <CardDescription>
              Configure automatic blocking rules for different bot types
            </CardDescription>
          </div>
          <Button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white">
            Add Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {botTypes.length > 0 ? (
          <div className="grid gap-4">
            {botTypes.map((type) => (
              <div
                key={type.name}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {type.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {type.count} detected today • {type.accuracy}%
                      accuracy
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600">
                    {type.blocked} blocked, {type.allowed} allowed
                  </span>
                  <Switch defaultChecked={type.blocked > type.allowed} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No bot types available for configuration
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BotDetectionRules; 