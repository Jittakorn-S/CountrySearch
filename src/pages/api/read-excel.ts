import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const filePath: string = path.join(process.cwd(), "public", "CountryData.xlsx");

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }

        const fileBuffer: Buffer = fs.readFileSync(filePath);
        const workbook: XLSX.WorkBook = XLSX.read(fileBuffer, { type: "buffer" });

        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet | undefined = workbook.Sheets[sheetName];

        if (!sheet) {
            return res.status(500).json({ error: "Sheet not found" });
        }

        const data: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: (error as Error).message });
    }
}