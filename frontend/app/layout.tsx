import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";

export const metadata: Metadata = {
  title: "Sahaj PathFinder — SBI Acquisition Intelligence",
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
          <div className="min-h-screen flex flex-col">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <TopNav />
              <main className="flex-1 ml-64 p-8">
                {children}
              </main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
