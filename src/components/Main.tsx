"use client";
import Wallet from 'sats-connect';
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import ConnectWalletSats from "@/helpers/connect";
import RuneBalance from "@/lib/RuneBalance";

interface BalanceData {
  balance: string;
  locked: string;
  unlock_height: number;
  nonce: number;
  balance_proof: string;
  nonce_proof: string;
}

const Home: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);



  const handleConnect = async () => {
    const data = await ConnectWalletSats();
    

    const response = await Wallet.request('getBalance', undefined);

    if (response.status === 'success') {
      setBalance(response.result.total)
      console.log(response.result);
      setIsConnected(true);
    } else {
      console.error(response.error);
    }
    
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setBalance(null);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent>Click the button to connect your wallet</CardContent>
        <CardFooter>
          <Button onClick={handleConnect}>
            Connect
          </Button>
          
        </CardFooter>
      </Card>
      

    );
  }
  else{
    return (
      <div className="App flex justify-center items-center gap-4 flex-col">
        <Card>
          <CardHeader>Balance Information</CardHeader>
          <CardContent>Wallet-Balance: {balance}</CardContent>
          <Button
            onClick={handleDisconnect}
            variant="destructive"
          >
            Disconnect
          </Button>
          <Button onClick={RuneBalance}>
              RuneConnect
            </Button>
        </Card>
      </div>
    );
  }
  
};

export default Home;