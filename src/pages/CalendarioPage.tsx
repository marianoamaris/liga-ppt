import React from "react";

export const CalendarioPage: React.FC = () => {
  return (
    <div className="container px-2 py-6 mx-auto md:py-8">
      <div className="max-w-sm mx-auto md:max-w-2xl">
        <div className="flex items-center justify-center p-6 mb-8 bg-black shadow-lg rounded-xl">
          <img
            src="/PPT.png"
            alt="Logo Liga PPT"
            className="object-contain w-20 h-20 md:w-24 md:h-24"
          />
        </div>

        <div className="p-8 text-center bg-white shadow-lg rounded-xl border border-gray-100">
          <h1 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">
            Calendario
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">
            Esperando liga 19
          </p>
        </div>
      </div>
    </div>
  );
};
