import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "StockVision",
        short_name: "StockVision",
        description: "Visualisez et suivez votre portefeuille boursier.",
        start_url: "/",
        display: "standalone",
        background_color: "#f7f8fa",
        theme_color: "#102a43",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "any maskable",
            },
        ],
    };
}
