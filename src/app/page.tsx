"use client";
import { useState } from 'react';
import connectWallet from '../utils/connect';
import { UserData, UserSession } from '@stacks/connect';

export default function Home() {
  const [userSession] = useState(new UserSession());
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleConnectWallet = async () => {
    try {
      await connectWallet(userSession);
      if (userSession.isUserSignedIn()) {
        const data = userSession.loadUserData();
        setUserData(data); 
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-gray-200 bg-black">
      {userSession.isUserSignedIn() && userData ? (
        <div className="mt-10 p-6 bg-gray-800 rounded-md w-full max-w-md text-left overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <ul className="space-y-2">
            <li className="truncate"><strong>App Private Key:</strong> {userData.appPrivateKey || 'N/A'}</li>
            <li className="truncate"><strong>Hub Url:</strong> {userData.hubUrl || 'N/A'}</li>
            <li className="truncate"><strong>ID Address:</strong> {userData.identityAddress || 'N/A'}</li>
            <li className="truncate"><strong>Wallet Provider:</strong> {userData.profile.walletProvider || 'N/A'}</li>
          </ul>
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="px-5 py-2 bg-gray-800 text-gray-300 font-medium rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
        >
          Connect Wallet
        </button>
      )}
    </main>
  );
}
