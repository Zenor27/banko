import type React from "react";
import { PropsWithChildren } from "react";
import { Navbar } from "@/components/navbar";

export function Shell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 border-b bg-background z-10">
        <div className="px-8 flex h-16 items-center">
          <Navbar />
        </div>
      </header>
      <main className="flex-1">
        <div className="px-8 py-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
