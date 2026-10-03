import Colors from "@/lib/color";
import React from "react";
import styled from "styled-components";

export default function SwitchButton({
    onChange,
    value,
}: {
    onChange: () => void;
    value: boolean;
}) {
    return (
        <Container $isOk={value} onClick={onChange}>
            <Switcher $isOk={value} />
        </Container>
    );
}

const Container = styled.div<{ $isOk: boolean }>`
    position: relative;
    width: 5rem;
    height: 2.5rem;
    background-color: ${({ $isOk }) => ($isOk ? Colors.surface.accent.primary : "white")};
    border-radius: 64px;
    display: flex;
    border: 2px solid ${Colors.border.main.primary};
`;

const Switcher = styled.div<{ $isOk: boolean }>`
    position: absolute;
    width: 1.8rem;
    height: 1.8rem;
    background-color: white;
    border: 1px solid black;
    border-radius: 32px;
    top: 50%;
    transform: translateY(-50%);

    left: ${({ $isOk }) => ($isOk ? "calc(100% - 1.8rem - 4px)" : "4px")};
    transition: left 250ms ease-in-out;
`;
