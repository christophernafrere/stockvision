import { readFile } from "node:fs/promises";

import { extractPdf } from "./extractor/extract-pdf.js";
import { groupIntoRows } from "./parser/group-into-row.js";
import { groupIntoEmployeeBlocks } from "./parser/group-into-employee-blocks.js";

console.log("========== DEBUG PLANNING PARSER ==========");

const pdfBuffer = await readFile("./planning.pdf");
const result = await extractPdf(pdfBuffer);

console.log("\n========== RECHERCHE DES EN-TÊTES ==========");

for (const [pageIndex, pageItems] of result.items.entries()) {
    const headerItems = pageItems.filter((item) =>
        /\b(dim|lun|mar|mer|jeu|ven|sam)\b/i.test(item.str.trim()),
    );

    if (headerItems.length === 0) {
        continue;
    }

    console.log(`\n--- PAGE ${pageIndex + 1} ---`);

    for (const item of headerItems.sort((a, b) => a.x - b.x)) {
        console.log(
            `x=${item.x.toFixed(2)} | y=${item.y.toFixed(2)} | "${item.str}"`,
        );
    }
}
