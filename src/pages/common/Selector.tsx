import { DadaPacient, Option } from "../../types/supabase";

type Pacient = DadaPacient;

type SelectProps = {
  label: string;
  pacient: Pacient;
  prop: keyof Pacient;
  options: Option[];
  onPacientChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmitChange?: () => void;
};

const SelectInput = ({ label, pacient, prop, options, onPacientChange, onSubmitChange }: SelectProps) => {
  return (
    <>
      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor={`grid-${prop}`}>
        {label}
      </label>
      <select
        className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id={`grid-${prop}`}
        name={prop}
        value={pacient[prop] ?? ""}
        onChange={onPacientChange}
        onBlur={onSubmitChange}
      >
        <option value="">Selecciona</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nom}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectInput;