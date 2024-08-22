"use client";

import React from "react";
import { useConnectWalletSats } from "@/helpers/connect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  WalletIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function Home() {
  const { walletData, balances, isConnected, connectWallet, disconnectWallet } =
    useConnectWalletSats();
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    await connectWallet();
    toast({
      title: "Wallet Connected",
      description: "Your wallet has been successfully connected.",
    });
  };

  const handleDisconnectWallet = async () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">Crypto Dashboard</span>
            </div>
            <div>
              {isConnected ? (
                <Button onClick={handleDisconnectWallet} variant="destructive">
                  Disconnect Wallet
                </Button>
              ) : (
                <Button onClick={handleConnectWallet}>
                  <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to view your balances and data.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <Card>
              <CardHeader>
                <CardTitle>BTC Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {balances.btc?.total || 0}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  {balances.btc?.confirmed > balances.btc?.unconfirmed ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span>Confirmed: {balances.btc?.confirmed || 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Runes Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {balances.runes?.total}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  {balances.runes?.confirmed > balances.runes?.unconfirmed ? (
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span>Confirmed: {balances.runes?.confirmed || 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>STX Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {balances?.stx || 0} STX
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {isConnected && walletData && walletData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Wallet Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {walletData.map((account, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {account?.purpose}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 break-all">
                          {account?.address}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
