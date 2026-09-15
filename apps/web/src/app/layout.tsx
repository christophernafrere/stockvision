import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PwaRegister from "./pwa-register";
import StyledComponentsRegistry from "@/lib/registery";
import TabBar from "@/layouts/tab-bar";
import GlobalStyles from "./global-styles";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "StockVision",
    description: "Visualisez et suivez votre portefeuille boursier.",
    manifest: "/manifest.webmanifest",
    appleWebApp: {
        capable: true,
        title: "StockVision",
        statusBarStyle: "black-translucent",
    },
    icons: {
        icon: "/icon.svg",
        apple: "/icon.svg",
    },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="fr"
            className={`${geistSans.variable} ${geistMono.variable}`}>
            <StyledComponentsRegistry>
                <body>
                    {children}
                    <PwaRegister />
                    <TabBar />
                    <GlobalStyles />
                </body>
            </StyledComponentsRegistry>
        </html>
    );
}
