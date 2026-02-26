const variants = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600/30',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300/50',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/30',
  ghost:     'text-gray-600 hover:bg-gray-100 focus:ring-gray-300/50',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 rounded-lg font-semibold transition
        focus:outline-none focus:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
