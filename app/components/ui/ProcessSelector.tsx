"use client";

interface ProcessSelectorProps {
  selectedProcess: number | null;
  onProcessSelect: (index: number | null) => void;
  processes: string[];
  compact?: boolean;
}

export default function ProcessSelector({
  selectedProcess,
  onProcessSelect,
  processes,
  compact = false,
}: ProcessSelectorProps) {
  const handleProcessSelect = (index: number) => {
    if (selectedProcess === index) {
      // Si ya está seleccionado, deseleccionarlo
      onProcessSelect(null);
    } else {
      // Seleccionar nuevo proceso
      onProcessSelect(index);
    }
  };

  if (compact) {
    // Determinar el número de columnas basado en la cantidad de procesos
    const getGridCols = () => {
      if (processes.length === 1) return "grid-cols-1";
      if (processes.length === 2) return "grid-cols-2";
      return "grid-cols-3";
    };

    return (
      <div className={`grid ${getGridCols()} gap-2`}>
        {processes.slice(0, 3).map((proceso, index) => (
          <button
            key={proceso}
            onClick={() => handleProcessSelect(index)}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              selectedProcess === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedProcess === index
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedProcess === index && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-700 text-sm">
                  {proceso}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Versión normal (no compacta)
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Selecciona el proceso
      </label>

      <div className="space-y-3">
        {processes.map((proceso, index) => (
          <button
            key={proceso}
            onClick={() => handleProcessSelect(index)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              selectedProcess === index
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    selectedProcess === index
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedProcess === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-700">{proceso}</div>
                  <div className="text-sm text-gray-500">
                    Descripción del proceso
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
