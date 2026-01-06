import type { Metadata } from "next";
import "./globals.css";

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
            <body className="antialiased" suppressHydrationWarning>{children}</body>
        </html>
    );
}
