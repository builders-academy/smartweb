import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Caesar_Dressing } from "next/font/google";

interface WalletDataTableProps {
  walletData: Array<{ purpose: string; address: string }>;
  copyToClipboard: (text: string) => void;
}

export default function WalletDataDropdown({
  walletData,
  copyToClipboard,
}: WalletDataTableProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Button
          onClick={toggleDropdown}
          className="w-full text-left flex justify-between items-center bg-black hover:bg-purple-500 transition-colors"
        >
          <span className="text-white">My Address Details</span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-white" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white" />
          )}
        </Button>
      </CardHeader>
      {isOpen && (
        <CardContent className="p-4">
          {" "}
          {/* Added padding for spacing */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-[rgb(247,147,26)]">
                <tr>
                  <th className="text-right text-white font-bold px-4 py-2">
                    Purpose
                  </th>
                  <th className="text-left text-white font-bold px-4 py-2">
                    Address
                  </th>
                  <th className="text-left text-white font-bold px-4 py-2 w-[100px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {walletData.map((address, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    <td className="text-gray-300 px-4 py-2">
                      {address.purpose}
                    </td>
                    <td className="font-mono text-xs text-gray-300 px-4 py-2">
                      {address.address}
                    </td>
                    <td className="px-4 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(address.address)}
                      >
                        <CopyIcon className="h-4 w-4 text-gray-300" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
