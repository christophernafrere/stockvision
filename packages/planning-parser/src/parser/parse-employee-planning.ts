import type { PdfTextItem } from "../extractor/extract-pdf.js";
import type { DayColumn } from "./detect-days-column.js";
import type { EmployeeBlock } from "./group-into-employee-blocks.js";

export interface EmployeeAssignment {
    label: string;
    beginHour?: string;
    endHour?: string;
    raw: string;
}

export interface EmployeeShift {
    beginHourBadge?: string;
    endHourBadge?: string;
    assignments: EmployeeAssignment[];
}

export interface EmployeeDay {
    day: string;
    date: string;
    status?: string;
    duration?: string;
    shifts: EmployeeShift[];
    raw: string[];
}

export interface EmployeePlanning {
    sellerId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    days: EmployeeDay[];
}

interface Cell {
    items: PdfTextItem[];
    text: string;
}

interface TimeRange {
    begin: string;
    end: string;
    raw: string;
}

interface ParsedShift extends EmployeeShift {
    badgeRange: TimeRange;
}

const TIME_RANGE_PATTERN = /(\d{1,2}:\d{2})\s+à\s+(\d{1,2}:\d{2})/g;
const DURATION_PATTERN = /^\d+h\d{2}$/i;
const MONTHS = new Map([
    ["janv", 1],
    ["févr", 2],
    ["mars", 3],
    ["avr", 4],
    ["mai", 5],
    ["juin", 6],
    ["juil", 7],
    ["août", 8],
    ["sept", 9],
    ["oct", 10],
    ["nov", 11],
    ["déc", 12],
]);

function createCells(rows: EmployeeBlock["rows"], columns: DayColumn[]): Cell[][] {
    return rows.map((row) =>
        columns.map((column) => {
            const items = row.items
                .filter(
                    (item) =>
                        item.x >= column.xStart && item.x < column.xEnd,
                )
                .sort((a, b) => a.x - b.x);

            return {
                items,
                text: items
                    .map((item) => item.str.trim())
                    .filter(Boolean)
                    .join(" ")
                    .replace(/\s+/g, " ")
                    .trim(),
            };
        }),
    );
}

function getTimeRanges(text: string): TimeRange[] {
    return [...text.matchAll(TIME_RANGE_PATTERN)].map((match) => ({
        begin: match[1],
        end: match[2],
        raw: match[0],
    }));
}

function timeToMinutes(value: string): number {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
}

function containsTimeRange(
    shiftRange: TimeRange,
    assignment: EmployeeAssignment,
): boolean {
    if (!assignment.beginHour || !assignment.endHour) {
        return false;
    }

    return (
        timeToMinutes(assignment.beginHour) >=
            timeToMinutes(shiftRange.begin) &&
        timeToMinutes(assignment.endHour) <= timeToMinutes(shiftRange.end)
    );
}

function getStatus(text: string): string | undefined {
    const normalized = text.trim();

    if (/^non travaillé$/i.test(normalized) || /^absent/i.test(normalized)) {
        return normalized;
    }

    return undefined;
}

