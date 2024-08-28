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

interface StxBalanceTableProps {
  balances: any;
}

export default function StxBalanceTable({ balances }: StxBalanceTableProps) {
  if (!balances) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No STX Balance</AlertTitle>
        <AlertDescription>
          Failed to fetch STX balance or no balance available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 h-[600px] overflow-y-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Total Sent</TableHead>
            <TableHead>Total Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>STX</TableCell>
            <TableCell>{balances.stx.balance}</TableCell>
            <TableCell>{balances.stx.total_sent}</TableCell>
            <TableCell>{balances.stx.total_received}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <h4 className="text-sm font-medium">Fungible Tokens</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Total Sent</TableHead>
            <TableHead>Total Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(balances.fungible_tokens).map(([token, data]) => (
            <TableRow key={token}>
              <TableCell>{token.split("::")[1]}</TableCell>
              <TableCell>
                {/* @ts-ignore */}
                {data.balance}
              </TableCell>
              <TableCell>
                {/* @ts-ignore */}
                {data.total_sent}
              </TableCell>
              <TableCell>
                {/* @ts-ignore */}
                {data.total_received}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <h4 className="text-sm font-medium">Non-Fungible Tokens</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Total Sent</TableHead>
            <TableHead>Total Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(balances.non_fungible_tokens).map(([token, data]) => (
            <TableRow key={token}>
              <TableCell>{token.split("::")[1]}</TableCell>
              <TableCell>
                {/* @ts-ignore */}
                {data.count}
              </TableCell>
              <TableCell>
                {/* @ts-ignore */}
                {data.total_sent}
              </TableCell>
              <TableCell>
                {/* @ts-ignore */}
                {data.total_received}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
