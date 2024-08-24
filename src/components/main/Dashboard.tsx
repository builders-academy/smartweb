"use client";

import React, { useState } from "react";
import { useConnectWalletSats } from "@/helpers/connect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BitcoinIcon, CoinsIcon, LayersIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import Navigation from "./Navigation";
import WalletDataTable from "./WalletDataTable";
import BalanceCard from "./BalanceCard";
import SatsBalanceTable from "./SatsBalanceTable";
import StxBalanceTable from "./StxBalanceTable";
import RunesBalanceTable from "./RunesBalanceTable";
import AiRecommendations from "./AiRecommendations";
import PerformanceInsights from "./PerformanceInsights";

export default function Dashboard() {
  const { walletData, balances, isConnected, connectWallet, disconnectWallet } =
    useConnectWalletSats();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "destructive",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation
        isConnected={isConnected}
        handleConnectWallet={handleConnectWallet}
        handleDisconnectWallet={handleDisconnectWallet}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main className="flex-1 p-4 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

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
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8"
          >
            <div className="lg:col-span-2 space-y-4">
              <WalletDataTable
                walletData={walletData}
                copyToClipboard={copyToClipboard}
              />
              <BalanceCard
                title="Sats Balance"
                icon={<BitcoinIcon className="h-4 w-4 text-muted-foreground" />}
                content={<SatsBalanceTable balances={balances.btc} />}
              />
              <BalanceCard
                title="STX Balance"
                icon={<CoinsIcon className="h-4 w-4 text-muted-foreground" />}
                content={<StxBalanceTable balances={balances.stx} />}
              />
              <BalanceCard
                title="Runes Balance"
                icon={<LayersIcon className="h-4 w-4 text-muted-foreground" />}
                content={<RunesBalanceTable balances={balances.runes} />}
              />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <AiRecommendations stxBalance={balances.stx} />
              <PerformanceInsights />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
