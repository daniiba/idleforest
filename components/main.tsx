import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Trees, Leaf, Forest } from "lucide-react";

const IdleForestPopup = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [treeCount, setTreeCount] = React.useState(1234567); // Example large number
  const [progressToNextTree, setProgressToNextTree] = React.useState(70);

  // Format large numbers with K/M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Calculate forest size categories
  const getForestVisual = () => {
    const size = treeCount;
    if (size >= 1000000) return { icon: 'huge', count: Math.floor(size / 1000000) };
    if (size >= 100000) return { icon: 'large', count: Math.floor(size / 100000) };
    if (size >= 10000) return { icon: 'medium', count: Math.floor(size / 10000) };
    return { icon: 'small', count: Math.floor(size / 1000) };
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">IdleForest</CardTitle>
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            className="ml-4"
          />
        </div>
        <CardDescription>
          {isEnabled ? "Currently growing trees" : "Enable to start growing trees"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Forest Visualization */}
        <div className="relative h-32 bg-gradient-to-b from-green-50 to-green-100 rounded-lg p-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-2">
              {[...Array(getForestVisual().count)].map((_, i) => (
                <Forest 
                  key={i}
                  className="text-green-600"
                  size={28}
                />
              ))}
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2 bg-white/80 rounded p-2">
            <p className="text-sm text-center font-medium">
              Each forest icon = {formatNumber(
                treeCount >= 1000000 ? 1000000 : 
                treeCount >= 100000 ? 100000 :
                treeCount >= 10000 ? 10000 : 1000
              )} trees
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Trees Planted</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">{formatNumber(treeCount)}</span>
              <span className="text-sm text-gray-500 ml-1">trees</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress to next milestone</span>
              <span>{progressToNextTree}%</span>
            </div>
            <Progress value={progressToNextTree} className="h-2" />
          </div>
        </div>

        {/* Impact Summary */}
        <div className="bg-green-50 p-3 rounded-lg space-y-1">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-600" size={16} />
            <span className="text-sm font-medium">Your Impact</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>CO₂ absorbed yearly:</p>
            <p className="font-medium">{formatNumber(treeCount * 48)}kg</p>
            <p className="text-xs text-gray-500">≈ {formatNumber(treeCount * 48 / 2400)} cars off the road</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdleForestPopup;