const variants = {
  low: 'priority-low text-white',
  medium: 'priority-medium text-white',
  high: 'priority-high text-white',
  critical: 'priority-critical text-white',
  todo: 'status-todo text-white',
  inprogress: 'status-inprogress text-white',
  done: 'status-done text-white',
  admin: 'role-admin text-white',
  manager: 'role-manager text-white',
  developer: 'role-developer text-white',
  viewer: 'role-viewer text-white',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const Badge = ({
  children,
  variant = 'low',
  size = 'md',
  className = '',
  dot = false,
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        badge-enhanced
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full ${variants[variant].split(' ')[0]}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;