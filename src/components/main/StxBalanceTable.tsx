import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StxBalanceTableProps {
  balances: any;
}

export default function StxBalanceTable({ balances }: StxBalanceTableProps) {
  if (!balances) {
    return (
      <div className="text-white bg-red-600 p-4 rounded-lg">
        No STX Balance: Failed to fetch STX balance or no balance available.
      </div>
    );
  }

  return (
    <div className="space-y-4 h-[600px] overflow-y-auto p-4 bg-black text-gray-200">
      <Table className="w-full border border-gray-700 rounded-lg overflow-hidden">
        <TableHeader className="bg-[rgb(247,147,26)]">
          <TableRow>
            <TableHead className="font-bold text-white">Type</TableHead>
            <TableHead className="font-bold text-white">Balance</TableHead>
            <TableHead className="font-bold text-white">Total Sent</TableHead>
            <TableHead className="font-bold text-white">
              Total Received
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-gray-800 transition-colors">
            <TableCell className="font-medium">STX</TableCell>
            <TableCell>{balances.stx?.balance}</TableCell>
            <TableCell>{balances.stx?.total_sent}</TableCell>
            <TableCell>{balances.stx?.total_received}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <h4 className="text-sm font-medium text-purple-400 mt-6">
        Fungible Tokens
      </h4>
      <Table className="w-full border border-gray-700 rounded-lg overflow-hidden">
        <TableHeader className="bg-purple-600">
          <TableRow>
            <TableHead className="font-bold text-white">Token</TableHead>
            <TableHead className="font-bold text-white">Balance</TableHead>
            <TableHead className="font-bold text-white">Total Sent</TableHead>
            <TableHead className="font-bold text-white">
              Total Received
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(balances.fungible_tokens || {}).map(
            ([token, data]: [string, any]) => (
              <TableRow
                key={token}
                className="hover:bg-gray-800 transition-colors"
              >
                <TableCell className="font-medium">
                  {token.split("::")[1]}
                </TableCell>
                <TableCell>{data?.balance}</TableCell>
                <TableCell>{data?.total_sent}</TableCell>
                <TableCell>{data?.total_received}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>

      <h4 className="text-sm font-medium text-[rgb(247,147,26)] mt-6">
        Non-Fungible Tokens
      </h4>
      <Table className="w-full border border-gray-700 rounded-lg overflow-hidden">
        <TableHeader className="bg-[rgb(247,147,26)]">
          <TableRow>
            <TableHead className="font-bold text-white">Token</TableHead>
            <TableHead className="font-bold text-white">Count</TableHead>
            <TableHead className="font-bold text-white">Total Sent</TableHead>
            <TableHead className="font-bold text-white">
              Total Received
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(balances.non_fungible_tokens || {}).map(
            ([token, data]: [string, any]) => (
              <TableRow
                key={token}
                className="hover:bg-gray-800 transition-colors"
              >
                <TableCell className="font-medium">
                  {token.split("::")[1]}
                </TableCell>
                <TableCell>{data?.count}</TableCell>
                <TableCell>{data?.total_sent}</TableCell>
                <TableCell>{data?.total_received}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
