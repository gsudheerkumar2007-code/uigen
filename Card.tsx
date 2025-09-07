import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border bg-card hover:shadow-md",
        featured: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-md hover:shadow-lg",
        interactive: "border-border bg-card hover:border-primary/40 hover:shadow-md cursor-pointer active:scale-[0.98]",
        compact: "border-border bg-card p-3 shadow-xs hover:shadow-sm",
        status: "border-l-4 bg-card shadow-sm",
      },
      size: {
        sm: "p-4 space-y-2",
        default: "p-6 space-y-4", 
        lg: "p-8 space-y-6",
      },
      status: {
        none: "",
        success: "border-l-green-500 bg-green-50/50 dark:bg-green-950/10",
        warning: "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/10", 
        error: "border-l-red-500 bg-red-50/50 dark:bg-red-950/10",
        info: "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default", 
      status: "none",
    },
  }
)

interface CardValidation {
  isValid: boolean
  message: string
}

function validateCardProps(title: string, description: string): CardValidation {
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

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  title: string
  description: string
  showValidation?: boolean
  onValidationChange?: (validation: CardValidation) => void
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    status, 
    title, 
    description, 
    showValidation = false,
    onValidationChange,
    ...props 
  }, ref) => {
    const validation = validateCardProps(title, description)
    
    React.useEffect(() => {
      onValidationChange?.(validation)
    }, [validation, onValidationChange])

    if (!validation.isValid && showValidation) {
      return (
        <div
          ref={ref}
          className={cn(
            cardVariants({ variant: "status", size, status: "error", className }),
            "animate-in slide-in-from-left-1 duration-200"
          )}
          role="alert"
          aria-live="polite"
          {...props}
        >
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Invalid Card Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 dark:text-red-300">
              {validation.message}
            </p>
          </CardContent>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, status, className }))}
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
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight text-lg", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("pt-0", className)} 
      {...props} 
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4 border-t border-border/50", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants,
  validateCardProps,
  type CardValidation
}

export default Card