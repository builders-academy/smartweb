"use client";

import NetworkBackground from "@/helpers/ConnectBG";
import { useRouter } from "next/navigation";
import { useConnectWalletSats } from "@/helpers/connect";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Component() {
  const { toast } = useToast();
  const { isConnected, connectWallet } = useConnectWalletSats();
  const router = useRouter();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      router.push("/dashboard");
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

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center">
      <NetworkBackground />

      <div className="z-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          Welcome to SmartWallet
        </h1>
        {isConnected ? (
          <Link href="/dashboard">
            <Button>Redirecting you to dashboard.......</Button>
          </Link>
        ) : (
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        )}
      </div>
    </div>
  );
}
