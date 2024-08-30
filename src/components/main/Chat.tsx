"use client";
import Message from "@/helpers/chatconversion";
import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import Link from "next/link";
import { useConnectWalletSats } from "@/helpers/connect";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Wallet, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import NetworkBackground from "@/helpers/ConnectBG";

export default function Component() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: chatHandleSubmit,
    setInput,
  } = useChat({
    api: "/api/chat",
    onError: (e) => {
      console.log(e);
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    },
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isConnected, disconnectWallet } = useConnectWalletSats();

  const [selectedPrompt, setSelectedPrompt] = useState("");
  const router = useRouter();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "destructive",
    });
    router.push("/");
  };

  const existingPrompts = [
    "What is DeFi?",
    "How do I stake cryptocurrencies?",
    "Explain yield farming",
    "What are the risks in DeFi?",
  ];

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    setInput(prompt);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedPrompt) {
      chatHandleSubmit(e, { data: { prompt: selectedPrompt } });
      setSelectedPrompt("");
    } else {
      chatHandleSubmit(e);
    }
  };

  return (
    <Card
      className="w-full max-w-3xl mx-auto flex flex-col"
      style={{ height: "80vh" }}
    >
      <CardHeader className="flex-shrink-0">
        <CardTitle className="mb-4">
          <div className="text-2xl font-bold mb-4 text-[rgb(247,147,26)]">
            Ask Any Questions You want to!!
          </div>
          <div className="text-white]">to our AI Assistant</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          {isConnected ? (
            messages.map((m, index) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex ${
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start gap-2 max-w-[80%]`}
                >
                  <Avatar
                    className={
                      m.role === "user" ? "bg-primary" : "bg-secondary"
                    }
                  >
                    <AvatarFallback>
                      {m.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <Card
                    className={
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }
                  >
                    <CardContent className="p-3">
                      <Message content={m.content} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Please connect your wallet to start chatting.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0">
        {isConnected && (
          <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-4">
              {existingPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
            <form
              onSubmit={handleFormSubmit}
              className="flex w-full items-center space-x-2"
            >
              <Input
                placeholder="Ask about DeFi..."
                value={selectedPrompt || input}
                onChange={(e) => {
                  handleInputChange(e);
                  setSelectedPrompt("");
                }}
                className="flex-grow"
                disabled={!isConnected}
              />
              <Button type="submit" disabled={!isConnected}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
