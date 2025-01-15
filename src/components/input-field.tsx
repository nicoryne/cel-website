import { Input } from 'postcss';

export type InputFieldProps = {
  id: string;
  label: string;
  type: string;
  value: any;
  onChange: (e: string) => void;
};

export default function InputField({
  id,
  label,
  type,
  value,
  onChange
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
