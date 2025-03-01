import React, { useState, useCallback, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";

import { evaluate } from "mathjs";
import "handsontable/dist/handsontable.full.css";
import type { CellData, SpreadsheetData } from "../types/spreadsheet";
import { spreadsheetFunctions } from "../utils/spreadsheetFunctions";
import FormulaBar from "./FormulaBar";

registerAllModules();

const INITIAL_ROWS = 100;
const INITIAL_COLS = 26; // A to Z

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<SpreadsheetData>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [formulaBarValue, setFormulaBarValue] = useState("");

  // Create initial data array
  const initialData = Array(INITIAL_ROWS)
    .fill(null)
    .map(() => Array(INITIAL_COLS).fill(null));

  const evaluateFormula = useCallback(
    (formula: string, cellData: SpreadsheetData): string => {
      try {
        if (!formula.startsWith("=")) return formula;

        let expression = formula.substring(1).trim();

        // Replace cell references with actual values
        expression = expression.replace(
          /[A-Z]+\d+/g,
          (match) => cellData[match]?.value || "0"
        );

        return evaluate(expression).toString();
      } catch (error) {
        console.error("Formula evaluation error:", error);
        return "#ERROR!";
      }
    },
    []
  );

  const handleChange = useCallback(
    (changes: [number, number, any, any][] | null) => {
      if (!changes) return;

      setData((prevData) => {
        const newData = { ...prevData };
        changes.forEach(([row, col, oldValue, newValue]) => {
          const cellKey = `${String.fromCharCode(65 + col)}${row + 1}`;

          if (!newData[cellKey]) {
            newData[cellKey] = { value: newValue, style: {} };
          } else {
            newData[cellKey].value = newValue;
          }
        });

        return newData; // Ensure state update
      });
    },
    [evaluateFormula]
  );

  const handleFormulaBarChange = useCallback(
    (value: string) => {
      setFormulaBarValue(value);
      if (!selectedCell) return;

      setData((prevData) => {
        const newData = { ...prevData };
        newData[selectedCell] = value.startsWith("=")
          ? { value: evaluateFormula(value, prevData), formula: value }
          : { value };

        return newData;
      });
    },
    [selectedCell, evaluateFormula]
  );

  useEffect(() => {
    if (selectedCell) {
      setFormulaBarValue(
        data[selectedCell]?.formula || data[selectedCell]?.value || ""
      );
    } else {
      setFormulaBarValue("");
    }
  }, [selectedCell, data]);

  const generateGridData = () => {
    const grid = Array(INITIAL_ROWS)
      .fill(null)
      .map(() => Array(INITIAL_COLS).fill(null));

    Object.entries(data).forEach(([key, cellData]) => {
      const col = key.charCodeAt(0) - 65;
      const row = parseInt(key.slice(1), 10) - 1;
      if (grid[row] && grid[row][col] !== undefined) {
        grid[row][col] = cellData.value;
      }
    });

    return grid;
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-8rem)]">
      <FormulaBar
        value={formulaBarValue}
        selectedCell={selectedCell}
        onChange={handleFormulaBarChange}
      />
      <div className="flex-1">
        <HotTable
          data={generateGridData()}
          rowHeaders={true}
          colHeaders={true}
          width="100%"
          height="100%"
          afterChange={handleChange}
          afterSelection={(row: number, col: number) => {
            const cellKey = `${String.fromCharCode(65 + col)}${row + 1}`;
            setSelectedCell(cellKey);
          }}
          licenseKey="non-commercial-and-evaluation"
          stretchH="all"
          contextMenu={true}
          minSpareRows={1}
          minSpareCols={1}
          manualColumnResize={true}
          manualRowResize={true}
        />
      </div>
    </div>
  );
};

export default Spreadsheet;
