import { Monitor } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

const DesktopRequired = () => {
  return (
    <div className="absolute inset-0 bg-background z-50 flex items-center justify-center p-4 md:hidden">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-orange-100 rounded-full">
              <Monitor className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Desktop Required</CardTitle>
          <CardDescription className="text-base">
            This Web3 application is currently only available on desktop devices
            for the best user experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Please access this application from a desktop or laptop computer
              to connect your wallet and use all features.
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Mobile support coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesktopRequired;
