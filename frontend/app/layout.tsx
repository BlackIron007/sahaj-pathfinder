import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { DemoProvider } from "@/providers/demo-provider";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sahaj PathFinder - SBI Acquisition Intelligence",
  description: "Discovers MSMEs hidden inside SBI ecosystems and determines optimal acquisition strategies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased selection:bg-soft">
        <QueryProvider>
          <Suspense fallback={null}>
            <DemoProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </DemoProvider>
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
