"use client";

import { useState } from "react";
import Wallet, { AddressPurpose, request } from "sats-connect";
import { useLocalStorage } from "@/hooks";

export const useConnectWalletSats = () => {
  const [walletData, setWalletData] = useLocalStorage<any[]>("walletData", []);
  const [isConnected, setIsConnected] = useState(false);
  const [balances, setBalances] = useLocalStorage<any>("balances", {});

  const connectWallet = async () => {
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
      await fetchBalances(); // Fetch balances after connection
      return { status: "success", result: data.result };
    } else {
      throw new Error("Failed to get wallet accounts");
    }
  };

  const fetchBalances = async () => {
    const [btc, runes] = await Promise.all([
      request("getBalance", undefined),
      request("runes_getBalance", null),
    ]);

    const stackAddressInfo = walletData.find(
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
      btc: btc.status === "success" ? btc.result : null,
      runes: runes.status === "success" ? runes.result : null,
      stx: stxBalance,
    };
    console.log(newBalances);
    setBalances(newBalances);
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
