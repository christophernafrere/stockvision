"use client";
import Colors from "@/lib/color";
import { EyeDashedIcon, EyeIcon, EyeOffIcon, LucideIcon } from "lucide-react";
import React, { useState } from "react";
import styled from "styled-components";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    Icon?: LucideIcon;
    showButton?: boolean;
    CheckIcon?: LucideIcon;
    isValid?: boolean;
    InvalidIcon?: LucideIcon;
    fill?: boolean;
}

export default function Input({
    Icon,
    CheckIcon,
    InvalidIcon,
    type,
    showButton,
    placeholder,
    required,
    isValid,
    fill,
    onChange,
}: InputProps) {
    const [show, setShow] = useState<boolean>(false);
    return (
        <InputContainer $isValid={isValid}>
            {Icon && <Icon size={20} color={`${Colors.text.brown}AA`} />}
            <input
                type={showButton ? (show ? "text" : "password") : type}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
            {CheckIcon && (
                <CheckIcon
                    size={fill ? 28 : 20}
                    fill={fill ? Colors.text.green : "#ffffff"}
                    stroke={fill ? "#fff" : Colors.text.green}
                />
            )}
            {InvalidIcon && <InvalidIcon size={20} />}
            {showButton && (
                <ShowButton type="button" onClick={() => setShow((v) => !v)}>
                    {show ? (
                        <EyeIcon size={20} color={Colors.border.other.brown} />
                    ) : (
                        <EyeOffIcon size={20} color={Colors.text.brown} />
                    )}
                </ShowButton>
            )}
        </InputContainer>
    );
}

const InputContainer = styled.div<{ $isValid?: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    border: ${({ $isValid }) => ($isValid ? ` 1px solid ${Colors.text.green}AA` : `1px solid ${Colors.border.main.primary}`)};
    background-color: white;
    box-sizing: border-box;
    border-radius: 8px;
    input {
        outline: none;
        width: 100%;
        border: none;
        font-size: 18px;
        background-color: transparent;
    }
`;

const ShowButton = styled.button`
    width: max-content !important;
    height: max-content !important;
    padding: 0 !important;
    background-color: transparent;
    border: none;
`;
