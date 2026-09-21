"use client";
import DaySelector from "@/components/home/day-selector";
import DayDataSection from "@/components/home/day-data-section";
import { SelectedDayProvider } from "@/context/selected-day";
import Colors from "@/lib/color";
import styled from "styled-components";
import ScanDaySection from "@/components/home/scan-day-section";

export default function Home() {
    return (
        <Main>
            <SelectedDayProvider>
                <h1>Bonjour Thomas</h1>
                <DaySelector />
                <DayDataSection />
                <ScanDaySection />
            </SelectedDayProvider>
        </Main>
    );
}

const Main = styled.main`
    display: flex;
    flex-direction: column;
    gap: 8px;
    section {
        box-shadow: 0 2px 8px ${Colors.text.black}22;
        border: 3px solid white;
        border-radius: 16px;
        padding: 18px 14px;
        background-color: white;
        box-sizing: border-box;
    }
`;
