import Colors from "@/lib/color";
import { ClockIcon } from "lucide-react";
import React from "react";
import styled from "styled-components";

export default function HourManagementSection() {
    return (
        <Container>
            <SectionHeader>
                <Title>
                    <ClockIcon />
                    Modulation des heures
                </Title>

                <Period>Période S36 - S52</Period>
            </SectionHeader>

            <DataOverview>
                <div>
                    <h3>Heures de la semaines</h3>

                    <SelectedWeekData>
                        <span>31h30</span> / 35h00 réf.
                    </SelectedWeekData>
                </div>
                <div>
                    <CurrentAmountTag>+4h35</CurrentAmountTag>
                    <p>solde modulation</p>
                </div>
            </DataOverview>
        </Container>
    );
}

const Container = styled.section`
    background-color: ${Colors.border.other.grey};
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const Title = styled.h2`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Period = styled.p`
    color: ${Colors.text.brown};
`;

const DataOverview = styled.div`
    display: flex;
    justify-content: space-between;
    div {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
`;

const SelectedWeekData = styled.p`
    color: ${Colors.text.brown};
    span {
        font-weight: 800;
        color: ${Colors.border};
        font-size: 24px;
    }
`;
const CurrentAmountTag = styled.p`
    width: max-content;
    padding: 4px 16px;
    border-radius: 16px;
    margin-left: auto;
    background-color: ${Colors.surface.light.secondary};
`;
