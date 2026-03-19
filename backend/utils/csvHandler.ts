import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const DATA_DIR = path.join(process.cwd(), 'backend', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const readCSV = (filename: string) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
};

export const writeCSV = (filename: string, data: any[]) => {
  const filePath = path.join(DATA_DIR, filename);
  const csvContent = stringify(data, { header: true });
  fs.writeFileSync(filePath, csvContent);
};

export const appendCSV = (filename: string, record: any) => {
  const data = readCSV(filename);
  data.push(record);
  writeCSV(filename, data);
};
