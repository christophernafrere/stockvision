import type { PdfTextItem } from "../extractor/extract-pdf.js";

export interface PdfRow {
    y: number;
    items: PdfTextItem[];
}

const DEFAULT_Y_TOLERANCE = 1;

export function groupIntoRows(
    items: PdfTextItem[],
    yTolerance = DEFAULT_Y_TOLERANCE,
): PdfRow[] {
    if (items.length === 0) {
        return [];
    }

    const sortedItems = [...items].sort((a, b) => {
        if (a.y !== b.y) {
            return a.y - b.y;
        }

        return a.x - b.x;
    });

    const rows: PdfRow[] = [];

    for (const item of sortedItems) {
        const currentRow = rows.at(-1);

        if (!currentRow || Math.abs(currentRow.y - item.y) > yTolerance) {
            rows.push({
                y: item.y,
                items: [item],
            });

            continue;
        }

        currentRow.items.push(item);
    }

    return rows;
}
