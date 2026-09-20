"use client";
import DaySelector from "@/components/home/day-selector";
import DayDataSection from "@/components/home/day-data-section";
import { SelectedDayProvider } from "@/context/selected-day";
import Colors from "@/lib/color";
import styled from "styled-components";

export default function Home() {
    return (
        <Main>
            <SelectedDayProvider>
                <h1>Bonjour Thomas</h1>
                <DaySelector />
                <DayDataSection />
            </SelectedDayProvider>
        </Main>
    );
}

const Main = styled.main`
    section {
        box-shadow: 0 2px 8px ${Colors.text.black}22;
        border: 3px solid white;
        border-radius: 16px;
        padding: 18px 14px;
        box-sizing: border-box;
    }
`;
