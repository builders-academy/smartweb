import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
interface RunesBalanceTableProps {
  balances: Array<{
    runeName: string;
    symbol: string;
    amount: string;
    divisibility: number;
  }>;
}

export default function RunesBalanceTable({
  balances,
}: RunesBalanceTableProps) {
  if (!balances || balances.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Runes</AlertTitle>
        <AlertDescription>
          You currently do not have any Runes in your wallet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rune Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balances.map(
            (
              rune: {
                runeName:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<React.AwaitedReactNode>
                  | null
                  | undefined;
                symbol: any;
                amount: string;
                divisibility: number;
              },
              index: React.Key | null | undefined
            ) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{rune.runeName}</TableCell>
                <TableCell>{rune.symbol || "N/A"}</TableCell>
                <TableCell className="text-right">
                  {parseFloat(rune.amount) / Math.pow(10, rune.divisibility)}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
