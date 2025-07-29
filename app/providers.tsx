"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {  persistor, store } from "@/lib/store";
import { useRef } from "react";

import "../lib/i18n";
import { Session } from "next-auth";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  
  const storeRef = useRef(store); 
  const persistorRef = useRef(persistor); 

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </PersistGate>
    </Provider>
  );
}
