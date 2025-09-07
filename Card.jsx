import React from 'react'

// Validation function
function validateCardProps(title, description) {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      message: "Card title is required and cannot be empty. Please provide a meaningful title to describe your content."
    }
  }

  if (title.length > 100) {
    return {
      isValid: false, 
      message: `Card title is too long (${title.length}/100 characters). Please use a concise title that summarizes your content effectively.`
    }
  }

  if (!description || description.trim().length === 0) {
    return {
      isValid: false,
      message: "Card description is required and cannot be empty. Please provide a clear description to give users context about your content."
    }
  }

  if (description.length > 500) {
    return {
      isValid: false,
      message: `Card description is too long (${description.length}/500 characters). Please provide a concise description that highlights the key information.`
    }
  }

  if (title.trim().toLowerCase() === description.trim().toLowerCase()) {
    return {
      isValid: false,
      message: "Card title and description should be different. The description should provide additional context beyond the title."
    }
  }

  return {
    isValid: true,
    message: "Card content is valid and provides meaningful information to users."
  }
}

// Helper function to combine class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Base card styles
const cardBaseStyles = {
  borderRadius: '0.5rem',
  border: '1px solid #e5e7eb',
  backgroundColor: 'white',
  color: '#1f2937',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  transition: 'all 0.2s'
}

// Variant styles
const variantStyles = {
  default: {
    ...cardBaseStyles,
    ':hover': {
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    }
  },
  featured: {
    ...cardBaseStyles,
    border: '1px solid rgb(59 130 246 / 0.2)',
    background: 'linear-gradient(to bottom right, rgb(59 130 246 / 0.05), rgb(59 130 246 / 0.1))',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  interactive: {
    ...cardBaseStyles,
    cursor: 'pointer',
    ':hover': {
      borderColor: 'rgb(59 130 246 / 0.4)',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    },
    ':active': {
      transform: 'scale(0.98)'
    }
  },
  compact: {
    ...cardBaseStyles,
    padding: '0.75rem',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
  },
  status: {
    ...cardBaseStyles,
    borderLeftWidth: '4px'
  }
}

// Size styles
const sizeStyles = {
  sm: { padding: '1rem', gap: '0.5rem' },
  default: { padding: '1.5rem', gap: '1rem' },
  lg: { padding: '2rem', gap: '1.5rem' }
}

// Status styles
const statusStyles = {
  success: {
    borderLeftColor: '#10b981',
    backgroundColor: 'rgb(34 197 94 / 0.05)'
  },
  warning: {
    borderLeftColor: '#f59e0b',
    backgroundColor: 'rgb(245 158 11 / 0.05)'
  },
  error: {
    borderLeftColor: '#ef4444',
    backgroundColor: 'rgb(239 68 68 / 0.05)'
  },
  info: {
    borderLeftColor: '#3b82f6',
    backgroundColor: 'rgb(59 130 246 / 0.05)'
  },
  none: {}
}

// Sub-components
const CardHeader = ({ className = '', children, ...props }) => (
  <div
    className={cn('flex flex-col', className)}
    style={{ marginBottom: '0.375rem' }}
    {...props}
  >
    {children}
  </div>
)

const CardTitle = ({ className = '', children, ...props }) => (
  <h3
    className={cn('font-semibold leading-none tracking-tight', className)}
    style={{ 
      fontSize: '1.125rem',
      fontWeight: '600',
      lineHeight: '1',
      letterSpacing: '-0.025em',
      marginBottom: '0.5rem'
    }}
    {...props}
  >
    {children}
  </h3>
)

const CardDescription = ({ className = '', children, ...props }) => (
  <p
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    style={{
      fontSize: '0.875rem',
      color: '#6b7280',
      lineHeight: '1.6'
    }}
    {...props}
  >
    {children}
  </p>
)

const CardContent = ({ className = '', children, ...props }) => (
  <div 
    className={cn('', className)}
    style={{ paddingTop: 0 }}
    {...props}
  >
    {children}
  </div>
)

const CardFooter = ({ className = '', children, ...props }) => (
  <div
    className={cn('flex items-center', className)}
    style={{
      paddingTop: '1rem',
      borderTop: '1px solid rgb(229 231 235 / 0.5)',
      display: 'flex',
      alignItems: 'center'
    }}
    {...props}
  >
    {children}
  </div>
)

// Main Card component
const Card = React.forwardRef(({ 
  className = '',
  variant = 'default',
  size = 'default',
  status = 'none',
  title,
  description,
  showValidation = false,
  onValidationChange,
  style = {},
  children,
  ...props 
}, ref) => {
  const validation = validateCardProps(title, description)
  
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation)
    }
  }, [validation, onValidationChange])

  if (!validation.isValid && showValidation) {
    return (
      <div
        ref={ref}
        className={cn('card card-error', className)}
        style={{
          ...variantStyles.status,
          ...sizeStyles[size],
          ...statusStyles.error,
          ...style
        }}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <CardHeader>
          <CardTitle style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Invalid Card Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>
            {validation.message}
          </p>
        </CardContent>
      </div>
    )
  }

  // If custom children are provided, render them instead of default structure
  if (children) {
    return (
      <div
        ref={ref}
        className={cn('card', className)}
        style={{
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...(variant === 'status' ? statusStyles[status] : {}),
          ...style
        }}
        role="article"
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn('card', className)}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...(variant === 'status' ? statusStyles[status] : {}),
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
      role="article"
      aria-labelledby="card-title"
      aria-describedby="card-description"
      {...props}
    >
      <CardHeader>
        <CardTitle id="card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription id="card-description">{description}</CardDescription>
      </CardContent>
    </div>
  )
})

Card.displayName = "Card"

// Export sub-components for custom usage
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, validateCardProps }
export default Card