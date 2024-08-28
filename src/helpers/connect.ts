import { useState, useEffect, useCallback } from "react";
import Wallet, { AddressPurpose, request } from "sats-connect";
import { useLocalStorage } from "@/hooks";
import { swapAgent } from "@/ai/agents/swapAgent";
import { liquidityAgent } from "@/ai/agents/liquidityAgent";
import Cookies from "js-cookie";

export const useConnectWalletSats = () => {
  const [walletData, setWalletData] = useLocalStorage<any[]>("walletData", []);
  const [balances, setBalances] = useLocalStorage<any>("balances", {});
  const [isConnected, setIsConnected] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useLocalStorage<any>(
    "aiRecommendations",
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchBalances = useCallback(
    async (currentWalletData = walletData) => {
      if (currentWalletData.length === 0) return;

      try {
        const [btc, runes] = await Promise.all([
          request("getBalance", undefined),
          request("runes_getBalance", null),
        ]);

        const stackAddressInfo = currentWalletData.find(
          (address) => address.purpose === AddressPurpose.Stacks
        );
        const stackAddress = stackAddressInfo?.address;

        let stxBalance = null;
        if (stackAddress) {
          const res = await fetch(
            `https://api.hiro.so/extended/v1/address/SP15GXS91AWJ4X5ZQNNE4DQ94MWVFMD3E6AA1SM36/balances`
          );
          if (res.ok) {
            const data = await res.json();
            stxBalance = data;
          } else {
            console.error(
              "Failed to fetch STX balance:",
              res.status,
              res.statusText
            );
          }
        }

        const newBalances = {
          btc:
            btc.status === "success" ? btc.result : "Failed to fetch balance",
          runes:
            runes.status === "success"
              ? runes.result.balances
              : "Failed to fetch balance",
          stx: stxBalance,
        };
        setBalances(newBalances);
        return newBalances;
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    },
    [walletData, setBalances]
  );

  const fetchAiRecommendations = useCallback(
    async (stxBalance: {
      stx: any;
      fungible_tokens: any;
      non_fungible_tokens: any;
    }) => {
      try {
        const swapAgentExecutor = await swapAgent();
        const liquidityAgentExecutor = await liquidityAgent();

        const [swapResponse, liquidityResponse] = await Promise.all([
          swapAgentExecutor(`I have the following assets:
        ${JSON.stringify(stxBalance.stx)} STX, ${JSON.stringify(
            stxBalance.fungible_tokens
          )}, ${JSON.stringify(stxBalance.non_fungible_tokens)} 
        Given my current assets and the swap options available on Alex, which swap would be the most beneficial for me to maximize my returns or achieve the best outcome based on the current market rates and swap fees?
        Please provide a detailed analysis considering potential profit, fees, and any other factors that might affect the decision.`),
          liquidityAgentExecutor(`I have the following assets:
        ${JSON.stringify(stxBalance.stx)} STX, ${JSON.stringify(
            stxBalance.fungible_tokens
          )}, ${JSON.stringify(stxBalance.non_fungible_tokens)} 
        Given my current assets and the liquidity options available on Alex, what are the best liquidity provision strategies for me to maximize returns while minimizing risks?
        Please provide a detailed analysis considering potential earnings, impermanent loss, and other relevant factors.`),
        ]);

        setAiRecommendations({
          swapRecommendations: swapResponse.recommendations,
          liquidityRecommendations: liquidityResponse.recommendations,
        });
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
      }
    },
    [setAiRecommendations]
  );

  const connectWallet = async () => {
    if (isInitialized) return { status: "success", result: walletData };

    try {
      const data = await Wallet.request("getAccounts", {
        purposes: [
          AddressPurpose.Ordinals,
          AddressPurpose.Stacks,
          AddressPurpose.Payment,
        ],
      });

      if (data.status === "success") {
        setWalletData(data.result ?? []);
        setIsConnected(true);
        const newBalances = await fetchBalances(data.result);
        if (newBalances && newBalances.stx) {
          await fetchAiRecommendations(newBalances.stx);
        }
        setIsInitialized(true);

        // Set the wallet_connected cookie
        Cookies.set("wallet_connected", "true", { expires: 1 }); // Expires in 1 day

        return { status: "success", result: data.result };
      } else {
        throw new Error("Failed to get wallet accounts");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletData([]);
    setBalances({});
    setAiRecommendations(null);
    setIsInitialized(false);

    // Clear all relevant data from localStorage
    localStorage.removeItem("walletData");
    localStorage.removeItem("balances");
    localStorage.removeItem("aiRecommendations");

    // Remove the wallet_connected cookie
    Cookies.remove("wallet_connected");
  };

  useEffect(() => {
    if (walletData.length > 0 && !isInitialized) {
      setIsConnected(true);
      fetchBalances();
      setIsInitialized(true);
    }
  }, [walletData, isInitialized, fetchBalances]);

  return {
    walletData,
    balances,
    isConnected,
    connectWallet,
    disconnectWallet,
    aiRecommendations,
  };
};
