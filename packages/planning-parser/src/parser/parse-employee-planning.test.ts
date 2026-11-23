import { describe, expect, it } from "@jest/globals";
import type { PdfTextItem } from "../extractor/extract-pdf.js";
import type { DayColumn } from "./detect-days-column.js";
import type { EmployeeBlock } from "./group-into-employee-blocks.js";
import { parseEmployeePlanning } from "./parse-employee-planning.js";

function item(str: string, x: number, y: number): PdfTextItem {
    return {
        str,
        x,
        y,
        width: 20,
        height: 6,
        fontSize: 6,
        fontFamily: "serif",
        dir: "ltr",
        hasEOL: false,
    };
}

const columns: DayColumn[] = [
    {
        day: "lun",
        date: "28 sept.",
        xStart: 40,
        xEnd: 140,
        headerX: 90,
    },
    {
        day: "mer",
        date: "30 sept.",
        xStart: 340,
        xEnd: 440,
        headerX: 390,
    },
];

describe("parseEmployeePlanning", () => {
    it("attaches multiple assignments to the same badge shift", () => {
        const block: EmployeeBlock = {
            sellerId: "128",
            rows: [
                {
                    y: 120,
                    items: [
                        item("[128]", 9, 120),
                        item("07:00 à 15:15", 362, 120),
                    ],
                },
                {
                    y: 108,
                    items: [
                        item("VIRGINIA NOGUEIRA", 9, 108),
                        item("CA PRINCIPALE", 362, 108),
                        item("07:05 à 12:30", 390, 108),
                        item("MI TEMPS", 420, 108),
                        item("12:40 à 15:10", 435, 108),
                    ],
                },
            ],
        };

        const day = parseEmployeePlanning(block, [columns[1]], 2026).days[0];

        expect(day.shifts).toHaveLength(1);
        expect(day.shifts[0]).toMatchObject({
            beginHourBadge: "07:00",
            endHourBadge: "15:15",
        });
        expect(day.shifts[0].assignments).toHaveLength(2);
        expect(day.shifts[0].assignments.map((assignment) => assignment.label)).toEqual([
            "CA PRINCIPALE",
            "MI TEMPS",
        ]);
    });

    it("preserves two shifts and their assignments on the same day", () => {
        const block: EmployeeBlock = {
            sellerId: "440",
            rows: [
                {
                    y: 120,
                    items: [
                        item("[440]", 9, 120),
                        item("08:25 à 15:00", 62, 120),
                        item("10:00 à 14:00", 362, 120),
                        item("15:00 à 20:00", 413, 120),
                    ],
                },
                {
                    y: 108,
                    items: [
                        item("THI PHUONG HA", 9, 108),
                        item("Caisses en ligne", 362, 108),
                        item("10:05 à 14:00", 380, 108),
                        item("Caisses en ligne", 400, 108),
                        item("15:00 à 19:50", 420, 108),
                    ],
                },
            ],
        };

        const result = parseEmployeePlanning(block, columns, 2026);
        const day = result.days[1];

        expect(result).toMatchObject({
            sellerId: "440",
            firstName: "THI PHUONG",
            lastName: "HA",
            fullName: "THI PHUONG HA",
        });
        expect(day.date).toBe("30/09/2026");
        expect(day.shifts).toHaveLength(2);
        expect(day.shifts[0]).toMatchObject({
            beginHourBadge: "10:00",
            endHourBadge: "14:00",
        });
        expect(day.shifts[1]).toMatchObject({
            beginHourBadge: "15:00",
            endHourBadge: "20:00",
        });
        expect(day.shifts[0].assignments[0]).toMatchObject({
            label: "Caisses en ligne",
            beginHour: "10:05",
            endHour: "14:00",
        });
        expect(day.shifts[1].assignments[0]).toMatchObject({
            beginHour: "15:00",
            endHour: "19:50",
        });
    });

    it("keeps assignments on separate badge shifts", () => {
        const block: EmployeeBlock = {
            sellerId: "137",
            rows: [
                {
                    y: 120,
                    items: [
                        item("[137]", 9, 120),
                        item("10:40 à 14:00", 362, 120),
                        item("15:00 à 20:10", 413, 120),
                    ],
                },
                {
                    y: 108,
                    items: [
                        item("THEO TURPIN", 9, 108),
                        item("Caisses en ligne", 362, 108),
                        item("10:45 à 14:00", 380, 108),
                        item("Caisses en ligne", 400, 108),
                        item("15:00 à 20:00", 420, 108),
                    ],
                },
            ],
        };

        const day = parseEmployeePlanning(block, [columns[1]], 2026).days[0];

        expect(day.shifts).toHaveLength(2);
        expect(day.shifts.map((shift) => [
            shift.beginHourBadge,
            shift.endHourBadge,
        ])).toEqual([
            ["10:40", "14:00"],
            ["15:00", "20:10"],
        ]);
        expect(day.shifts.every((shift) => shift.assignments)).toBe(true);
    });

    it("keeps an assignment unresolved when no badge shift contains it", () => {
        const block: EmployeeBlock = {
            sellerId: "999",
            rows: [
                {
                    y: 120,
                    items: [
                        item("[999]", 9, 120),
                        item("10:00 à 12:00", 362, 120),
                    ],
                },
                {
                    y: 108,
                    items: [
                        item("TEST PERSON", 9, 108),
                        item("Mission non rattachée", 362, 108),
                        item("13:00 à 14:00", 380, 108),
                    ],
                },
            ],
        };

        const day = parseEmployeePlanning(block, [columns[1]], 2026).days[0];

        expect(day.shifts).toHaveLength(2);
        expect(day.shifts[0]).toMatchObject({
            beginHourBadge: "10:00",
            endHourBadge: "12:00",
        });
        expect(day.shifts[1]).toMatchObject({
            assignments: [
                {
                    label: "Mission non rattachée",
                    beginHour: "13:00",
                    endHour: "14:00",
                },
            ],
        });
        expect(day.shifts[1].beginHourBadge).toBeUndefined();
        expect(day.shifts[1].endHourBadge).toBeUndefined();
    });

    it("keeps an absence without creating a shift", () => {
        const block: EmployeeBlock = {
            sellerId: "135",
            rows: [
                {
                    y: 120,
                    items: [
                        item("[135]", 9, 120),
                        item("Absent(e) [Maladie]", 62, 120),
                    ],
                },
                { y: 108, items: [item("LYNDA", 9, 108), item("BELHENNICHE", 9, 108)] },
            ],
        };

        const result = parseEmployeePlanning(block, [columns[0]], 2026);

        expect(result.days[0]).toMatchObject({
            date: "28/09/2026",
            status: "Absent(e) [Maladie]",
            shifts: [],
        });
    });

});
