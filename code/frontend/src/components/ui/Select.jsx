import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <motion.select
          ref={ref}
          whileFocus={{ scale: 1.01 }}
          className={`
            w-full px-4 py-3 rounded-xl bg-slate-800/50 text-slate-100
            border-2 border-slate-700/50 appearance-none cursor-pointer
            transition-all duration-300
            focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800/70
            focus:shadow-lg focus:shadow-indigo-500/10
            ${error 
              ? 'border-red-500/50 focus:border-red-500/50 focus:shadow-red-500/10' 
              : 'hover:border-slate-600/50'
            }
            ${className}
          `}
          {...props}
        >
          <option value="" disabled className="text-slate-500">
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-slate-800 text-slate-100"
            >
              {option.label}
            </option>
          ))}
        </motion.select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400 flex items-center gap-1"
        >
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </motion.p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;