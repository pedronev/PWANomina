import { User } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Verificando acceso...
        </h2>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
