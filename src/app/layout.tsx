import type { Metadata } from "next";
import { AppStateProvider } from "../context/AppStateContext";
import "../index.css";

export const metadata: Metadata = {
  title: "Pause - Betting Recovery App",
  description: "A mobile-first support system to help you regain control during vulnerable moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>
          <div className="mobile-container">
            {children}
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}
