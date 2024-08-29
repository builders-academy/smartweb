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
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
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
  const chatParent = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isConnected, disconnectWallet } = useConnectWalletSats();

  const [selectedPrompt, setSelectedPrompt] = useState("");
  const router = useRouter();

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight; // Ensure the chat container's scroll is at the bottom
    }
  }, [messages]);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end", // Make sure to scroll the last item fully into view
      });
    }
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
      handleSubmit(e, { data: { prompt: selectedPrompt } });
      setSelectedPrompt("");
    } else {
      handleSubmit(e);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mb-4">
          <div className="text-2xl font-bold mb-4 text-[rgb(247,147,26)]">
            Ask Any Questions You want to!!
          </div>
          <div className="text-white]">to our AI Assistant</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] pr-4" ref={chatParent}>
          {isConnected ? (
            messages.map((m, index) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                } mb-4`}
                ref={index === messages.length - 1 ? lastMessageRef : null} // Ref on the last message
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
        {isConnected && (
          <div className="mt-4 p-5">
            <div className="flex flex-wrap gap-2">
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
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleFormSubmit}
          className="flex w-full items-center space-x-2 my-2"
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
      </CardFooter>
    </Card>
  );
}
