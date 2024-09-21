"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Additional imports for text file export
import { saveAs } from "file-saver"; 

export default function CalculatorComponent() {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handle input number changes
  const handleNum1Change = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
  
    // Allow only digits and optional one decimal point
    const regex = /^\d*\.?\d*$/;
  
    if (regex.test(value)) {
      setNum1(value); // Set the input value if it's a valid number
    }
  };
  
  const handleNum2Change = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
  
    // Only allow valid numeric values (with optional decimal point)
    const regex = /^\d*\.?\d*$/;
  
    if (regex.test(value)) {
      setNum2(value); // Set the input value if it's a valid number
    }0
  };
  

  // Function to add operation to history
  const addToHistory = (operation: string): void => {
    setHistory((prevHistory) => [...prevHistory, operation]);
  };

  // Arithmetic Operations (with improved error handling)
  const add = (): void => {
    if (!validateInputs()) return;
    const res = (parseFloat(num1) + parseFloat(num2)).toString();
    setResult(res);
    addToHistory(`${num1} + ${num2} = ${res}`);
  };

  const subtract = (): void => {
    if (!validateInputs()) return;
    const res = (parseFloat(num1) - parseFloat(num2)).toString();
    setResult(res);
    addToHistory(`${num1} - ${num2} = ${res}`);
  };

  const multiply = (): void => {
    if (!validateInputs()) return;
    const res = (parseFloat(num1) * parseFloat(num2)).toString();
    setResult(res);
    addToHistory(`${num1} * ${num2} = ${res}`);
  };

  const divide = (): void => {
    if (!validateInputs()) return;
    if (parseFloat(num2) !== 0) {
      const res = (parseFloat(num1) / parseFloat(num2)).toString();
      setResult(res);
      addToHistory(`${num1} / ${num2} = ${res}`);
    } else {
      setResult("Error: Division by zero");
      addToHistory("Error: Division by zero");
    }
  };

  // Input validation to check if both inputs are numbers
  const validateInputs = (): boolean => {
    if (isNaN(parseFloat(num1)) || isNaN(parseFloat(num2))) {
      setError("Please enter valid numbers");
      return false;
    }
    setError("");
    return true;
  };

  // Clear inputs, result, and history
  const clear = (): void => {
    setNum1("");
    setNum2("");
    setResult("");
    setHistory([]);
    setError("");
  };

  // Toggle dark mode
  const toggleDarkMode = (): void => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Keyboard event handler
  const handleKeyPress = (e: KeyboardEvent): void => {
    if (e.key === "Enter") add();
    if (e.key === "-") subtract();
    if (e.key === "*") multiply();
    if (e.key === "/") divide();
    if (e.key === "Escape") clear(); // Added "Escape" to clear inputs
    if (!isNaN(parseInt(e.key))) setNum1((prev) => prev); // Handles number inputs
  };

  // Undo last entry in history
  const undoLastEntry = (): void => {
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  // Export history as a text file
  const exportHistory = (): void => {
    const blob = new Blob([history.join("\n")], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "calculator-history.txt");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [num1, num2]);

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Card className={`w-full max-w-md p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg rounded-lg`}>
        <CardHeader>
          <CardTitle className={`text-2xl font-bold flex justify-between ${isDarkMode ? "text-white" : "text-black"}`}>
            Simple Calculator
            <Button variant="outline" onClick={toggleDarkMode}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error handling */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Input fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="num1" className={isDarkMode ? "text-white" : "text-black"}>Number 1</Label>
              <Input
                id="num1"
                type="number"
                value={num1}
                onChange={handleNum1Change}
                placeholder="Enter a number"
                className={isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="num2"  className={isDarkMode ? "text-white" : "text-black"}>Number 2</Label>
              <Input
                id="num2"
                type="number"
                value={num2}
                onChange={handleNum2Change}
                placeholder="Enter a number"
                className={isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}
              />
            </div>
          </div>

          {/* Buttons for operations */}
          <div className={`grid grid-cols-4 gap-2 ${isDarkMode ? "text-white" : "text-black"}`} >
            <Button variant="outline" className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-black"}`} onClick={add}>
              +
            </Button>
            <Button variant="outline" className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-black"}`} onClick={subtract}>
              -
            </Button>
            <Button variant="outline" className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-black"}`} onClick={multiply}>
              *
            </Button>
            <Button variant="outline" className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-black"}`} onClick={divide}>
              /
            </Button>
          </div>

          {/* Result display */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="result"  className={isDarkMode ? "text-white" : "text-black"}>Result</Label>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={isDarkMode ? "text-white" : "text-black"}>
              <Input id="result" type="text" value={result} className={isDarkMode ? "text-white" : "text-black"} placeholder="Result" readOnly />
            </motion.div>
          </div>

          {/* History with undo and export options */}
          <div className="flex flex-col space-y-2">
            <Label className={isDarkMode ? "text-white" : "text-black"} >History</Label>
            <div className={`max-h-40 overflow-y-auto p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <p key={index} className="text-gray-800 dark:text-gray-300">{entry}</p>
                ))
              ) : (
                <p className={`text-gray-500 dark:text-gray-400 ${isDarkMode ? "text-white" : "text-black"}`}>No history</p>
              )}
            </div>
            <Button variant="outline" onClick={undoLastEntry} className={isDarkMode ? "text-white" : "text-black"}>
              Undo Last Entry
            </Button>
            <Button variant="outline" onClick={exportHistory} className={isDarkMode ? "text-white" : "text-black"}>
              Export History
            </Button>
          </div>

          {/* Clear button */}
          <Button variant="outline" className={`w-full ${isDarkMode ? "text-white" : "text-black"}`} onClick={clear}>
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
