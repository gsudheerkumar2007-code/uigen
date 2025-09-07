import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Card, { CardHeader, CardContent, CardFooter, CardTitle, CardDescription, validateCardProps } from '../Card'

describe('Card Component', () => {
  const defaultProps = {
    title: 'Test Card Title',
    description: 'Test card description with meaningful content for validation testing.'
  }

  describe('Basic Rendering', () => {
    it('renders with title and description', () => {
      render(<Card {...defaultProps} />)
      
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByText('Test Card Title')).toBeInTheDocument()
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument()
    })

    it('applies correct accessibility attributes', () => {
      render(<Card {...defaultProps} />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-labelledby', 'card-title')
      expect(card).toHaveAttribute('aria-describedby', 'card-description')
    })

    it('applies custom className', () => {
      render(<Card {...defaultProps} className="custom-class" />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('Variants', () => {
    it('applies default variant correctly', () => {
      render(<Card {...defaultProps} />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveClass('border-border', 'bg-card')
    })

    it('applies featured variant correctly', () => {
      render(<Card {...defaultProps} variant="featured" />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveClass('border-primary/20')
    })

    it('applies interactive variant and handles clicks', () => {
      const handleClick = vi.fn()
      render(<Card {...defaultProps} variant="interactive" onClick={handleClick} />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveClass('cursor-pointer')
      
      fireEvent.click(card)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies compact variant correctly', () => {
      render(<Card {...defaultProps} variant="compact" />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-3')
    })

    it('applies status variant with different statuses', () => {
      const { rerender } = render(<Card {...defaultProps} variant="status" status="success" />)
      
      let card = screen.getByRole('article')
      expect(card).toHaveClass('border-l-green-500')

      rerender(<Card {...defaultProps} variant="status" status="error" />)
      card = screen.getByRole('article')
      expect(card).toHaveClass('border-l-red-500')

      rerender(<Card {...defaultProps} variant="status" status="warning" />)
      card = screen.getByRole('article')
      expect(card).toHaveClass('border-l-amber-500')

      rerender(<Card {...defaultProps} variant="status" status="info" />)
      card = screen.getByRole('article')
      expect(card).toHaveClass('border-l-blue-500')
    })
  })

  describe('Sizes', () => {
    it('applies small size correctly', () => {
      render(<Card {...defaultProps} size="sm" />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-4', 'space-y-2')
    })

    it('applies default size correctly', () => {
      render(<Card {...defaultProps} />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-6', 'space-y-4')
    })

    it('applies large size correctly', () => {
      render(<Card {...defaultProps} size="lg" />)
      
      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-8', 'space-y-6')
    })
  })

  describe('Validation', () => {
    it('shows validation error for empty title', () => {
      render(<Card title="" description="Valid description" showValidation={true} />)
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Invalid Card Configuration')).toBeInTheDocument()
      expect(screen.getByText(/Card title is required/)).toBeInTheDocument()
    })

    it('shows validation error for empty description', () => {
      render(<Card title="Valid title" description="" showValidation={true} />)
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/Card description is required/)).toBeInTheDocument()
    })

    it('shows validation error for title too long', () => {
      const longTitle = 'a'.repeat(101)
      render(<Card title={longTitle} description="Valid description" showValidation={true} />)
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/Card title is too long/)).toBeInTheDocument()
    })

    it('shows validation error for description too long', () => {
      const longDescription = 'a'.repeat(501)
      render(<Card title="Valid title" description={longDescription} showValidation={true} />)
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/Card description is too long/)).toBeInTheDocument()
    })

    it('shows validation error for identical title and description', () => {
      render(<Card title="Same content" description="Same content" showValidation={true} />)
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/Card title and description should be different/)).toBeInTheDocument()
    })

    it('calls onValidationChange when validation state changes', async () => {
      const onValidationChange = vi.fn()
      
      render(
        <Card 
          title="Valid title" 
          description="Valid description" 
          onValidationChange={onValidationChange}
        />
      )
      
      await waitFor(() => {
        expect(onValidationChange).toHaveBeenCalledWith({
          isValid: true,
          message: 'Card content is valid and provides meaningful information to users.'
        })
      })
    })

    it('does not show validation errors when showValidation is false', () => {
      render(<Card title="" description="Valid description" showValidation={false} />)
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByText('Invalid Card Configuration')).not.toBeInTheDocument()
    })
  })

  describe('Sub-components', () => {
    it('renders CardHeader correctly', () => {
      render(
        <div>
          <CardHeader data-testid="card-header">
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
        </div>
      )
      
      const header = screen.getByTestId('card-header')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5')
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('renders CardContent correctly', () => {
      render(
        <div>
          <CardContent data-testid="card-content">
            <CardDescription>Test content</CardDescription>
          </CardContent>
        </div>
      )
      
      const content = screen.getByTestId('card-content')
      expect(content).toHaveClass('pt-0')
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('renders CardFooter correctly', () => {
      render(
        <div>
          <CardFooter data-testid="card-footer">
            Footer content
          </CardFooter>
        </div>
      )
      
      const footer = screen.getByTestId('card-footer')
      expect(footer).toHaveClass('flex', 'items-center', 'pt-4', 'border-t')
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('renders CardTitle with correct heading level', () => {
      render(<CardTitle>Test Title</CardTitle>)
      
      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight', 'text-lg')
    })

    it('renders CardDescription with correct styling', () => {
      render(<CardDescription>Test description</CardDescription>)
      
      const description = screen.getByText('Test description')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground', 'leading-relaxed')
    })
  })
})

describe('validateCardProps Function', () => {
  it('validates correct props as valid', () => {
    const result = validateCardProps('Valid Title', 'Valid description with enough content')
    
    expect(result.isValid).toBe(true)
    expect(result.message).toBe('Card content is valid and provides meaningful information to users.')
  })

  it('invalidates empty title', () => {
    const result = validateCardProps('', 'Valid description')
    
    expect(result.isValid).toBe(false)
    expect(result.message).toContain('Card title is required')
  })

  it('invalidates whitespace-only title', () => {
    const result = validateCardProps('   ', 'Valid description')
    
    expect(result.isValid).toBe(false)
    expect(result.message).toContain('Card title is required')
  })

  it('invalidates empty description', () => {
    const result = validateCardProps('Valid title', '')
    
    expect(result.isValid).toBe(false)
    expect(result.message).toContain('Card description is required')
  })

  it('invalidates title too long', () => {
    const longTitle = 'a'.repeat(101)
    const result = validateCardProps(longTitle, 'Valid description')
    
    expect(result.isValid).toBe(false)
    expect(result.message).toContain('Card title is too long')
    expect(result.message).toContain('101/100 characters')
  })

  it('invalidates description too long', () => {
    const longDescription = 'a'.repeat(501)
    const result = validateCardProps('Valid title', longDescription)
    
    expect(result.isValid).toBe(false)
    expect(result.message).toContain('Card description is too long')
    expect(result.message).toContain('501/500 characters')
  })

  it('invalidates identical title and description', () => {
    const result = validateCardProps('Same content', 'Same content')
    
    expect(result.isValid).toBe(false)
    expect(result.message).toContain('Card title and description should be different')
  })

  it('handles case-insensitive identical content', () => {
    const result = validateCardProps('Same Content', 'same content')
    
    expect(result.isValid).toBe(false)
    expect(result.message).toContain('Card title and description should be different')
  })

  it('validates content after trimming whitespace', () => {
    const result = validateCardProps('  Valid Title  ', '  Valid description  ')
    
    expect(result.isValid).toBe(true)
  })
})