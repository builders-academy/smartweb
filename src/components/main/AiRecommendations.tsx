import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AiRecommendations = ({
  recommendations,
  isLoading,
}: {
  recommendations: any;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Loading recommendations...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
        <CardDescription>Based on your current portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Swap Recommendations:</h3>
        <p>{recommendations.swapRecommendations}</p>
        <h3 className="text-lg font-semibold mt-4 mb-2">
          Liquidity Recommendations:
        </h3>
        <p>{recommendations.liquidityRecommendations}</p>
      </CardContent>
    </Card>
  );
};

export default AiRecommendations;
