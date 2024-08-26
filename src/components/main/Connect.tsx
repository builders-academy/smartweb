"use client";

import { useRouter } from "next/navigation";
import { useConnectWalletSats } from "@/helpers/connect";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const GraphLine = () => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setKey((prevKey) => prevKey + 1);
    }, 80000); // Restart animation every 30 seconds

    return () => clearInterval(timer);
  }, []);

  const generatePointyBitcoinPath = () => {
    let path = "M0 80 ";
    let y = 80;
    const points = [];
    for (let i = 1; i <= 200; i++) {
      const x = i * 10;
      // Create more dramatic changes for a pointy effect
      y += (Math.random() - 0.5) * 10;
      y = Math.max(10, Math.min(90, y));

      // Add sudden spikes occasionally
      if (Math.random() < 0.1) {
        const spikeHeight = (Math.random() - 0.5) * 30;
        path += `L${x} ${y} L${x + 5} ${y + spikeHeight} `;
        y += spikeHeight / 2; // Adjust the baseline after a spike
      } else {
        path += `L${x} ${y} `;
      }

      // Add points at random intervals
      if (Math.random() < 0.2) {
        points.push({ x, y });
      }
    }
    return { path, points };
  };

  const { path: bitcoinPath, points } = generatePointyBitcoinPath();

  return (
    <g key={key}>
      <defs>
        <linearGradient id="graphGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="Purple" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>
        <clipPath id="graphClip">
          <rect x="0" y="0" width="1000" height="100" />
        </clipPath>
      </defs>
      <g clipPath="url(#graphClip)">
        <motion.path
          d={bitcoinPath}
          fill="none"
          stroke="White"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ x: 0 }}
          animate={{ x: -1000 }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        />
        <motion.path
          d={`${bitcoinPath} L2000 100 L0 100 Z`}
          fill="url(#graphGradient)"
          initial={{ x: 0 }}
          animate={{ x: -1000 }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        />
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="0.`1`"
            fill="white"
            initial={{ x: 0 }}
            animate={{ x: -1000 }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          />
        ))}
      </g>
    </g>
  );
};

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
    <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Go to Dashboard Button */}
      {isConnected && (
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-[rgb(247,147,26)] to-purple-700 hover:from-purple-700 hover:to-[rgb(247,147,26)] text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300"
          >
            Go to Dashboard
          </Button>
        </div>
      )}

      {/* Animated graph background */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1000 100"
        aria-hidden="true"
      >
        <GraphLine />
      </svg>

      {/* Content */}
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
