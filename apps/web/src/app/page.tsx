"use client";
import DaySelector from "@/components/day-selector";
import { SelectedDayProvider } from "@/context/selected-day";

export default function Home() {
    return (
        <SelectedDayProvider>
            <main>
                <h1>Bonjour Thomas</h1>
                <DaySelector />
            </main>
        </SelectedDayProvider>
    );
}
