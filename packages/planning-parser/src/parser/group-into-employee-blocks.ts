import type { PdfRow } from "./group-into-row.js";

export interface EmployeeBlock {
    sellerId: string;
    rows: PdfRow[];
}

export function groupIntoEmployeeBlocks(rows: PdfRow[]): EmployeeBlock[] {
    const sortedRows = [...rows].sort((a, b) => b.y - a.y);

    const employees: EmployeeBlock[] = [];
    let currentEmployee: EmployeeBlock | null = null;

    for (const row of sortedRows) {
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
