import React from "react";

interface DateInputProps {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, name, value, disabled, onChange, onBlur }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
      >
        {label}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      />
    </div>
  );
};

export default DateInput;
