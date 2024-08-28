import React from "react";
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
    <div
      onClick={onClick}
      className="cursor-pointer p-4 text-sm rounded-lg bg-gray-800 hover:bg-purple-500 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-700 hover:border-gray-600"
    >
      <h3 className="text-xl font-semibold mb-1 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="text-gray-300">{content}</div>
    </div>
  );
};

export default BalanceCard;
