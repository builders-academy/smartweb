"use client";

import NetworkBackground from "@/helpers/ConnectBG";
import { useRouter } from "next/navigation";
import { useConnectWalletSats } from "@/helpers/connect";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Link from "next/link";

export default function Component() {
  const { toast } = useToast();
  const { isConnected, connectWallet, disconnectWallet } =
    useConnectWalletSats();
  const router = useRouter();

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "destructive",
    });
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center">
      <NetworkBackground />

      {isConnected && (
        <div className="absolute top-4 right-4">
          <Link href="/Chat">
            <Button className="bg-gradient-to-r from-[rgb(247,147,26)] to-purple-700 hover:from-purple-700 hover:to-[rgb(247,147,26)] text-white flex gap-2">
              Get your Personal Assistant
            </Button>
          </Link>
        </div>
      )}

      <div className="z-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          Welcome to CryptoWallet
        </h1>
        <Button
          onClick={isConnected ? handleDisconnectWallet : handleConnectWallet}
          className="bg-gradient-to-r from-[rgb(247,147,26)] to-purple-700 hover:from-purple-700 hover:to-[rgb(247,147,26)] text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{isConnected ? "Disconnect Wallet" : "Connect Wallet"}</span>
        </Button>
      </div>
    </div>
  );
}
