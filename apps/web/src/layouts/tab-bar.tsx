import { CalendarIcon, HomeIcon } from "lucide-react";
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
            name: "Calendar",
            link: "/",
            icon: CalendarIcon,
        },
    ];
    return (
        <TabBarContainer>
            {TabList.map((tab, i) => (
                <Tab key={i} href={tab.link}>
                    <tab.icon size={32} />
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
    justify-content: center;
    align-items: center;
    background-color: white;
    gap: 16px;
    transform: translateX(-50%);
    color: black;
    width: 80%;
    padding: 24px;
    border: 8px;
    border-radius: 8px;
    box-shadow: 0 4px 6px #0000007b;
`;

const Tab = styled(Link)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;
