import Colors from "@/lib/color";
import { getTimeDifference } from "@/lib/date-and-fn";
import { ClockIcon, CoffeeIcon, CreditCardIcon, InfoIcon } from "lucide-react";
import styled from "styled-components";
import { Button } from "../button";

export default function DayDataSection() {
    return (
        <Container>
            <Top>
                <NextWork>
                    Prochain service
                    <span className="tag red">dans 45 mins</span>
                </NextWork>
                <Duration>7h30 prévues</Duration>
            </Top>
            <MainContainer>
                <h1>8h35 - 14h00</h1>

                <AreaData>
                    <CreditCardIcon color={Colors.text.red} />
                    Caisse automatique • <strong>Carte banquaire</strong>
                </AreaData>

                <BreakData>
                    <CoffeeIcon size={32} />
                    pause prévue : 10h15 (30 min en salle de repos)
                </BreakData>
            </MainContainer>

            <ButtonContainer>
                <Button $cta>
                    <InfoIcon size={20} /> Consulter le détail
                </Button>
                <Button>
                    <ClockIcon size={20} />
                    Signaler retard
                </Button>
            </ButtonContainer>
        </Container>
    );
}

const Container = styled.section`
    overflow: hidden;
    background-color: white;
    border-top: 4px solid red;
    position: relative;
    border-color: ${Colors.border.main.primary} !important;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 6px;
        top: 0;
        left: 0;
        background-color: ${Colors.text.red};
    }
`;

const NextWork = styled.p`
    font-size: 0.85rem;
    font-weight: 600;
    .tag.red {
        background-color: ${Colors.surface.light.primary};
        padding: 4px 8px;
        border-radius: 16px;
        margin: 0 8px;
        color: ${Colors.text.brown};
    }
`;

const Duration = styled.p`
    font-size: 0.85rem;
    font-weight: 500;
    color: ${Colors.text.brown};
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const AreaData = styled.p`
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: ${Colors.surface.grey};
    padding: 8px;
    width: max-content;
    border-radius: 12px;
    font-size: 14px;
`;

const BreakData = styled.div`
    display: flex;
    font-size: 16px;
    gap: 8px;
    align-items: center;
    color: ${Colors.text.brown};
    background-color: ${Colors.surface.light.primary}68;
    border: 1px solid #ffdbca;
    border-radius: 16px;
    padding: 24px;
    font-weight: medium;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;
    button {
        width: 100%;
    }
`;
