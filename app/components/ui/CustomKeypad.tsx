"use client";

import { motion } from "framer-motion";

interface CustomKeypadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomKeypad({ value, onChange }: CustomKeypadProps) {
  const handleNumberPress = (number: string) => {
    onChange(value + number);
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange("");
  };

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="h-full flex flex-col">
      {/* Display mejorado */}
      <div className="bg-gray-100 rounded-lg p-6 mx-4 mb-4 flex items-center justify-center border-2 border-dashed border-gray-200 flex-shrink-0">
        <span className="text-3xl font-mono font-bold text-gray-700 tracking-wider">
          {value || "---"}
        </span>
      </div>

      {/* Teclado que abarca todo el ancho */}
      <div className="flex-1 grid grid-cols-3 grid-rows-4 gap-0 w-full">
        {/* Números 1-9 */}
        {numbers.map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNumberPress(num.toString())}
            className="bg-white border-l border-t border-gray-300 text-4xl font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:bg-blue-100 min-h-[70px]"
          >
            {num}
          </motion.button>
        ))}

        {/* Botón Clear */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleClear}
          className="bg-red-50 border-l border-t border-gray-300 text-2xl font-semibold text-red-600 hover:bg-red-100 transition-all duration-200 active:bg-red-200 min-h-[70px]"
        >
          C
        </motion.button>

        {/* Botón 0 */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNumberPress("0")}
          className="bg-white border-l border-t border-gray-300 text-4xl font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:bg-blue-100 min-h-[70px]"
        >
          0
        </motion.button>

        {/* Botón Backspace */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleDelete}
          className="bg-orange-50 border-l border-t border-r border-gray-300 text-2xl font-semibold text-orange-600 hover:bg-orange-100 transition-all duration-200 active:bg-orange-200 min-h-[70px]"
        >
          ⌫
        </motion.button>
      </div>

      {/* Borde inferior para completar el grid */}
      <div className="border-b border-gray-300 h-0"></div>
    </div>
  );
}
