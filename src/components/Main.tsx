"use client";
import React, { useEffect, useState } from "react";
import { Address, AddressPurpose, BitcoinNetworkType } from "sats-connect";
import { useLocalStorage } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  connectWallet,
  disconnectWallet,
  fetchBalance,
} from "@/helpers/wallet";

interface BalanceData {
  balance: string;
  locked: string;
  unlock_height: number;
  nonce: number;
  balance_proof: string;
  nonce_proof: string;
}

const Home: React.FC = () => {
  const network = BitcoinNetworkType.Mainnet;
  const [addressInfo, setAddressInfo] = useLocalStorage<Address[]>(
    "addresses",
    []
  );
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);

  const isConnected = addressInfo.length > 0;

  const stackAddressInfo = addressInfo.find(
    (address) => address.purpose === AddressPurpose.Stacks
  );

  const stackAddress = stackAddressInfo?.address;

  useEffect(() => {
    if (stackAddress) {
      fetchBalance(stackAddress, setBalanceData);
    }
  }, [stackAddress]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>Connected to {network}</CardHeader>
        <CardContent>Click the button to connect your wallet</CardContent>
        <CardFooter>
          <Button onClick={() => connectWallet(network, setAddressInfo)}>
            Connect
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="App flex justify-center items-center gap-4 flex-col">
      {balanceData && (
        <Card>
          <CardHeader>Balance Information</CardHeader>
          <CardContent> Stx-Balance: {balanceData.balance}</CardContent>
          <Button
            onClick={() => disconnectWallet(setAddressInfo, setBalanceData)}
            variant="destructive"
          >
            Disconnect
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Home;
