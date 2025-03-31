"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrencyContext, CurrencyProvider } from "@/lib/use-currency";

const queryClient = new QueryClient();

type ProvidersProps = {
  currency: CurrencyContext;
};

export const Providers = ({
  children,
  currency,
}: PropsWithChildren<ProvidersProps>) => {
  return (
    <CurrencyProvider currency={currency}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </CurrencyProvider>
  );
};
