import React from "react";
import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";

const PersonalAssistantCard = () => {
  return (
    <div className="bg-black text-white rounded-lg p-6 shadow-lg hover:shadow-[0_0_20px_3px_rgb(247,147,26)] transition-shadow">
      <div className="flex flex-col items-center text-center">
        <MessageSquareIcon className="h-10 w-10 text-[rgb(247,147,26)] mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your Personal Assistant</h2>
        <p className="text-muted-foreground mb-4">
          Get personalized recommendations and manage your crypto transactions
          effortlessly.
        </p>
        <Link href="/Chat">
          <button className="bg-[rgb(247,147,26)] text-black px-4 py-2 rounded-lg hover:bg-[rgb(250,170,40)] transition-colors">
            Open Assistant
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PersonalAssistantCard;
