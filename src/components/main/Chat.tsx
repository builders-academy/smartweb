"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
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
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Message = ({ content }: { content: string }) => (
  <ReactMarkdown
    rehypePlugins={[rehypeRaw]}
    components={{
      a: ({ node, ...props }) => (
        <a className="text-blue-500 hover:underline" {...props} />
      ),
      p: ({ node, ...props }) => <p className="mb-2" {...props} />,
      ul: ({ node, ...props }) => (
        <ul className="list-disc pl-4 mb-2" {...props} />
      ),
      ol: ({ node, ...props }) => (
        <ol className="list-decimal pl-4 mb-2" {...props} />
      ),
      h1: ({ node, ...props }) => (
        <h1 className="text-2xl font-bold mb-2" {...props} />
      ),
      h2: ({ node, ...props }) => (
        <h2 className="text-xl font-bold mb-2" {...props} />
      ),
      h3: ({ node, ...props }) => (
        <h3 className="text-lg font-bold mb-2" {...props} />
      ),
      code: ({ node, ...props }) => (
        <pre className="bg-gray-200 rounded p-2 mb-2 overflow-x-auto">
          <code {...props} />
        </pre>
      ),
      table: ({ node, ...props }) => (
        <table className="border-collapse table-auto w-full mb-2" {...props} />
      ),
      th: ({ node, ...props }) => (
        <th className="border px-4 py-2 bg-gray-100" {...props} />
      ),
      td: ({ node, ...props }) => (
        <td className="border px-4 py-2" {...props} />
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

export default function ChatComponent() {
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
  const { isConnected } = useConnectWalletSats();

  const [selectedPrompt, setSelectedPrompt] = useState("");

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
    <div className="flex flex-col h-full">
      <CardContent className="flex-grow overflow-hidden p-4">
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
                      m.role === "user" ? "bg-[rgb(247,147,26)]" : "bg-gray-600"
                    }
                  >
                    <AvatarFallback>
                      {m.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <Card
                    className={
                      m.role === "user"
                        ? "bg-[rgb(247,147,26)] text-white"
                        : "bg-gray-800 text-white"
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
              <p className="text-gray-400">
                Please connect your wallet to start chatting.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0 border-t border-gray-700 p-4">
        {isConnected && (
          <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-4">
              {existingPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt)}
                  className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
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
                className="flex-grow bg-gray-800 text-white border-gray-600"
                disabled={!isConnected}
              />
              <Button
                type="submit"
                disabled={!isConnected}
                className="bg-[rgb(247,147,26)] text-white hover:bg-[rgb(247,147,26)]/80"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </div>
  );
}
