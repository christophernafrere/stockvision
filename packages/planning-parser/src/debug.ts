import { readFile, writeFile } from "node:fs/promises";

import { extractPlanning } from "./extract-planning.js";
import { extractPdf } from "./extractor/extract-pdf.js";
import { groupIntoRows } from "./parser/group-into-row.js";
import { groupIntoEmployeeBlocks } from "./parser/group-into-employee-blocks.js";
import { detectDayColumns } from "./parser/detect-days-column.js";

const SHOW_RAW_ITEMS = false;
const SHOW_ROWS = true;
const SHOW_EMPLOYEE_BLOCKS = true;
const SHOW_DAY_COLUMNS = true;

const logs: string[] = [];

function log(message = "") {
    logs.push(message);
    console.log(message);
}

function section(title: string) {
    log(`\n${"=".repeat(20)} ${title} ${"=".repeat(20)}`);
}

function formatItem(item: {
    str: string;
    x: number;
    y: number;
    width: number;
    height: number;
}) {
    return `"${item.str.trim()}" x=${item.x.toFixed(2)} y=${item.y.toFixed(2)} w=${item.width.toFixed(2)} h=${item.height.toFixed(2)}`;
}

export async function exportPlanningJson(
    pdfBuffer: Buffer,
    outputPath = "planning.json",
    year = 2026,
): Promise<void> {
    const planning = await extractPlanning(pdfBuffer, year);

    await writeFile(
        outputPath,
        `${JSON.stringify(planning, null, 2)}\n`,
        "utf8",
    );

    console.log(
        `Export JSON terminée : ${planning.length} employés écrits dans ${outputPath}`,
    );
}

async function main() {
    log("========== DEBUG PLANNING PARSER ==========");

    const pdfBuffer = await readFile("./planning.pdf");
    const result = await extractPdf(pdfBuffer);
    await exportPlanningJson(pdfBuffer);

    section("RÉSUMÉ DU PDF");
    log(`Pages : ${result.totalPages}`);
    log(`Taille du PDF : ${(pdfBuffer.length / 1024).toFixed(2)} Ko`);
    log(`Texte extrait : ${result.text.length} caractères`);

    let totalItems = 0;
    let totalRows = 0;
    let totalEmployees = 0;
    let pagesWithoutHeaders = 0;
    let pagesWithColumnErrors = 0;

    const employeeIds = new Set<string>();

    for (const [pageIndex, pageItems] of result.items.entries()) {
        section(`PAGE ${pageIndex + 1}`);

        totalItems += pageItems.length;
        log(`Éléments PDF : ${pageItems.length}`);

        if (SHOW_RAW_ITEMS) {
            section("ÉLÉMENTS BRUTS");

            for (const item of pageItems) {
                log(formatItem(item));
            }
        }

        const rows = groupIntoRows(pageItems);
        totalRows += rows.length;

        section("LIGNES DÉTECTÉES");
        log(`Nombre de lignes : ${rows.length}`);

        if (SHOW_ROWS) {
            for (const row of [...rows].sort((a, b) => b.y - a.y)) {
                const content = row.items
                    .map((item) => item.str.trim())
                    .filter(Boolean)
                    .join(" | ");

                log(
                    `y=${row.y.toFixed(2)} | ${row.items.length} éléments | ${content}`,
                );
            }
        }

        section("COLONNES DES JOURS");

        try {
            const columns = detectDayColumns(pageItems);

            if (SHOW_DAY_COLUMNS) {
                for (const column of columns) {
                    log(
                        `${column.day} ${column.date} | x=${column.headerX.toFixed(2)} | [${column.xStart.toFixed(2)}, ${column.xEnd.toFixed(2)}]`,
                    );
                }

                const counts = new Map<string, number>(
                    columns.map((column) => [column.day, 0]),
                );

                for (const item of pageItems) {
                    if (!item.str.trim()) continue;

                    const column = columns.find(
                        (candidate) =>
                            item.x >= candidate.xStart &&
                            item.x < candidate.xEnd,
                    );

                    if (column) {
                        counts.set(
                            column.day,
                            (counts.get(column.day) ?? 0) + 1,
                        );
                    }
                }

                log("Éléments textuels par colonne :");

                for (const column of columns) {
                    log(`  ${column.day} : ${counts.get(column.day) ?? 0}`);
                }
            }
        } catch (error) {
            pagesWithColumnErrors++;

            log(
                `ERREUR COLONNES : ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
        }

        section("BLOCS EMPLOYÉS");

        const employees = groupIntoEmployeeBlocks(rows);
        totalEmployees += employees.length;

        for (const employee of employees) {
            employeeIds.add(employee.sellerId);
        }

        if (SHOW_EMPLOYEE_BLOCKS) {
            for (const employee of employees) {
                log(
                    `Employé ${employee.sellerId} | ${employee.rows.length} lignes`,
                );

                for (const row of employee.rows) {
                    const content = row.items
                        .map((item) => item.str.trim())
                        .filter(Boolean)
                        .join(" | ");

                    log(`  y=${row.y.toFixed(2)} | ${content}`);
                }
            }
        }

        const headers = pageItems.filter((item) =>
            /^(dim|lun|mar|mer|jeu|ven|sam)\s+\d{1,2}\s+\w+\.?$/i.test(
                item.str.trim(),
            ),
        );

        if (headers.length === 0) {
            pagesWithoutHeaders++;
            log("ATTENTION : aucun en-tête de jour reconnu.");
        }

        log(`Fin de la page ${pageIndex + 1}`);
    }

    section("BILAN GLOBAL");
    log(`Pages traitées : ${result.items.length}`);
    log(`Éléments PDF : ${totalItems}`);
    log(`Lignes détectées : ${totalRows}`);
    log(`Blocs employés détectés : ${totalEmployees}`);
    log(`Identifiants vendeur distincts : ${employeeIds.size}`);
    log(`Pages sans en-tête reconnu : ${pagesWithoutHeaders}`);
    log(`Pages avec erreur de colonnes : ${pagesWithColumnErrors}`);

    section("FIN DU DEBUG");

    await writeFile("debug.log", logs.join("\n") + "\n", "utf8");

    console.log(`\nLogs complets enregistrés dans : debug.log`);
}

main().catch((error: unknown) => {
    console.error("Échec du debug :", error);
    process.exitCode = 1;
});
