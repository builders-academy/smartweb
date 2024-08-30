import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SatsBalanceTableProps {
  balances: {
    total: number;
    confirmed: number;
    unconfirmed: number;
  };
}

export default function SatsBalanceTable({ balances }: SatsBalanceTableProps) {
  const formatBalance = (balance: number) => (balance / 100000000).toFixed(6); // Dividing by 1 million
  return (
    <div className="overflow-x-auto max-h-[500px] overflow-y-auto bg-black text-gray-200 p-4 rounded-lg">
      <Table className="w-full border border-gray-700 rounded-lg overflow-hidden">
        <TableHeader className="bg-[rgb(247,147,26)]">
          <TableRow>
            <TableHead className="font-bold text-white">Total (BTC)</TableHead>
            <TableHead className="font-bold text-white">
              Confirmed (BTC)
            </TableHead>
            <TableHead className="font-bold text-white">
              Unconfirmed (BTC)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-gray-800 transition-colors">
            <TableCell>{formatBalance(balances.total)}</TableCell>
            <TableCell>{formatBalance(balances.confirmed)}</TableCell>
            <TableCell>{formatBalance(balances.unconfirmed)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
