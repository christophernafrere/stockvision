"use client";
import { Button } from "@/components/button";
import Input from "@/components/input";
import SwitchButton from "@/components/switch-button";
import Colors from "@/lib/color";
import {
    ArrowRight,
    AtSignIcon,
    BadgeCheckIcon,
    CakeIcon,
    CheckIcon,
    IdCardIcon,
    LockIcon,
    PhoneIcon,
    TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

export default function page() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [shopCode, setShopCode] = useState<number>();
    const [email, setEmail] = useState<string>("");
    const [dayBirth, setDayBirth] = useState<number>();
    const [monthBirth, setMonthBirth] = useState<number>();
    const [yearBirth, setYearBirth] = useState<number>();
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showBirthday, setShowBirthday] = useState<boolean>(true);

    const handleFormSubmit = async (
        e: import("react").SubmitEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        const birthday = new Date(`${monthBirth}/${dayBirth}/${yearBirth}`);

        const passwordIsCorrect = password === confirmPassword;

        if (passwordIsCorrect) {
            const payload = {
                firstName,
                lastName,
                shopCode,
                email,
                birthday,
                phone,
                password,
            };

            const response = await fetch("http://localhost:4000/auth/sign-up", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            toast.success("Bienvenue sur Auchan Planning");
            redirect("/auth/sign-in");
        } else {
            toast.error(
                "Le mot de passe et sa confirmation ne correspondent pas",
            );
        }
    };
    return (
        <Main>
            <HeadOfPage>
                <p>
                    <IdCardIcon /> Espace Colaborateur
                </p>

                <h1>Créer mon compte</h1>

                <p>
                    Renseigne tes informations pour synchroniser ton planning et
                    tes affectations de rayon
                </p>
            </HeadOfPage>

            <WarningTag>
                <WarningContainer>
                    <TriangleAlertIcon fill={Colors.text.red} stroke={"#fff"} />
                </WarningContainer>

                <WarningTextInfo>
                    <h2>E-mail professionnel Auchan obligatoire</h2>
                    <p>
                        Les adresses personnelles (Gmail, Outlook, Yahoo...)
                        sont strictement rejetées pour les raisons de sécurité
                        RH
                    </p>
                </WarningTextInfo>
            </WarningTag>
            <form onSubmit={handleFormSubmit}>
                <NameContainer>
                    <Label>
                        <InputHead>
                            Prénom <RequiredStar>*</RequiredStar>
                        </InputHead>
                        <Input
                            type="text"
                            required
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Label>
                    <Label>
                        <InputHead>
                            Nom <RequiredStar>*</RequiredStar>
                        </InputHead>
                        <Input
                            type="text"
                            required
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Label>
                </NameContainer>
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
                </Label>

                <Label>
                    <InputHead>
                        Identifiant Vendeur
                        <NeededTag $needed>Obligatoire</NeededTag>
                    </InputHead>
                    <Input
                        type="number"
                        CheckIcon={CheckIcon}
                        required
                        onChange={(e) => setShopCode(Number(e.target.value))}
                    />
                </Label>
                <BirthdaySection>
                    <InputHead>
                        Date de naissance
                        <NeededTag $needed>Obligatoire</NeededTag>
                    </InputHead>
                    <BirthdayInputContainer>
                        <Label>
                            <Input
                                type="number"
                                placeholder="JJ"
                                onChange={(e) =>
                                    setDayBirth(Number(e.target.value))
                                }
                            />
                            Jour
                        </Label>
                        <Label>
                            <Input
                                type="number"
                                placeholder="MM"
                                onChange={(e) =>
                                    setMonthBirth(Number(e.target.value))
                                }
                            />
                            Mois
                        </Label>
                        <Label>
                            <Input
                                type="number"
                                placeholder="AAAA"
                                onChange={(e) =>
                                    setYearBirth(Number(e.target.value))
                                }
                            />
                            Année
                        </Label>
                    </BirthdayInputContainer>
                </BirthdaySection>

                <Label>
                    <InputHead>
                        Numéro de téléphone
                        <NeededTag>Facultatif</NeededTag>
                    </InputHead>
                    <Input
                        type="tel"
                        Icon={PhoneIcon}
                        CheckIcon={CheckIcon}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                        isValid
                    />
                </Label>
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

                <Label>
                    <InputHead>
                        Confirmer le mot de passe
                        <NeededTag $needed>Obligatoire</NeededTag>
                    </InputHead>
                    <Input
                        showButton
                        Icon={LockIcon}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Label>

                <BirthdayShowContainer>
                    <IconContainer>
                        <CakeIcon />
                    </IconContainer>

                    <ShowBirthdayText>
                        <h3>
                            Afficher mon anniversaire a mes collègues d'équipe
                        </h3>
                        <p>
                            Modifiable à tout moment dans Profil{" > "}{" "}
                            confidentialité
                        </p>
                    </ShowBirthdayText>
                    <SwitchButton
                        onChange={() => setShowBirthday((v) => !v)}
                        value={showBirthday}
                    />
                </BirthdayShowContainer>

                <Button $cta>
                    Créer mon compte <ArrowRight />
                </Button>

                <ConnectText>
                    Déjà un compte ?{" "}
                    <Link href="/auth/sign-in">Se connecter</Link>
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
