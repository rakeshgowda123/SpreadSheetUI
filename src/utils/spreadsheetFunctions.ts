import { SpreadsheetData, SpreadsheetFunction } from '../types/spreadsheet';

// Helper function to get numeric values from cell references
const getNumericValue = (cellData: SpreadsheetData, ref: string): number => {
  const value = cellData[ref]?.value;
  return value && !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
};

// Helper function to get a range of cells
const getCellRange = (start: string, end: string): string[] => {
  const startCol = start.match(/[A-Z]+/)?.[0] || '';
  const startRow = parseInt(start.match(/\d+/)?.[0] || '0', 10);
  const endCol = end.match(/[A-Z]+/)?.[0] || '';
  const endRow = parseInt(end.match(/\d+/)?.[0] || '0', 10);

  const cells: string[] = [];
  for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
    for (let row = startRow; row <= endRow; row++) {
      cells.push(`${String.fromCharCode(col)}${row}`);
    }
  }
  return cells;
};

export const spreadsheetFunctions: { [key: string]: SpreadsheetFunction } = {
  SUM: (data, start, end) => {
    const range = getCellRange(start, end);
    return range.reduce((sum, cell) => sum + getNumericValue(data, cell), 0);
  },

  AVERAGE: (data, start, end) => {
    const range = getCellRange(start, end);
    const sum = range.reduce((acc, cell) => acc + getNumericValue(data, cell), 0);
    return range.length > 0 ? sum / range.length : 0;
  },

  MAX: (data, start, end) => {
    const range = getCellRange(start, end);
    return Math.max(...range.map(cell => getNumericValue(data, cell)));
  },

  MIN: (data, start, end) => {
    const range = getCellRange(start, end);
    return Math.min(...range.map(cell => getNumericValue(data, cell)));
  },

  COUNT: (data, start, end) => {
    const range = getCellRange(start, end);
    return range.filter(cell => !isNaN(getNumericValue(data, cell))).length;
  },

  TRIM: (data, cell) => {
    return (data[cell]?.value || '').trim();
  },

  UPPER: (data, cell) => {
    return (data[cell]?.value || '').toUpperCase();
  },

  LOWER: (data, cell) => {
    return (data[cell]?.value || '').toLowerCase();
  },

  REMOVE_DUPLICATES: (data, start, end) => {
    const range = getCellRange(start, end);
    const values = range.map(cell => data[cell]?.value || '');
    return [...new Set(values)].join(', ');
  },

  FIND_AND_REPLACE: (data, start, end, find, replace) => {
    const range = getCellRange(start, end);
    return range
      .map(cell => (data[cell]?.value || '').replace(new RegExp(find, 'gi'), replace))
      .join(', ');
  }
};
