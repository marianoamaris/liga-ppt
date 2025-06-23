import React from "react";
import { Card } from "../components/common/Card";

export const Contacto: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
    <Card className="flex flex-col items-center justify-center w-full max-w-xl p-8 text-white bg-black border border-black">
      <img
        src="/PPT.png"
        alt="Logo Liga PPT"
        className="object-contain w-24 h-24 mb-4 shadow-xl"
      />
      <div className="mb-2 text-2xl font-bold text-white">
        ¿Necesitas información?
      </div>
      <div className="mb-4 text-base text-center text-white/90">
        Si tienes dudas, sugerencias o necesitas información adicional sobre la
        Liga PPT, puedes escribirnos a nuestro correo oficial:
      </div>
      <a
        href="mailto:contacto@ligappt.com"
        className="px-4 py-2 mt-2 text-sm font-semibold text-black bg-white rounded hover:bg-gray-200 transition"
      >
        contacto@ligappt.com
      </a>
    </Card>
  </div>
);
