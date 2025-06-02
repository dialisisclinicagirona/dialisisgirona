import { DadaPacient } from "../../types/supabase";

type Pacient = DadaPacient;
type InputProps = {
    label: string;
    value: string;
    prop: keyof Pacient | string;
    disabled?: boolean;
    onValueChanged?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit?: () => void;
};
const TextAreaInput = ({label, value, prop, disabled, onValueChanged, onSubmit}: InputProps) => {
    return (
    <>
        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-1" htmlFor={`grid-${prop}`}>
            {label}
        </label>
        <textarea className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id={`grid-${prop}`}
            name={prop}
            value={value}
            disabled={disabled}
            onChange={onValueChanged}
            onBlur={(onSubmit)} />
    </>);
};

export default TextAreaInput;