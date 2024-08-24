import React, { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

interface BalanceCardProps {
  title: string;
  icon: ReactElement;
  content: ReactElement;
}

export default function BalanceCard({
  title,
  icon,
  content,
}: BalanceCardProps) {
  return (
    <Collapsible>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <span>View Details</span>
            <ChevronDownIcon className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">{content}</CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
