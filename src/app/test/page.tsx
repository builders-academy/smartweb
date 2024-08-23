"use client";
import React, { useEffect, useState } from "react";
import { getAgentExecutor } from "@/ai/agents/assetEvaluation";
import {
  Address,
  AddressPurpose,
  BitcoinNetworkType,
  getAddress,
} from "sats-connect";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

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
  const [isLoading, setIsLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

  const isConnected = addressInfo.length > 0;

  const onConnect = async () => {
    getAddress({
      payload: {
        purposes: [AddressPurpose.Stacks],
        message: "DeFi Investment Agent needs your Stacks address info.",
        network: {
          type: network,
        },
      },
      onFinish: (response) => {
        setAddressInfo(response.addresses);
      },
      onCancel: () => {
        alert("User cancelled the request");
      },
    });
  };

  const onDisconnect = () => {
    setAddressInfo([]);
    setBalanceData(null);
    setAgentResponse(null);
  };

  const stackAddressInfo = addressInfo.find(
    (address) => address.purpose === AddressPurpose.Stacks
  );

  const stackAddress = stackAddressInfo?.address;

  const getBalance = async () => {
    if (!stackAddress) {
      console.error("Stack address is not defined");
      return;
    }

    try {
      const res = await fetch(
        `https://api.mainnet.hiro.so/v2/accounts/${stackAddress}`
      );
      const data: BalanceData = await res.json();
      setBalanceData(data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    if (stackAddress) {
      getBalance();
    }
  }, [stackAddress]);

  const handleAgentInvocation = async () => {
    setIsLoading(true);
    try {
      const agentExecutor = await getAgentExecutor();
      const response = await agentExecutor.invoke({
        input: `Please analyze the most advantageous DeFi investment strategies considering the current balance of ${balanceData?.balance} STX. Provide detailed recommendations for asset utilization, potential platforms, and assess the risks and opportunities associated with each strategy.`,
      });

      setAgentResponse(response.output);
    } catch (error) {
      console.error("Error invoking agent:", error);
      setAgentResponse(
        "An error occurred while generating investment advice. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>Connect to DeFi Investment Agent</CardHeader>
        <CardContent>
          Click the button to connect your Stacks wallet
        </CardContent>
        <CardFooter>
          <Button onClick={onConnect}>Connect Wallet</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {balanceData && (
        <Card>
          <CardHeader>Your Stacks Balance</CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{balanceData.balance} STX</p>
          </CardContent>
          <CardFooter>
            <Button onClick={onDisconnect} variant="destructive">
              Disconnect Wallet
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>DeFi Investment Advice</CardHeader>
        <CardContent>
          <Button
            onClick={handleAgentInvocation}
            disabled={isLoading || !balanceData}
            className="w-full"
          >
            {isLoading
              ? "Generating Advice..."
              : "Get Investment Recommendations"}
          </Button>
        </CardContent>
      </Card>

      {agentResponse && (
        <Card>
          <CardHeader>Investment Recommendations</CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{agentResponse}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Home;
