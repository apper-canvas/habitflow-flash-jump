function Input({ value, onChange, placeholder, type = 'text', className = '', onKeyDown, autoFocus, id, name, ...rest }) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
      {...rest}
    />
  );
}

export default Input;