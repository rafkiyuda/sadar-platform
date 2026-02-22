import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/components/providers/ThemeProvider";

export const metadata: Metadata = {
    title: "SADAR - Driver Safety Assistant",
    description: "SADAR sebelum terlambat. AI-powered driver safety assistant.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased" suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
