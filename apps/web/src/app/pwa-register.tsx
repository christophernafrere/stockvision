"use client";

import { useEffect } from "react";

export default function PwaRegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(() => {
                // Service workers are optional during local development.
            });
        }
    }, []);

    return null;
}
