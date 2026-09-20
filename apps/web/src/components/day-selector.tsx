"use client";
import { SelectedDayContext } from "@/context/selected-day";
import { useSelectedDay } from "@/hook/use-selected-day";
import Colors from "@/lib/color";
import { DayList } from "@/lib/date-and-fn";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const days: { id: string; start: Date; end: Date; worked: boolean }[] = [
    {
        id: "1",
        worked: true,
        start: new Date("2026-09-14T08:00:00"),
        end: new Date("2026-09-14T16:00:00"),
    },
    {
        id: "2",
        worked: true,
        start: new Date("2026-09-15T08:30:00"),
        end: new Date("2026-09-15T16:30:00"),
    },
    {
        id: "3",
        worked: true,
        start: new Date("2026-09-16T09:00:00"),
        end: new Date("2026-09-16T17:00:00"),
    },
    {
        id: "4",
        worked: true,
        start: new Date("2026-09-17T13:50:00"),
        end: new Date("2026-09-17T6:50:00"),
    },
    {
        id: "5",
        worked: true,
        start: new Date("2026-09-18T09:10:00"),
        end: new Date("2026-09-18T01:10:00"),
    },
    {
        id: "6",
        worked: false,
        start: new Date("2026-09-19T08:40:00"),
        end: new Date("2026-09-19T06:40:00"),
    },
    {
        id: "7",
        worked: true,
        start: new Date("2026-09-20T09:20:00"),
        end: new Date("2026-09-20T17:20:00"),
    },
    {
        id: "8",
        worked: true,
        start: new Date("2026-09-21T14:10:00"),
        end: new Date("2026-09-21T16:10:00"),
    },
    {
        id: "9",
        worked: true,
        start: new Date("2026-09-22T15:30:00"),
        end: new Date("2026-09-22T17:30:00"),
    },
    {
        id: "10",
        worked: false,
        start: new Date("2026-09-23T08:20:00"),
        end: new Date("2026-09-23T16:20:00"),
    },
];

export default function DaySelector() {
    const { chosenDay, chooseDay } = useSelectedDay();
    useEffect(() => {
        const today = new Date();

        const defaultDay = days.find(
            (day) =>
                day.start.getFullYear() === today.getFullYear() &&
                day.start.getMonth() === today.getMonth() &&
                day.start.getDate() === today.getDate(),
        )?.id;

        console.log(defaultDay);
        if (!defaultDay) {
            throw new Error("error selection day");
        }
        chooseDay(defaultDay);
    }, []);

    return (
        <Wrapper>
            <TopSelector>
                <p>Semaine 43</p>
                <Link href="/planning">Planning complet</Link>
            </TopSelector>
            <Selector>
                {days.map((day) => (
                    <DayCard
                        $selected={chosenDay == day.id}
                        $worked={day.worked}
                        key={day.id}
                        onClick={() => {
                            chooseDay(day.id);
                        }}
                    >
                        <DayLetter
                            $selected={chosenDay == day.id}
                            $worked={day.worked}
                        >
                            {DayList[day.start.getDay()]?.abbreged}
                        </DayLetter>
                        <DayDate
                            $selected={chosenDay == day.id}
                            $worked={day.worked}
                        >
                            {day.start.getDate()}
                        </DayDate>
                        <BeginHour
                            $selected={chosenDay == day.id}
                            $worked={day.worked}
                        >
                            {day.worked
                                ? `${day.start.getHours() < 10 ? "0" : ""}${day.start.getHours()}:${day.start.getMinutes() < 10 ? "0" : ""}${day.start.getMinutes()}`
                                : "Repos"}
                        </BeginHour>
                    </DayCard>
                ))}
            </Selector>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100%;
    padding: 16px 0;
    box-sizing: border-box;
`;
const TopSelector = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 8px;
    p {
    }

    a {
        color: red;
    }
`;
const Selector = styled.div`
    width: 100%;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    overflow-x: scroll;
`;
const DayCard = styled.div<{ $selected: boolean; $worked: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
    border: 2px solid
        ${({ $selected }) => ($selected ? Colors.border.main.primary : Colors.border.other.grey)};
    padding: 8px 16px;
    gap: 4px;
    border-radius: 16px;
    background-color: ${({ $selected, $worked }) => ($selected ? Colors.surface.accent.primary : $worked ? "white" : Colors.surface.greyDisabled)};
`;
const DayLetter = styled.div<{ $selected: boolean; $worked: boolean }>`
    color: ${({ $selected, $worked }) => ($selected ? Colors.border.main.primary : $worked ? Colors.text.brown : Colors.text.brown)};
`;
const DayDate = styled.div<{ $selected: boolean; $worked: boolean }>`
    font-size: 18px;
    font-weight: ${({ $worked }) => $worked && "Bold"};
    color: ${({ $selected }) => ($selected ? "white" : "black")};
`;
const BeginHour = styled.div<{ $selected: boolean; $worked: boolean }>`
    font-size: 14px;
    color: ${({ $selected, $worked }) => ($selected ? Colors.border.main.primary : "black")};
`;
