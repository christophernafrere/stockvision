import type { PdfTextItem } from "../extractor/extract-pdf.js";

export interface DayColumn {
    day: string;
    date: string;
    xStart: number;
    xEnd: number;
    headerX: number;
}

const DAY_PATTERN = /^(dim|lun|mar|mer|jeu|ven|sam)\s+(\d{1,2}\s+\w+\.?)$/i;

export function detectDayColumns(items: PdfTextItem[]): DayColumn[] {
    const headers = items
        .map((item) => {
            const match = DAY_PATTERN.exec(item.str.trim());

            if (!match) {
                return null;
            }

            return {
                day: match[1].toLowerCase(),
                date: match[2].trim(),
                x: item.x,
                y: item.y,
            };
        })
        .filter((header) => header !== null);

    // Les en-têtes sont répétés : on conserve celui le plus haut
    // pour chaque jour, puis on trie les jours de gauche à droite.
    const uniqueHeaders = new Map<
        string,
        { day: string; date: string; x: number; y: number }
    >();

    for (const header of headers) {
        const existing = uniqueHeaders.get(header.day);

        if (!existing || header.y > existing.y) {
            uniqueHeaders.set(header.day, header);
        }
    }

    const sortedHeaders = [...uniqueHeaders.values()].sort((a, b) => a.x - b.x);

    if (sortedHeaders.length !== 7) {
        throw new Error(
            `7 colonnes de jours attendues, ${sortedHeaders.length} détectées.`,
        );
    }

    const columns: DayColumn[] = sortedHeaders.map((header, index) => {
        const previous = sortedHeaders[index - 1];
        const next = sortedHeaders[index + 1];

        const xStart = previous
            ? (previous.x + header.x) / 2
            : header.x - (next!.x - header.x) / 2;

        const xEnd = next
            ? (header.x + next.x) / 2
            : header.x + (header.x - previous!.x) / 2;

        return {
            day: header.day,
            date: header.date,
            xStart,
            xEnd,
            headerX: header.x,
        };
    });

    return columns;
}
