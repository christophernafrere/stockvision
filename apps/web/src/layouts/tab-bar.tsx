import { CalendarIcon, HomeIcon, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import styled from "styled-components";

export default function TabBar() {
    const TabList = [
        {
            name: "Acceuil",
            link: "/",
            icon: HomeIcon,
        },
        {
            name: "Planning",
            link: "/Planning",
            icon: CalendarIcon,
        },
        {
            name: "Collègue",
            link: "/collegue",
            icon: UsersIcon,
        },
        {
            name: "Profil",
            link: "/profil",
            icon: UserIcon,
        },
    ];
    return (
        <TabBarContainer>
            {TabList.map((tab, i) => (
                <Tab key={i} href={tab.link}>
                    <tab.icon size={24} />
                    <h3>{tab.name}</h3>
                </Tab>
            ))}
        </TabBarContainer>
    );
}

const TabBarContainer = styled.nav`
    position: fixed;
    bottom: 32px;
    left: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    gap: 16px;
    transform: translateX(-50%);
    color: black;
    width: 80%;
    padding: 8px 16px;
    border: 8px;
    box-shadow: 0 4px 6px #0000007b;
    border-radius: 64px;
`;

const Tab = styled(Link)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-size: 12px;
`;
