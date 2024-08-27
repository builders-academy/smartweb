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
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-black text-white p-6 rounded-lg max-w-lg w-full"
        style={{
          boxShadow: "0 0 20px 3px rgb(247 147 26)",
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
    disconnectWallet,
    aiRecommendations,
  } = useConnectWalletSats();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const router = useRouter();

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
    router.push("/");
  };

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 lg:p-8 bg-gradient-to-r from-[rgb(247,147,26)] to-purple-700 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Welcome to CryptoWallet</h1>
          <div className="flex gap-2">
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
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8">
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

        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8"
          >
            <div className="space-y-4">
              <AiRecommendations
                recommendations={aiRecommendations}
                isLoading={false}
              />
            </div>

            <div className="space-y-4">
              <WalletDataTable
                walletData={walletData}
                copyToClipboard={copyToClipboard}
              />
            </div>
          </motion.div>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalContent}
        </Modal>
      </main>
    </div>
  );
}
