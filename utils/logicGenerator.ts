
import { AnswerRow } from '../types';

/**
 * Validates if a string is a pure numeric value (supports negative and decimals)
 */
export const isNumeric = (str: string): boolean => {
  const trimmed = str.trim();
  if (trimmed === "") return false;
  return /^-?\d+(\.\d+)?$/.test(trimmed);
};

/**
 * Formats a cell value based on whether it's numeric or not
 */
export const formatValue = (val: string): string => {
  const trimmed = val.trim();
  if (trimmed === "") return '""';
  return isNumeric(trimmed) ? trimmed : `"${trimmed}"`;
};

/**
 * Generates the logic expression string based on the current data state
 */
export function generateExpression(rows: AnswerRow[], totalBlanks: number): string {
  if (rows.length === 0) return "";

  const groups = rows.map(row => {
    const conditions: string[] = [];
    for (let i = 1; i <= totalBlanks; i++) {
      const val = row[`blank${i}`] || "";
      const formattedVal = formatValue(val);
      conditions.push(`(空${i})=${formattedVal}`);
    }
    return conditions.join('且');
  });

  return `(${groups.join('或')})`;
}
