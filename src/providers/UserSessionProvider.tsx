"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AppConfig, UserSession } from "@stacks/auth";
import { UserData } from "@/types/stacks";

interface UserSessionContextType {
  userSession: UserSession | null;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const UserSessionContext = createContext<UserSessionContextType | null>(
  null
);

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const appConfig = new AppConfig(["store_write", "publish_data"]);
    const session = new UserSession({ appConfig });
    setUserSession(session);

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  return (
    <UserSessionContext.Provider value={{ userSession, userData, setUserData }}>
      {children}
    </UserSessionContext.Provider>
  );
}
