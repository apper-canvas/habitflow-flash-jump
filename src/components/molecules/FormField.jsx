import Input from '@/components/atoms/Input';

function FormField({ label, id, value, onChange, placeholder, type = 'text', onKeyDown, autoFocus }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
      />
    </div>
  );
}

export default FormField;