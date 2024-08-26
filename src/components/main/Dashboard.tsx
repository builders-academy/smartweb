"use client";

import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  BitcoinIcon,
  CoinsIcon,
  LayersIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useConnectWalletSats } from "@/helpers/connect";
import WalletDataTable from "./WalletDataTable";
import BalanceCard from "./BalanceCard";
import SatsBalanceTable from "./SatsBalanceTable";
import StxBalanceTable from "./StxBalanceTable";
import RunesBalanceTable from "./RunesBalanceTable";
import AiRecommendations from "./AiRecommendations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { any } from "zod";

// Modal component
const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-black text-white p-6 rounded-lg max-w-lg w-full"
        style={{
          boxShadow: "0 0 20px 3px rgb(247 147 26)", // White glow effect
        }}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const {
    walletData,
    balances,
    isConnected,
    connectWallet,
    fetchBalances,
    disconnectWallet,
  } = useConnectWalletSats();
  const { toast } = useToast();

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  React.useEffect(() => {
    if (isConnected) {
      fetchBalances();
    }
  }, [isConnected, fetchBalances]);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    });
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "destructive",
    });
  };

  // Function to open modal
  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <header className="p-4 lg:p-8 bg-gradient-to-r from-[rgb(247,147,26)] to-purple-700 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Welcome to CryptoWallet</h1>
          <div className="flex gap-2">
            {isConnected ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleDisconnectWallet}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Disconnect
                </Button>
                <Link href="/Chat">
                  <Button className="bg-gradient-to-r from-[rgb(247,147,26)] to-purple-700 hover:from-purple-700 hover:to-[rgb(247,147,26)] text-white flex gap-2">
                    Get your Personal Assistant
                    <MessageSquareIcon />
                  </Button>
                </Link>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="px-4 py-2 bg-[rgb(247,147,26)] text-white rounded-md hover:bg-[rgb(250,170,40)] transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8">
        {/* Alert for when wallet is not connected */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="bg-purple-900 text-white">
              <AlertCircle className="h-4 w-4 text-[rgb(247,147,26)]" />
              <AlertTitle>Wallet not connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to view your balances and data.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Summary Section */}
        {isConnected && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <BalanceCard
                title="Sats Balance"
                icon={
                  <BitcoinIcon className="h-4 w-4 text-[rgb(247,147,26)]" />
                }
                content={<SatsBalanceTable balances={balances.btc} />}
                onClick={() =>
                  openModal(<SatsBalanceTable balances={balances.btc} />)
                }
              />
              <BalanceCard
                title="STX Balance"
                icon={<CoinsIcon className="h-4 w-4 text-[rgb(247,147,26)]" />}
                content={<StxBalanceTable balances={balances.stx} />}
                onClick={() =>
                  openModal(<StxBalanceTable balances={balances.stx} />)
                }
              />
              <BalanceCard
                title="Runes Balance"
                icon={<LayersIcon className="h-4 w-4 text-[rgb(247,147,26)]" />}
                content={<RunesBalanceTable balances={balances.runes} />}
                onClick={() =>
                  openModal(<RunesBalanceTable balances={balances.runes} />)
                }
              />
            </div>
          </div>
        )}

        {/* Data Section */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8"
          >
            <div className="space-y-4">
              {/* <AiRecommendations stxBalance={balances.stx} /> */}
            </div>

            <div className="space-y-4">
              <WalletDataTable
                walletData={walletData}
                copyToClipboard={copyToClipboard}
              />
            </div>
          </motion.div>
        )}

        {/* Modal component */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalContent}
        </Modal>
      </main>
    </div>
  );
}
