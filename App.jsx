import React from 'react'
import Card, { CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './Card'

function App() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          Card Component Demo
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Comprehensive card components with meaningful validation and multiple variants
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Basic Cards */}
          <Card
            title="Welcome Card"
            description="This is a default card showcasing the basic styling and layout. Perfect for general content display."
          />

          <Card
            variant="featured"
            title="Premium Feature"
            description="A featured card with special styling to highlight important content or premium offerings."
          />

          <Card
            variant="interactive"
            title="Interactive Card"
            description="Click me! This card responds to user interactions with hover effects and animations."
            onClick={() => alert('Interactive card clicked!')}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Status Cards */}
          <Card
            variant="status"
            status="success"
            title="Success Message"
            description="Your operation completed successfully! All changes have been saved and synchronized."
          />

          <Card
            variant="status" 
            status="warning"
            title="Important Notice"
            description="Please review your settings. Some configurations may need attention before proceeding."
          />

          <Card
            variant="status"
            status="error"
            title="Error Occurred"
            description="Something went wrong while processing your request. Please try again or contact support."
          />

          <Card
            variant="status"
            status="info"
            title="Information"
            description="New features are available in this update. Check out the enhanced user interface and performance improvements."
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Size Variations */}
          <Card
            size="sm"
            title="Small Card"
            description="Compact card with reduced spacing, ideal for dashboard widgets or sidebar content."
          />

          <Card
            size="default"
            title="Default Size"
            description="Standard card size with balanced spacing and readability for most use cases."
          />

          <Card
            size="lg"
            title="Large Card"
            description="Spacious card with generous padding, perfect for detailed content presentations."
          />
        </div>

        {/* Complex Card with Custom Content */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', 
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Project Dashboard
            </h3>
          </div>
          <div style={{ paddingTop: 0 }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              Monitor your project's progress with real-time analytics and team collaboration tools.
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid rgb(229 231 235 / 0.5)',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', gap: '-0.5rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: 'rgb(59 130 246 / 0.2)',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>A</div>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: 'rgb(16 185 129 / 0.2)',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '500',
                marginLeft: '-0.5rem'
              }}>B</div>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: 'rgb(245 158 11 / 0.2)',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '500',
                marginLeft: '-0.5rem'
              }}>+3</div>
            </div>
            <button style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              View Details
            </button>
          </div>
        </div>

        {/* Validation Examples */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            Validation Examples
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <Card
              title=""
              description="This card shows validation error handling when title is empty"
              showValidation={true}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Card
              title="Same Content"
              description="Same Content"
              showValidation={true}
            />
          </div>
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            🎉 Card component successfully integrated with comprehensive validation, multiple variants, and accessibility features!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App