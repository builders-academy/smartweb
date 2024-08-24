import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartIcon } from "lucide-react";

export default function PerformanceInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChartIcon className="mr-2 h-5 w-5" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Performance insights content */}
        <p className="mb-2">
          Your portfolio has grown by 5% this month. Here&apos;s a breakdown:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Bitcoin: +7%</li>
          <li>Ethereum: +3%</li>
          <li>Stacks: +2%</li>
        </ul>
      </CardContent>
    </Card>
  );
}
