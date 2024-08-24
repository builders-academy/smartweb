"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuitIcon, RefreshCcw } from "lucide-react";
import { getAgentExecutor } from "@/ai/agents/assetEvaluation";

interface AiRecommendationsProps {
  stxBalance: {
    stx: {
      balance: string;
    };
    fungible_tokens: Record<
      string,
      {
        balance: string;
        total_sent: string;
        total_received: string;
      }
    >;
    non_fungible_tokens: Record<
      string,
      {
        count: string;
        total_sent: string;
        total_received: string;
      }
    >;
  };
}

interface AgentResponse {
  recommendations: string[];
}

export default function AiRecommendations({
  stxBalance,
}: AiRecommendationsProps) {
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAgentInvocation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const agentExecutor = await getAgentExecutor();
      const response = await agentExecutor(
        `I have the following assets:
        ${JSON.stringify(stxBalance.stx)} STX, ${JSON.stringify(
          stxBalance.fungible_tokens
        )}, ${JSON.stringify(stxBalance.non_fungible_tokens)} 
        Given my current assets and the swap options available on Alex, which swap would be the most beneficial for me to maximize my returns or achieve the best outcome based on the current market rates and swap fees?
        Please provide a detailed analysis considering potential profit, fees, and any other factors that might affect the decision.`
      );
      setAgentResponse(response);
    } catch (error) {
      console.error("Error invoking agent:", error);
      setError(
        "An error occurred while fetching recommendations. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAgentResponse(null);
    setError(null);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <BrainCircuitIcon className="mr-2 h-5 w-5" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : agentResponse ? (
          <ul className="list-disc pl-5 space-y-2">
            {agentResponse.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        ) : (
          <p>No recommendations yet. Click the button below to get insights.</p>
        )}
        <div className="mt-4 flex space-x-2">
          <Button
            onClick={handleAgentInvocation}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
          </Button>
          {agentResponse && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-background"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
