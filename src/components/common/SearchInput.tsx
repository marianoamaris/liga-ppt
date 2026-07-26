import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Buscar por nombre o apodo",
  value,
  onChange,
}) => (
  <div className="flex w-full max-w-md items-center gap-2 rounded-sm border border-line bg-surface px-3 focus-within:border-chalk-3">
    <FiSearch aria-hidden className="size-4 shrink-0 text-chalk-3" />
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={placeholder}
      // El placeholder necesita el mismo contraste que el texto: en chalk-3
      // llega a 4.9:1, mientras que el gris por defecto se queda muy corto.
      className="w-full bg-transparent py-2.5 text-sm text-chalk placeholder:text-chalk-3 focus:outline-none"
    />
  </div>
);

export default SearchInput;
