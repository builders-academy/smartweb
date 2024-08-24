import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bitcoin, MenuIcon, WalletIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface NavigationProps {
  isConnected: boolean;
  handleConnectWallet: () => void;
  handleDisconnectWallet: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function Navigation({
  isConnected,
  handleConnectWallet,
  handleDisconnectWallet,
  isMenuOpen,
  setIsMenuOpen,
}: NavigationProps) {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl flex gap-0">
              <Bitcoin />
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/analytics" className="text-sm font-medium">
              Analytics
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About Us
            </Link>
            <Link href="/help" className="text-sm font-medium">
              Help
            </Link>
          </div>
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through our platform
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <Link
                    href="/"
                    className="block text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/analytics"
                    className="block text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/about"
                    className="block text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/help"
                    className="block text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Help
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isConnected ? (
              <Button onClick={handleDisconnectWallet} variant="destructive">
                Disconnect Wallet
              </Button>
            ) : (
              <Button onClick={handleConnectWallet}>
                <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
