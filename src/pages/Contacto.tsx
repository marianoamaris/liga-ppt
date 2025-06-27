import React from "react";
import { Card } from "../components/common/Card";
import { FaRegEnvelope, FaYoutube, FaInstagram } from "react-icons/fa";

export const Contacto: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-4">
    <div className="w-full max-w-4xl space-y-6">
      {/* Card principal de bienvenida */}
      <Card className="flex flex-col items-center justify-center w-full p-8 text-white bg-black border border-black">
        <img
          src="/PPT.png"
          alt="Logo Liga PPT"
          className="object-contain w-24 h-24 mb-4 shadow-xl"
        />
        <div className="mb-2 text-2xl font-bold text-white">
          ¿Necesitas información?
        </div>
        <div className="mb-4 text-base text-center text-white/90">
          Conecta con la Liga PPT a través de nuestros canales oficiales
        </div>
      </Card>

      {/* Cards de contacto */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Email */}
        <Card className="flex flex-col items-center justify-center p-6 text-center bg-white hover:shadow-lg transition-shadow">
          <FaRegEnvelope className="mb-3 text-pink-600" size={32} />
          <h3 className="mb-2 text-lg font-bold text-gray-800">
            Correo Oficial
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Para dudas, sugerencias o información adicional sobre la Liga PPT
          </p>
          <a
            href="mailto:contacto@ligappt.com"
            className="px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded hover:bg-pink-700 transition"
          >
            contacto@ligappt.com
          </a>
        </Card>

        {/* YouTube */}
        <Card className="flex flex-col items-center justify-center p-6 text-center bg-white hover:shadow-lg transition-shadow">
          <FaYoutube className="mb-3 text-red-600" size={32} />
          <h3 className="mb-2 text-lg font-bold text-gray-800">
            Canal de YouTube
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Mira los partidos completos, highlights y contenido exclusivo de la
            Liga PPT
          </p>
          <a
            href="https://www.youtube.com/@ligappt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition"
          >
            @ligappt
          </a>
        </Card>

        {/* Instagram */}
        <Card className="flex flex-col items-center justify-center p-6 text-center bg-white hover:shadow-lg transition-shadow">
          <FaInstagram className="mb-3 text-purple-600" size={32} />
          <h3 className="mb-2 text-lg font-bold text-gray-800">Instagram</h3>
          <p className="mb-4 text-sm text-gray-600">
            Resúmenes rápidos, premios de goleador, mejor arquero, MVPs y más
          </p>
          <a
            href="https://www.instagram.com/ligappt?igsh=MXRyeTBsNTZlMHNhNQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded hover:bg-purple-700 transition"
          >
            @ligappt
          </a>
        </Card>
      </div>
    </div>
  </div>
);
