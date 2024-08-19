"use client";

import React from "react";
import { showConnect } from "@stacks/connect";
import { StacksTestnet } from "@stacks/network";
import { useUserSession } from "../hooks/useUserSession";
import { AppConfig } from "../types/stacks";
import { Button } from "@/components/ui/button";

const appConfig: AppConfig = {
  appName: "My Stacks App",
  appIconUrl: "/favicon.ico",
  network: new StacksTestnet(),
};

interface WalletConnectProps {
  onConnected: () => void;
}

export default function WalletConnect({ onConnected }: WalletConnectProps) {
  const { userSession, setUserData } = useUserSession();

  const authenticate = () => {
    showConnect({
      appDetails: {
        name: appConfig.appName,
        icon: appConfig.appIconUrl,
      },
      redirectTo: "/",
      onFinish: () => {
        const userData = userSession!.loadUserData();
        setUserData(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        onConnected();
      },
      userSession: userSession!,
    });
  };

  return <Button onClick={authenticate}>Connect Wallet</Button>;
}
