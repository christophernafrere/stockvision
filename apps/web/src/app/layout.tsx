import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PwaRegister from "./pwa-register";
import StyledComponentsRegistry from "@/lib/registery";
import TabBar from "@/layouts/tab-bar";
import GlobalStyles from "./global-styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/auth-context";

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
                    <AuthProvider>
                        <ToastContainer />
                        {children}
                        <PwaRegister />
                        <TabBar />
                        <GlobalStyles />
                    </AuthProvider>
                </body>
            </StyledComponentsRegistry>
        </html>
    );
}
