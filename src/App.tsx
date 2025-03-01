import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import Spreadsheet from "./components/Spreadsheet";

function App() {
  const [style, setStyle] = useState({
    bold: false,
    italic: false,
    fontSize: "12px",
    color: "#000000",
    backgroundColor: "#ffffff",
  });

  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [cellValue, setCellValue] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-800">Sheets Clone</h1>
        </div>
      </header>
      <Toolbar
        onBoldClick={() => setStyle((prev) => ({ ...prev, bold: !prev.bold }))}
        onItalicClick={() =>
          setStyle((prev) => ({ ...prev, italic: !prev.italic }))
        }
        onFontSizeChange={(size) =>
          setStyle((prev) => ({ ...prev, fontSize: size }))
        }
        onColorChange={(color) => setStyle((prev) => ({ ...prev, color }))}
        onBackgroundColorChange={(color) =>
          setStyle((prev) => ({ ...prev, backgroundColor: color }))
        }
        onFormulaBarChange={setCellValue}
        selectedCell={selectedCell}
        cellValue={cellValue}
      />
      <Spreadsheet />
    </div>
  );
}

export default App;
