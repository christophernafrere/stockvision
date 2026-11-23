import { describe, expect, it } from "@jest/globals";
import { groupIntoEmployeeBlocks } from "./group-into-employee-blocks.js";
import type { PdfRow } from "./group-into-row.js";
import type { PdfTextItem } from "../extractor/extract-pdf.js";

function createItem(str: string, y: number): PdfTextItem {
    return {
        str,
        x: 9,
        y,
        width: 20,
        height: 6,
        fontSize: 6,
        fontFamily: "serif",
        dir: "ltr",
        hasEOL: false,
    };
}

describe("groupIntoEmployeeBlocks", () => {
    it("groups rows by seller ID", () => {
        const rows: PdfRow[] = [
            { y: 498, items: [createItem("ARTIGNY", 498)] },
            { y: 522, items: [createItem("[638]", 522)] },
            { y: 510, items: [createItem("CHRIS", 510)] },
            { y: 470, items: [createItem("[685]", 470)] },
            { y: 458, items: [createItem("HARFAOUI", 458)] },
        ];

        const result = groupIntoEmployeeBlocks(rows);

        expect(result).toHaveLength(2);
        expect(result[0].sellerId).toBe("638");
        expect(result[0].rows.map((row) => row.y)).toEqual([522, 510, 498]);

        expect(result[1].sellerId).toBe("685");
        expect(result[1].rows.map((row) => row.y)).toEqual([470, 458]);
    });

    it("does not add page footers to the preceding employee", () => {
        const rows: PdfRow[] = [
            {
                y: 500,
                items: [
                    createItem("Page 1", 500),
                    createItem("|", 500),
                    createItem("/", 500),
                    createItem("14", 500),
                ],
            },
            { y: 510, items: [createItem("MARTIN", 510)] },
            { y: 520, items: [createItem("[112]", 520)] },
        ];

        const result = groupIntoEmployeeBlocks(rows);

        expect(result).toHaveLength(1);
        expect(result[0].rows.map((row) => row.y)).toEqual([520, 510]);
    });

    it("does not add repeated table headers to the preceding employee", () => {
        const rows: PdfRow[] = [
            {
                y: 500,
                items: [
                    createItem("Hôtesses", 500),
                    createItem("dim 1 janv.", 500),
                ],
            },
            { y: 510, items: [createItem("MARTIN", 510)] },
            { y: 520, items: [createItem("[112]", 520)] },
        ];

        const result = groupIntoEmployeeBlocks(rows);

        expect(result).toHaveLength(1);
        expect(result[0].rows.map((row) => row.y)).toEqual([520, 510]);
    });
});
