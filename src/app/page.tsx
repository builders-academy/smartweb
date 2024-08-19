"use client";
import connectWallet from '../utils/connect';
import { UserSession } from '@stacks/connect';

export default function Home() {
  const userSession = new UserSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
                onClick={()=>connectWallet(userSession)}
                className="px-5 py-2 bg-gray-800 text-gray-300 font-medium rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
            >
                Connect Wallet
            </button>
    </main>
  );
}
