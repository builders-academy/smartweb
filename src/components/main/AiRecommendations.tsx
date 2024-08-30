"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

const AiRecommendations = ({
  recommendations,
  isLoading,
}: {
  recommendations: {
    swapRecommendations: string | string[];
    liquidityRecommendations: string | string[];
  } | null;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 text-[rgb(247,147,26)]">
            AI Recommendations
          </CardTitle>
          <CardDescription>Loading recommendations...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!recommendations) {
    return null;
  }

  const formatRecommendations = (recs: string | string[]): string => {
    if (typeof recs === "string") {
      return recs;
    }
    return recs.join("\n\n");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 text-[rgb(247,147,26)]">
          AI Recommendations
        </CardTitle>
        <CardDescription>
          Based on your current portfolio Our Agent Advises you to:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Swap Recommendations:</h3>
        <div className="prose dark:prose-invert">
          <ReactMarkdown>
            {formatRecommendations(recommendations.swapRecommendations)}
          </ReactMarkdown>
        </div>
        <h3 className="text-lg font-semibold mt-4 mb-2">
          Liquidity Recommendations:
        </h3>
        <div className="prose dark:prose-invert">
          <ReactMarkdown>
            {formatRecommendations(recommendations.liquidityRecommendations)}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiRecommendations;
