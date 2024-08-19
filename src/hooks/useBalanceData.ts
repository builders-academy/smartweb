"use client";

import { useState, useEffect } from "react";
import { UserData, BalanceData } from "@/types/stacks";

export function useBalanceData(userData: UserData | null) {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedBalanceData = localStorage.getItem("balanceData");
    if (storedBalanceData) {
      setBalanceData(JSON.parse(storedBalanceData));
    }

    if (userData) {
      fetchBalanceData();
    }
  }, [userData]);

  const fetchBalanceData = async () => {
    if (!userData) return;

    setIsLoading(true);
    setError(null);

    try {
      const address = userData.profile.stxAddress.testnet;
      const response = await fetch(
        `https://stacks-node-api.testnet.stacks.co/extended/v1/address/${address}/balances`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch balance data");
      }
      const data: BalanceData = await response.json();
      setBalanceData(data);
      localStorage.setItem("balanceData", JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { balanceData, isLoading, error, fetchBalanceData };
}
