import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Textarea = forwardRef(({
  label,
  error,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          {label}
        </label>
      )}
      <motion.textarea
        ref={ref}
        rows={rows}
        whileFocus={{ scale: 1.01 }}
        className={`
          w-full px-4 py-3 rounded-xl bg-slate-800/50 text-slate-100
          placeholder-slate-500 border-2 border-slate-700/50 
          transition-all duration-300 resize-none
          focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800/70
          focus:shadow-lg focus:shadow-indigo-500/10
          ${error 
            ? 'border-red-500/50 focus:border-red-500/50 focus:shadow-red-500/10' 
            : 'hover:border-slate-600/50'
          }
          ${className}
        `}
        {...props}
      />
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

Textarea.displayName = 'Textarea';

export default Textarea;