const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const Avatar = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getColorFromName = (name) => {
    if (!name) return 'bg-slate-600';
    const colors = [
      'bg-gradient-to-br from-red-500 to-rose-500',
      'bg-gradient-to-br from-orange-500 to-amber-500',
      'bg-gradient-to-br from-amber-500 to-yellow-500',
      'bg-gradient-to-br from-yellow-500 to-lime-500',
      'bg-gradient-to-br from-lime-500 to-green-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-emerald-500 to-teal-500',
      'bg-gradient-to-br from-teal-500 to-cyan-500',
      'bg-gradient-to-br from-cyan-500 to-sky-500',
      'bg-gradient-to-br from-sky-500 to-blue-500',
      'bg-gradient-to-br from-blue-500 to-indigo-500',
      'bg-gradient-to-br from-indigo-500 to-violet-500',
      'bg-gradient-to-br from-violet-500 to-purple-500',
      'bg-gradient-to-br from-purple-500 to-fuchsia-500',
      'bg-gradient-to-br from-fuchsia-500 to-pink-500',
      'bg-gradient-to-br from-pink-500 to-rose-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover avatar-enhanced ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizes[size]} ${getColorFromName(name)} rounded-full 
        flex items-center justify-center font-bold text-white
        avatar-enhanced ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;