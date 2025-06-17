import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Buscar un jugador",
  value,
  onChange,
}) => {
  return (
    <div className="w-full max-w-md mb-4 flex items-center gap-x-2 rounded-md border border-gray-300 px-2">
      <FiSearch className="text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-2 text-sm outline-none"
      />
    </div>
  );
};

export default SearchInput;
