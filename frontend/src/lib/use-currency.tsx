"use client";

import { useContext, createContext } from "react";

export type CurrencyContext = {
  currencyLabel: string;
  currencySymbol: string;
  currencyCode: string;
};

const CurrencyContext = createContext<CurrencyContext | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

const getLanguage = () => {
  return navigator.languages[0] || "en-US";
};

export const useAmountFormatter = () => {
  const currency = useCurrency();

  const amountFormatter = (amount: number) => {
    return new Intl.NumberFormat(getLanguage(), {
      style: "currency",
      currency: currency.currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return { amountFormatter };
};

export const CurrencyProvider = ({
  children,
  currency,
}: {
  children: React.ReactNode;
  currency: CurrencyContext;
}) => {
  return (
    <CurrencyContext.Provider value={{ ...currency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
