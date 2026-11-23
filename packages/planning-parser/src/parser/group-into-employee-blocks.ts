import type { PdfRow } from "./group-into-row.js";

export interface EmployeeBlock {
    sellerId: string;
    rows: PdfRow[];
}

const DAY_HEADER_PATTERN =
    /^(dim|lun|mar|mer|jeu|ven|sam)\s+\d{1,2}\s+\w+\.?$/i;
const PAGE_FOOTER_PATTERN = /^page\s+\d+\s*\/\s*\d+$/i;

function getRowText(row: PdfRow): string {
    return row.items
        .map((item) => item.str.trim())
        .filter(Boolean)
        .join(" ")
        .replace(/\s*\|\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function isHeaderRow(row: PdfRow): boolean {
    const hasSectionLabel = row.items.some(
        (item) => item.str.trim().toLowerCase() === "hôtesses",
    );

    const hasDayHeaders = row.items.some((item) =>
        DAY_HEADER_PATTERN.test(item.str.trim()),
    );

    return hasSectionLabel && hasDayHeaders;
}

function isPageFooterRow(row: PdfRow): boolean {
    return PAGE_FOOTER_PATTERN.test(getRowText(row));
}

export function groupIntoEmployeeBlocks(rows: PdfRow[]): EmployeeBlock[] {
    const sortedRows = [...rows].sort((a, b) => b.y - a.y);

    const employees: EmployeeBlock[] = [];
    let currentEmployee: EmployeeBlock | null = null;

    for (const row of sortedRows) {
        if (isPageFooterRow(row)) {
            continue;
        }

        // Les en-têtes séparent les employés : ils ne leur appartiennent pas.
        if (isHeaderRow(row)) {
            currentEmployee = null;
            continue;
        }

        const sellerIdItem = row.items.find((item) =>
            /^\[\d+\]$/.test(item.str.trim()),
        );

        if (sellerIdItem) {
            currentEmployee = {
                sellerId: sellerIdItem.str.trim().slice(1, -1),
                rows: [],
            };

            employees.push(currentEmployee);
        }

        if (currentEmployee) {
            currentEmployee.rows.push(row);
        }
    }

    return employees;
}
