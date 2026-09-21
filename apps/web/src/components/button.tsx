import Colors from "@/lib/color";
import styled from "styled-components";

export const Button = styled.button<{ $cta?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 4px;
    gap: 4px;
    border-radius: 16px;
    background-color: ${({ $cta }) => ($cta ? Colors.surface.accent.primary : Colors.surface.greyDisabled)};
    color: ${({ $cta }) => ($cta ? "white" : Colors.text.red)};
    font-weight: 700;
    border: 2px solid ${Colors.border.main.primary};
    cursor: pointer;
`;
