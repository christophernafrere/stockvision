import { SelectedDayContext } from "@/context/selected-day";
import { useContext } from "react";

export function useSelectedDay() {
    const context = useContext(SelectedDayContext);

    if (!context)
        throw new Error(
            "useSelectedDay must be used inside SelectedDayProvider",
        );

    return context;
}
