import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon } from "lucide-react";

interface WalletDataTableProps {
  walletData: Array<{ purpose: string; address: string }>;
  copyToClipboard: (text: string) => void;
}

export default function WalletDataTable({
  walletData,
  copyToClipboard,
}: WalletDataTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle
          className="              text-2xl font-bold mb-4 text-[rgb(247,147,26)]
"
        >
          Wallet Addresses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purpose</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletData.map((address, index) => (
                <TableRow key={index}>
                  <TableCell>{address.purpose}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {address.address}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(address.address)}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
