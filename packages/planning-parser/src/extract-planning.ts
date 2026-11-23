import type { Buffer } from "node:buffer";

import { extractPdf } from "./extractor/extract-pdf.js";
import { detectDayColumns } from "./parser/detect-days-column.js";
import { groupIntoEmployeeBlocks } from "./parser/group-into-employee-blocks.js";
import { parseEmployeePlanning, type EmployeePlanning } from "./parser/parse-employee-planning.js";
import { groupIntoRows } from "./parser/group-into-row.js";

export async function extractPlanning(
    buffer: Buffer,
    year: number,
): Promise<EmployeePlanning[]> {
    if (!Number.isInteger(year) || year < 1) {
        throw new Error(`Année invalide : ${year}.`);
    }

    const extractedPdf = await extractPdf(buffer);
    const planning: EmployeePlanning[] = [];

    for (const pageItems of extractedPdf.items) {
        const columns = detectDayColumns(pageItems);
        const rows = groupIntoRows(pageItems);
        const employeeBlocks = groupIntoEmployeeBlocks(rows);

        for (const employeeBlock of employeeBlocks) {
            planning.push(parseEmployeePlanning(employeeBlock, columns, year));
        }
    }

    return planning;
}
