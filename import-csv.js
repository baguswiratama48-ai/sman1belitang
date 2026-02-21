import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY; // Note: For row level security policies, Service Role key is better, but anon key might work if policies allow INSERT

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvDir = path.join(__dirname, 'database_lama');

async function processFile(filePath, tableName) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (data) => {
                // Clean up empty string fields that should be null
                const cleanData = {};
                for (const [key, value] of Object.entries(data)) {
                    if (value === '') {
                        cleanData[key] = null;
                    } else if (value === 'TRUE' || value === 'true') {
                        cleanData[key] = true;
                    } else if (value === 'FALSE' || value === 'false') {
                        cleanData[key] = false;
                    } else {
                        cleanData[key] = value;
                    }
                }
                results.push(cleanData);
            })
            .on('end', async () => {
                if (results.length === 0) {
                    console.log(`Skipping ${tableName}: 0 rows`);
                    return resolve();
                }
                console.log(`Uploading ${results.length} rows to ${tableName}...`);

                // Since RLS is blocking the anon key and we don't have service role key,
                // let's create a SQL script instead that the user can run in SQL Editor
                const sqlStatements = [];
                for (const row of results) {
                    const columns = Object.keys(row).map(k => `"${k}"`).join(", ");
                    const values = Object.values(row).map(v => {
                        if (v === null) return "NULL";
                        if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
                        if (typeof v === "number") return v;
                        // Escape single quotes for SQL
                        return `'${String(v).replace(/'/g, "''")}'`;
                    }).join(", ");
                    sqlStatements.push(`INSERT INTO "public"."${tableName}" (${columns}) VALUES (${values});`);
                }

                fs.appendFileSync(path.join(csvDir, 'import_data.sql'), sqlStatements.join('\n') + '\n\n');
                console.log(`Finished ${tableName}, dumped to SQL file.`);
                resolve();
            })
            .on('error', (error) => {
                console.error(`Error reading ${filePath}:`, error);
                reject(error);
            });
    });
}

async function main() {
    try {
        const files = fs.readdirSync(csvDir);

        for (const file of files) {
            if (!file.endsWith('.csv')) continue;

            // Extract table name from filename like 'berita-export-2026-02-21...csv'
            const match = file.match(/^([^-]+)-export/);
            // Some tabel names have underscores like 'kalender_akademik' or 'site_settings'
            // Let's use a simpler extraction: everything before "-export"
            // Wait, let's fix the regex to support underscores: match everything before "-export-"

            let tableName = file.split('-export-')[0];

            if (!tableName) {
                console.warn(`Could not determine table name for ${file}`);
                continue;
            }

            console.log(`========== Processing table: ${tableName} ==========`);
            await processFile(path.join(csvDir, file), tableName);
        }

        console.log("All imports completed.");
    } catch (error) {
        console.error("Fatal error:", error);
    }
}

main();
