"use client";
import { Button } from "@/components/button";
import Input from "@/components/input";
import Colors from "@/lib/color";
import { ArrowRight, AtSignIcon, BadgeCheckIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

export default function page() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleFormSubmit = async (
        e: import("react").SubmitEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        const payload = {
            email,
            password,
        };

        const response = await fetch("http://localhost:4000/auth/sign-in", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
        });

        redirect("/");
    };
    return (
        <Main>
            <HeadOfPage>
                <h1>Bon Retour parmis nous</h1>

                <p>
                    Accède à ton planning, tes heures modulées et ton équipe en
                    magasin.
                </p>
            </HeadOfPage>

            <form onSubmit={handleFormSubmit}>
                <Label>
                    <InputHead>
                        E-mail professionnel auchan
                        <NeededTag $needed>Obligatoire</NeededTag>
                    </InputHead>
                    <Input
                        type="email"
                        Icon={AtSignIcon}
                        CheckIcon={BadgeCheckIcon}
                        fill
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Label>{" "}
                <Label>
                    <InputHead>
                        Mot de passe
                        <NeededTag $needed>Obligatoire</NeededTag>
                    </InputHead>
                    <Input
                        showButton
                        Icon={LockIcon}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Label>
                <Button $cta>
                    Créer mon compte <ArrowRight />
                </Button>
                <ConnectText>
                    Pas encore de compte ?{" "}
                    <Link href="/auth/sign-in">Inscrivez vous</Link>
                </ConnectText>
            </form>
        </Main>
    );
}

const Main = styled.main`
    display: flex;
    flex-direction: column;
    gap: 12px;

    form {
        display: flex;
        flex-direction: column;
        gap: 12px;

        button {
            width: 100%;
            font-size: 18px;
            padding: 12px;
            border-radius: 50px;
        }
    }
`;
const WarningTag = styled.div`
    display: flex;
    background-color: ${Colors.surface.light.primary}66;

    border: 2px solid ${Colors.text.red}33;
    gap: 8px;
    padding: 8px;
    border-radius: 16px;
`;
const WarningContainer = styled.div`
    background-color: white;
    padding: 4px;
    width: max-content;
    height: max-content;
    border-radius: 8px;
`;
const WarningTextInfo = styled.div`
    h2 {
        color: ${Colors.text.brown};
        font-size: 18px;
    }

    p {
        font-size: 14px;
        color: ${Colors.text.red};
    }
`;

const HeadOfPage = styled.div``;

const NameContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
`;

const NeededTag = styled.p<{ $needed?: boolean }>`
    font-size: 12px;
    font-weight: 700;
    color: ${({ $needed }) => ($needed ? Colors.text.red : Colors.text.brown)};
    background-color: ${({ $needed }) => ($needed ? Colors.surface.light.primary : Colors.surface.greyBlue)};
    padding: 4px 8px;
    width: max-content;
    border-radius: 4px;
`;

const InputHead = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    font-size: 16px;
`;

const RequiredStar = styled.p`
    color: ${Colors.text.red};
`;

const BirthdaySection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const BirthdayInputContainer = styled.div`
    display: flex;
    gap: 8px;

    label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: ${Colors.text.brown};
        input {
            text-align: center;
        }
    }
`;

const BirthdayShowContainer = styled.div`
    display: flex;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid ${Colors.border.main.primary};
    background-color: white;
`;
const IconContainer = styled.div``;

const ShowBirthdayText = styled.div`
    width: 100%;
    h3 {
        font-size: 16px;
    }
    p {
        font-size: 14px;
    }
`;

const ConnectText = styled.p`
    text-align: center;
    font-size: 14px;
    color: ${Colors.text.brown};

    a {
        color: ${Colors.text.red};
        text-decoration: underline;
    }
`;
