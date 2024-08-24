import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuitIcon } from "lucide-react";

export default function AiRecommendations() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <BrainCircuitIcon className="mr-2 h-5 w-5" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="font-semibold mr-2">1.</span>
            <span>
              <strong>Portfolio Diversification:</strong> Consider allocating
              10% of your assets to emerging cryptocurrencies to balance risk
              and potential growth.
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <span>
              <strong>Security Tip:</strong> Enable two-factor authentication on
              all your crypto exchange accounts for enhanced security.
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <span>
              <strong>Market Trend:</strong> Bitcoin&apos;s recent price
              movement suggests a potential bullish trend. Monitor closely for
              investment opportunities.
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">4.</span>
            <span>
              <strong>Tax Reminder:</strong> Keep detailed records of all your
              crypto transactions for upcoming tax season reporting.
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
