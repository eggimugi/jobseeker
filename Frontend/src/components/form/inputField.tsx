const InputField = ({
  id,
  name,
  type = "text",
  label,
  value,
  error,
  placeholder,
  onChange,
  onBlur,
  required = true,
  disabled = false,
  autoComplete = "off",
}: {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string | number;
  error?: string | null;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm md:text-base font-medium">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      autoComplete={autoComplete}
      className="w-full border-b border-gray-300 bg-transparent outline-none py-2 text-sm md:text-base focus:border-orange-600 transition-colors"
      placeholder={placeholder}
    />
    <p
      className={`mt-1 text-xs md:text-sm ${
        error ? "text-red-600" : "invisible"
      }`}
    >
      {error || "placeholder"}
    </p>
  </div>
);

export default InputField;
