import React, { MouseEventHandler, ReactElement } from "react";
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
  onClick: MouseEventHandler;
}

export default function BalanceCard({
  title,
  icon,
  content,
  onClick,
}: BalanceCardProps) {
  return (
    <div className="..." onClick={onClick}>
      <Collapsible>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
          </CardHeader>
        </Card>
      </Collapsible>
    </div>
  );
}
