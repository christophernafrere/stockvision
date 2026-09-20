import { createContext, ReactNode, useState } from "react";

export const SelectedDayContext = createContext<{
    chosenDay: string | null;
    chooseDay: (_chosenDay: string) => void;
} | null>(null);

export function SelectedDayProvider({ children }: { children: ReactNode }) {
    const [chosenDay, setChosenDay] = useState<string | null>(null);

    const chooseDay = (_chosenDay: string) => {
        setChosenDay(_chosenDay);
    };

    return (
        <SelectedDayContext.Provider value={{ chosenDay, chooseDay }}>
            {children}
        </SelectedDayContext.Provider>
    );
}
