import { extractText, extractTextItems, getDocumentProxy } from "unpdf";

export interface PdfTextItem {
    str: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    dir: string;
    hasEOL: boolean;
}

export interface ExtractedPdf {
    totalPages: number;
    text: string;
    items: PdfTextItem[][];
}

export async function extractPdf(buffer: Buffer): Promise<ExtractedPdf> {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    const [{ totalPages, text }, { items }] = await Promise.all([
        extractText(pdf, { mergePages: true }),
        extractTextItems(pdf),
    ]);

    return {
        totalPages,
        text,
        items,
    };
}
