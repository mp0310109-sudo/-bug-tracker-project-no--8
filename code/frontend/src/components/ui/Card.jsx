import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const Component = hover ? motion.div : 'div';

  return (
    <Component
      {...(hover && {
        whileHover: { y: -4, scale: 1.01 },
        transition: { duration: 0.2 },
      })}
      onClick={onClick}
      className={`
        card-enhanced rounded-xl
        ${hover ? 'cursor-pointer hover-glow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-slate-700/50 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-slate-700/50 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;