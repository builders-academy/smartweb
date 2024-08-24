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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Total</TableHead>
          <TableHead>Confirmed</TableHead>
          <TableHead>Unconfirmed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{balances.total}</TableCell>
          <TableCell>{balances.confirmed}</TableCell>
          <TableCell>{balances.unconfirmed}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
