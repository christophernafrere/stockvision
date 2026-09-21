import React from "react";

export default function Popup({
    isOpen,
    openPopup,
    closePopup,
    children,
}: {
    isOpen: boolean;
    openPopup: () => void;
    closePopup: () => void;
    children: React.ReactNode;
}) {
    return <div>{children}</div>;
}
