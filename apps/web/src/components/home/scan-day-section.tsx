import Colors from "@/lib/color";
import React from "react";
import styled from "styled-components";
import { Button } from "../button";
import { ScanTextIcon } from "lucide-react";

export default function ScanDaySection() {
    return (
        <Container>
            <h2>Placement du jour • LSA CB</h2>

            <p>
                Le tableau de placement papier n&apos;a pas encore été partagé
                avec l'équipe.
            </p>

            <Button $cta>
                <ScanTextIcon />
                Scanner le placement (IA)
            </Button>

            <SubTitle>
                L'ia extrait automatiquement les postes créneaux et zone pour
                toute l'équipe.
            </SubTitle>
        </Container>
    );
}

const Container = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    border-color: ${Colors.border.main.primary} !important;
    background: linear-gradient(
        145deg,
        ${Colors.surface.light.primary} 30%,
        ${Colors.surface.greyDisabled} 70%
    );
`;

const SubTitle = styled.p`
    text-align: center;
    font-size: 14px;
    width: 80%;
    margin: auto;
`;
