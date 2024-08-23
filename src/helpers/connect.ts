"use client";

import { useState, useEffect } from "react";
import Wallet, { AddressPurpose, request } from "sats-connect";
import { useLocalStorage } from "@/hooks";

export const useConnectWalletSats = () => {
  const [walletData, setWalletData] = useLocalStorage<any[]>("walletData", []);
  const [balances, setBalances] = useLocalStorage<any>("balances", {});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (walletData.length > 0) {
      setIsConnected(true);
    }
  }, [walletData]);

  const connectWallet = async () => {
    try {
      const data = await Wallet.request("getAccounts", {
        purposes: [
          AddressPurpose.Ordinals,
          AddressPurpose.Stacks,
          AddressPurpose.Payment,
        ],
      });

      if (data.status === "success") {
        console.log(data);
        setWalletData(data.result ?? []);
        setIsConnected(true);
        await fetchBalances(data.result); // Pass the new wallet data
        return { status: "success", result: data.result };
      } else {
        throw new Error("Failed to get wallet accounts");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  const fetchBalances = async (currentWalletData = walletData) => {
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
          `https://api.mainnet.hiro.so/v2/accounts/${stackAddress}`
        );
        if (res.ok) {
          const data = await res.json();
          stxBalance = data.balance;
        } else {
          console.error(
            "Failed to fetch STX balance:",
            res.status,
            res.statusText
          );
        }
      }

      const newBalances = {
        btc: btc.status === "success" ? btc.result : "Failed to fetch balance",
        runes:
          runes.status === "success"
            ? runes.result.balances
            : "Failed to fetch balance  ",
        stx: stxBalance,
      };
      console.log(newBalances.runes);
      setBalances(newBalances);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletData([]);
    setBalances({});
  };

  return {
    walletData,
    balances,
    isConnected,
    connectWallet,
    disconnectWallet,
    fetchBalances,
  };
};
