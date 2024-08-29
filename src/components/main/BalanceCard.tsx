import React, { useState } from "react";
import { ReactNode } from "react";

interface BalanceCardProps {
  title: string;
  icon: ReactNode;
  content: ReactNode;
  onClick: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  icon,
  content,
  onClick,
}) => {
  return (
    <div className="relative group">
      {/* Card */}
      <div
        onClick={onClick}
        className="cursor-pointer p-3 text-xs rounded-md bg-gray-800 hover:bg-purple-500 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-700 hover:border-gray-600"
      >
        <h3 className="text-lg font-semibold mb-0 flex items-center">
          {icon}
          <span className="ml-1"></span>
        </h3>
        <div className="text-gray-300 text-sm">{content}</div>
      </div>

      <div className="absolute left-0 top-full mt-2 hidden group-hover:block p-2 bg-gray-900 text-white text-sm rounded-md shadow-lg z-10 w-48">
        {title}
      </div>
    </div>
  );
};

export default BalanceCard;
