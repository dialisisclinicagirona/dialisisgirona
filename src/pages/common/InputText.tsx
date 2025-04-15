import { DadaPacient } from "../../types/supabase";

type Pacient = DadaPacient;
type InputProps = {
    label: string;
    pacient: Pacient;
    prop: keyof Pacient;
    onPacientChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmitChange?: () => void;
};
const InputText = ({label, pacient, prop, onPacientChange, onSubmitChange}: InputProps) => {
    return (
    <>
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor={`grid-${prop}`}>
            {label}
        </label>
        <input className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id={`grid-${prop}`}
            name={prop}
            type="text" 
            value={pacient[prop]}
            onChange={onPacientChange}
            onBlur={(onSubmitChange)} />
    </>);
};

export default InputText;