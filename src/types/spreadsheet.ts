export interface CellData {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
  };
}

export interface SpreadsheetData {
  [key: string]: CellData;
}

export interface ToolbarProps {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onFontSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onFormulaBarChange: (value: string) => void;
  selectedCell: string | null;
  cellValue: string;
}

export type SpreadsheetFunction = (data: SpreadsheetData, ...args: string[]) => number | string;

export interface Functions {
  [key: string]: SpreadsheetFunction;
}
