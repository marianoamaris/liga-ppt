import React from "react";
import { THEME } from "../../constants/theme";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

export const SignIn: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center relative">
    {/* Fondo difuminado */}
    <div
      className="absolute inset-0 bg-cover bg-center filter blur-lg"
      style={{ backgroundImage: `url(${THEME.logo.escudo})` }}
    />
    {/* Overlay oscuro */}
    <div className="absolute inset-0 bg-black opacity-50" />
    <div className="relative z-10 w-full max-w-sm px-4">
      <Card className="bg-gray-800 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        <form className="flex flex-col">
          <Input
            label="Usuario"
            placeholder="Ingresa tu usuario"
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-white"
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-white"
          />
          <Button className="bg-black text-white mt-4 hover:bg-gray-700">
            Iniciar sesión
          </Button>
        </form>
      </Card>
    </div>
  </div>
);
