"use client";

import { useUserSession } from "../hooks/useUserSession";
import { useBalanceData } from "../hooks/useBalanceData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WalletConnect from "./WalletConnect";

export default function WalletDashboard() {
  const { userSession, userData, setUserData } = useUserSession();
  const { balanceData, isLoading, error, fetchBalanceData } =
    useBalanceData(userData);

  const disconnect = () => {
    userSession?.signUserOut("/");
    setUserData(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("balanceData");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Smart Wallet</h1>
          {userData && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={disconnect}>
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {userData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>STX Balance</CardTitle>
                <CardDescription>Your current STX balance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {balanceData
                    ? `${balanceData.stx.balance} STX`
                    : "Loading..."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Sent</CardTitle>
                <CardDescription>
                  Total STX sent from this wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {balanceData
                    ? `${balanceData.stx.total_sent} STX`
                    : "Loading..."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Received</CardTitle>
                <CardDescription>
                  Total STX received to this wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {balanceData
                    ? `${balanceData.stx.total_received} STX`
                    : "Loading..."}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your Stacks wallet to view your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WalletConnect onConnected={fetchBalanceData} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
