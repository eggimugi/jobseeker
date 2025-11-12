const TextAreaField = ({
  id,
  name,
  label,
  value,
  error,
  placeholder,
  onChange,
  onBlur,
  rows = 4,
  required = true,
  showCharCount = false,
  minChars = 20,
  disabled = false,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string | null;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  required?: boolean;
  showCharCount?: boolean;
  minChars?: number;
  disabled?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm md:text-base font-medium">
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      required={required}
      rows={rows}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="w-full border-b border-gray-300 bg-transparent outline-none py-2 text-sm md:text-base focus:border-orange-600 transition-colors resize-none"
      placeholder={placeholder}
    />
    <p
      className={`mt-1 text-xs md:text-sm ${
        error ? "text-red-600" : "invisible"
      }`}
    >
      {error || "placeholder"}
    </p>
    {showCharCount && (
      <p className="mt-1 text-xs md:text-sm text-gray-500">
        {value.length}/{minChars} minimum characters
      </p>
    )}
  </div>
);

export default TextAreaField;
