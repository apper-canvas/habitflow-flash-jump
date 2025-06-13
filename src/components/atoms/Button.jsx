import { motion } from 'framer-motion';

function Button({ children, onClick, className = '', type = 'button', disabled = false, whileHover, whileTap, ...rest }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export default Button;