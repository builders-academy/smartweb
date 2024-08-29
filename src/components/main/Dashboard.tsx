"use client";
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  BitcoinIcon,
  CoinsIcon,
  LayersIcon,
  MessageSquareIcon,
  WalletIcon,
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
import Chat from "@/components/main/Chat";

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
            className="text-black-400 hover:text-black-200"
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
    <div className="min-h-screen bg-black-900 text-black-100">
      <header className="p-4 lg:p-6 bg-gray-900 text-gray-100 shadow-lg border-b-2 border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center font-poppins">
            <WalletIcon className="mr-2 h-8 w-8 text-white-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              SMART
              <span className="text-[rgb(247,147,26)]">WALLET</span>
            </span>
          </h1>

          <div className="flex gap-2">
            <div className="flex gap-3">
              <BalanceCard
                title="BitCoin Holdings"
                icon={
                  <BitcoinIcon className="h-4 w-6 text-[rgb(247,147,26)]" />
                }
                content=""
                onClick={() =>
                  openModal(<SatsBalanceTable balances={balances.btc} />)
                }
              />
              <BalanceCard
                title="STX Balance"
                icon={<CoinsIcon className="h-4 w-6 text-[rgb(247,147,26)]" />}
                content=""
                onClick={() =>
                  openModal(<StxBalanceTable balances={balances.stx} />)
                }
              />
              <BalanceCard
                title="Runes Balance"
                icon={<LayersIcon className="h-4 w-6 text-[rgb(247,147,26)]" />}
                content=""
                onClick={() =>
                  openModal(<RunesBalanceTable balances={balances.runes} />)
                }
              />
            </div>
            <Button
              onClick={handleDisconnectWallet}
              className="bg-purple-700 text-gray-100 hover:bg-purple-600 transition-colors duration-300 font-poppins"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-6">
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="bg-black-800 text-black-100 border-[rgb(247,147,26)] border-2">
              <AlertCircle className="h-5 w-5 text-[rgb(247,147,26)]" />
              <AlertTitle className="text-lg font-semibold">
                Wallet not connected
              </AlertTitle>
              <AlertDescription className="text-black-300">
                Connect your wallet to view your crypto assets and data.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {isConnected && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 mb-8">
              <div className="flex flex-col gap-4">
                <div>
                  <div>
                    <WalletDataTable
                      walletData={walletData}
                      copyToClipboard={copyToClipboard}
                    />
                  </div>
                </div>

                <Chat />
              </div>
              <div className="">
                <AiRecommendations
                  recommendations={aiRecommendations}
                  isLoading={false}
                />
              </div>
            </div>
          </>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {modalContent}
        </Modal>
      </main>
    </div>
  );
}
