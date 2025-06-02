import { DadaPacient, Option } from "../../types/supabase";

type Pacient = DadaPacient;

type SelectProps = {
  required?: boolean;
  selectText?: string;
  label: string;
  value: string;
  prop: keyof Pacient | string;
  options: Option[];
  disabled?: boolean;
  onValueChanged?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit?: () => void;
};

const SelectInput = ({ required, selectText, label, value, prop, options, disabled, onValueChanged, onSubmit }: SelectProps) => {
  return (
    <>
      <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor={`grid-${prop}`}>
        {label}
      </label>
      <select
        className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id={`grid-${prop}`}
        disabled={disabled}
        name={prop}
        value={value ?? ""}
        onChange={onValueChanged}
        onBlur={onSubmit}
      >

        {!required && <option value="">{selectText || "Selecciona"}</option>}
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