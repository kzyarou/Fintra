import React, { createContext, useContext } from 'react';
interface SubscriptionContextType {
  isPro: boolean;
  isPrime: boolean;
}
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);
export function SubscriptionProvider({
  children


}: {children: React.ReactNode;}) {
  return (
    <SubscriptionContext.Provider
      value={{
        isPro: true,
        isPrime: true
      }}>
      
      {children}
    </SubscriptionContext.Provider>);

}
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider'
    );
  }
  return context;
}