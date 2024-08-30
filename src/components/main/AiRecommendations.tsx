"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function AiRecommendations({
  recommendations,
  isLoading,
}: {
  recommendations: {
    swapRecommendations: string | string[];
    liquidityRecommendations: string | string[];
  } | null;
  isLoading: boolean;
}) {
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

  const MarkdownContent = ({ content }: { content: string }) => (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, ...props }) => (
            <a className="text-blue-500 hover:underline" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold mt-4 mb-2" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mt-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4 text-[rgb(247,147,26)]">
          AI Recommendations
        </CardTitle>
        <CardDescription>
          Based on your current portfolio, our Agent advises you to:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="liquidity" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swap">Swap Recommendations</TabsTrigger>
            <TabsTrigger value="liquidity">
              Liquidity Recommendations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="swap">
            <MarkdownContent
              content={formatRecommendations(
                recommendations.swapRecommendations
              )}
            />
          </TabsContent>
          <TabsContent value="liquidity">
            <MarkdownContent
              content={formatRecommendations(
                recommendations.liquidityRecommendations
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
