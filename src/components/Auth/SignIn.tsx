import React from "react";
import { useForm } from "react-hook-form";
import { THEME } from "../../constants/theme";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

interface SignInForm {
  username: string;
  password: string;
}

export const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>();

  const onSubmit = async (data: SignInForm) => {
    // Aquí iría la lógica real de autenticación
    alert(`Usuario: ${data.username}\nContraseña: ${data.password}`);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Fondo difuminado */}
      <div
        className="absolute inset-0 bg-center bg-cover filter blur-lg"
        style={{ backgroundImage: `url(${THEME.logo.escudo})` }}
      />
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 w-full max-w-sm px-4">
        <Card className="text-white bg-gray-800 shadow-xl">
          <h2 className="mb-2 text-2xl font-bold text-center">
            Iniciar sesión
          </h2>
          <p className="mb-6 text-sm text-center text-gray-300">
            <span className="font-semibold text-blue-300">
              Solo jugadores y administradores
            </span>{" "}
            pueden iniciar sesión.
            <br />
            Las cuentas serán{" "}
            <span className="font-semibold text-blue-200">
              proporcionadas por la administración
            </span>
            .<br />
            Si no tienes usuario, contacta a la organización de la Liga PPT.
          </p>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <Input
              label="Usuario"
              placeholder="Ingresa tu usuario"
              className={`bg-gray-700 text-white placeholder-gray-400 border-2 focus:ring-white ${
                errors.username ? "border-red-500" : "border-gray-600"
              }`}
              {...register("username", {
                required: "El usuario es obligatorio",
              })}
              autoFocus
            />
            {errors.username && (
              <span className="mb-2 ml-1 text-xs text-red-400">
                {errors.username.message}
              </span>
            )}
            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              className={`bg-gray-700 text-white placeholder-gray-400 border-2 focus:ring-white ${
                errors.password ? "border-red-500" : "border-gray-600"
              }`}
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
            />
            {errors.password && (
              <span className="mb-2 ml-1 text-xs text-red-400">
                {errors.password.message}
              </span>
            )}
            <Button
              className="py-2 mt-4 text-lg font-bold text-white transition bg-blue-600 shadow hover:bg-blue-700"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
