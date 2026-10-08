import { groupIntoRows } from "./group-into-row.js";
import type { PdfTextItem } from "../extractor/extract-pdf.js";

describe("groupIntoRows", () => {
    it("groups items with the same y coordinate", () => {
        const items: PdfTextItem[] = [
            {
                str: "CHRIS",
                x: 9.24,
                y: 510,
                width: 17.51,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
            {
                str: "Caisses en ligne",
                x: 162.25,
                y: 510,
                width: 37.2,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
            {
                str: "08:20 à 14:45",
                x: 213.23,
                y: 510,
                width: 33.03,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
            {
                str: "ARTIGNY",
                x: 9.24,
                y: 498,
                width: 26.44,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
        ];

        const rows = groupIntoRows(items);

        expect(rows).toHaveLength(2);

        expect(rows[0]).toEqual({
            y: 498,
            items: [items[3]],
        });

        expect(rows[1]).toEqual({
            y: 510,
            items: [items[0], items[1], items[2]],
        });
    });

    it("groups items when their y coordinates are within the tolerance", () => {
        const items: PdfTextItem[] = [
            {
                str: "A",
                x: 10,
                y: 510,
                width: 10,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
            {
                str: "B",
                x: 20,
                y: 510.5,
                width: 10,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
        ];

        const rows = groupIntoRows(items, 1);

        expect(rows).toHaveLength(1);
        expect(rows[0].items).toEqual([items[0], items[1]]);
    });

    it("sorts items from left to right", () => {
        const items: PdfTextItem[] = [
            {
                str: "08:20 à 14:45",
                x: 213.23,
                y: 510,
                width: 33.03,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
            {
                str: "CHRIS",
                x: 9.24,
                y: 510,
                width: 17.51,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
            {
                str: "Caisses en ligne",
                x: 162.25,
                y: 510,
                width: 37.2,
                height: 6,
                fontSize: 6,
                fontFamily: "",
                dir: "ltr",
                hasEOL: false,
            },
        ];

        const rows = groupIntoRows(items);

        expect(rows[0].items.map((item) => item.str)).toEqual([
            "CHRIS",
            "Caisses en ligne",
            "08:20 à 14:45",
        ]);
    });

    it("returns an empty array for empty input", () => {
        expect(groupIntoRows([])).toEqual([]);
    });
});