function getLeftText(
    row: EmployeeBlock["rows"][number],
    firstColumn: DayColumn,
): string {
    return row.items
        .filter((item) => item.x < firstColumn.xStart)
        .map((item) => item.str.trim())
        .filter((text) => text && !/^\[\d+\]$/.test(text))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

function parseName(nameParts: string[]): {
    firstName: string;
    lastName: string;
    fullName: string;
} {
    const fullName = nameParts.join(" ").replace(/\s+/g, " ").trim();
    const parts = fullName ? fullName.split(" ") : [];

    if (parts.length <= 1) {
        return {
            firstName: fullName,
            lastName: "",
            fullName,
        };
    }

    return {
        firstName: parts.slice(0, -1).join(" "),
        lastName: parts.at(-1) ?? "",
        fullName,
    };
}

function formatDate(dateHeader: string, year: number): string {
    const match = /^(\d{1,2})\s+([a-zéû]+)\.?$/i.exec(dateHeader.trim());
    const month = match ? MONTHS.get(match[2].toLowerCase()) : undefined;

    if (!match || !month) {
        throw new Error(`Date de colonne non reconnue : "${dateHeader}".`);
    }

    return `${match[1].padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

function parseAssignments(cell: Cell): EmployeeAssignment[] {
    let currentLabel = "";
    const assignments: EmployeeAssignment[] = [];

    for (const item of cell.items) {
        const text = item.str.trim();

        if (!text) {
            continue;
        }

        const ranges = getTimeRanges(text);

        if (ranges.length === 0) {
            currentLabel = text;
            continue;
        }

        const label = currentLabel || text.replace(TIME_RANGE_PATTERN, "").trim();

        for (const range of ranges) {
            assignments.push({
                label,
                beginHour: range.begin,
                endHour: range.end,
                raw: cell.text,
            });
        }
    }

    return assignments;
}

export function parseEmployeePlanning(
    block: EmployeeBlock,
    columns: DayColumn[],
    year: number,
): EmployeePlanning {
    if (columns.length === 0) {
        throw new Error("Impossible de parser un employé sans colonne de jour.");
    }

    const cells = createCells(block.rows, columns);
    const sellerRowIndex = block.rows.findIndex((row) =>
        row.items.some((item) => /^\[\d+\]$/.test(item.str.trim())),
    );

    if (sellerRowIndex < 0) {
        throw new Error(`Identifiant vendeur introuvable pour ${block.sellerId}.`);
    }

    const nameParts: string[] = [];
    const dailyDurations: Map<number, string> = new Map();
    const assignmentsByDay = columns.map(() => [] as EmployeeAssignment[]);
    const badgeRangesByDay = columns.map(() => [] as TimeRange[]);
    const statuses = columns.map(() => undefined as string | undefined);
    const rawByDay = columns.map(() => [] as string[]);

    for (let rowIndex = sellerRowIndex; rowIndex < block.rows.length; rowIndex++) {
        const row = block.rows[rowIndex];
        const rowCells = cells[rowIndex];
        const leftText = getLeftText(row, columns[0]);

        if (leftText) {
            nameParts.push(leftText);
        }

        for (const [dayIndex, cell] of rowCells.entries()) {
            if (!cell.text) {
                continue;
            }

            rawByDay[dayIndex].push(cell.text);

            const ranges = getTimeRanges(cell.text);
            const status = getStatus(cell.text);

            if (rowIndex === sellerRowIndex) {
                badgeRangesByDay[dayIndex].push(...ranges);
                statuses[dayIndex] = status;
                continue;
            }

            if (DURATION_PATTERN.test(cell.text)) {
                dailyDurations.set(dayIndex, cell.text);
                continue;
            }

            assignmentsByDay[dayIndex].push(...parseAssignments(cell));
        }
    }

    const name = parseName(nameParts);
    const days: EmployeeDay[] = columns.map((column, dayIndex) => {
        const badgeRanges = badgeRangesByDay[dayIndex];
        const assignments = assignmentsByDay[dayIndex];
        const shifts: ParsedShift[] = badgeRanges.map((range) => ({
            beginHourBadge: range.begin,
            endHourBadge: range.end,
            assignments: [] as EmployeeAssignment[],
            badgeRange: range,
        }));

        for (const assignment of assignments) {
            const matchingShift = shifts.find((shift) =>
                containsTimeRange(shift.badgeRange, assignment),
            );

            if (matchingShift) {
                matchingShift.assignments.push(assignment);
                continue;
            }

            shifts.push({
                assignments: [assignment],
                badgeRange: {
                    begin: "",
                    end: "",
                    raw: "",
                },
            });
        }

        return {
            day: column.day,
            date: formatDate(column.date, year),
            status: statuses[dayIndex],
            duration: dailyDurations.get(dayIndex),
            shifts: shifts.map(({ badgeRange: _badgeRange, ...shift }) => shift),
            raw: rawByDay[dayIndex],
        };
    });

    return {
        sellerId: block.sellerId,
        ...name,
        days,
    };
}
