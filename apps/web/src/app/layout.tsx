import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PwaRegister from "./pwa-register";
import StyledComponentsRegistry from "@/lib/registery";
import TabBar from "@/layouts/tab-bar";
import GlobalStyles from "./global-styles";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
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
        <html lang="fr" className={` ${inter.variable}`}>
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
