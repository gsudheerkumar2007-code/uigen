import React, { useState } from "react"
import Card, { CardHeader, CardContent, CardFooter, CardTitle, CardDescription, type CardValidation } from "./Card"
import { Button } from "@/components/ui/button"

export function CardExamples() {
  const [validationState, setValidationState] = useState<CardValidation | null>(null)

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Card Component Examples</h1>
        <p className="text-muted-foreground mb-8">
          Comprehensive examples showing various card configurations with meaningful field validation.
        </p>

        {/* Basic Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Basic Card Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Default Card"
              description="This is a standard card with default styling. It provides a clean, minimal appearance suitable for most content types."
            />

            <Card
              variant="featured"
              title="Featured Product"
              description="A premium card variant with gradient background and enhanced shadows, perfect for highlighting important content or special offers."
            />

            <Card
              variant="interactive"
              title="Interactive Card"
              description="This card responds to user interactions with hover effects and click animations, ideal for clickable content areas."
              onClick={() => alert("Interactive card clicked!")}
            />
          </div>
        </section>

        {/* Size Variations */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Size Variations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              size="sm"
              title="Small Card"
              description="Compact card with reduced padding and spacing, perfect for dashboard widgets or sidebar content."
            />

            <Card
              size="default"
              title="Default Size"
              description="Standard card size providing balanced content spacing and readability for most use cases."
            />

            <Card
              size="lg"
              title="Large Card"
              description="Spacious card layout with generous padding, ideal for detailed content presentations or hero sections."
            />
          </div>
        </section>

        {/* Status Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Status Indicators</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              variant="status"
              status="success"
              title="Success Notification"
              description="Your changes have been saved successfully. All data has been synchronized across your devices."
            />

            <Card
              variant="status" 
              status="warning"
              title="Warning Alert"
              description="Your subscription will expire in 3 days. Please update your payment method to continue using premium features."
            />

            <Card
              variant="status"
              status="error"
              title="Error State"
              description="Failed to connect to the server. Please check your internet connection and try again."
            />

            <Card
              variant="status"
              status="info"
              title="Information"
              description="New features are available! Explore the updated interface and discover productivity enhancements."
            />
          </div>
        </section>

        {/* Advanced Examples with Footer */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Cards with Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage your account settings, privacy preferences, and notification options. Keep your profile information up to date.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm">Edit Profile</Button>
                <Button variant="outline" size="sm">View Details</Button>
              </CardFooter>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View comprehensive analytics for your project including user engagement, performance metrics, and growth trends.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last updated: 2 hours ago</span>
                <Button size="sm">View Report</Button>
              </CardFooter>
            </div>
          </div>
        </section>

        {/* Validation Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Validation & Error Handling</h2>
          
          <div className="space-y-4">
            <Card
              title=""
              description="This card demonstrates validation error handling when the title is empty"
              showValidation={true}
              onValidationChange={setValidationState}
            />

            <Card
              title="Valid Card Title"
              description=""
              showValidation={true}
            />

            <Card
              title="This is an extremely long title that exceeds the maximum character limit and should trigger a validation error message"
              description="This demonstrates how the validation system handles overly long titles"
              showValidation={true}
            />

            <Card
              title="Duplicate Content"
              description="Duplicate Content"
              showValidation={true}
            />
          </div>

          {validationState && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Validation State:</p>
              <p className="text-sm text-muted-foreground mt-1">
                {validationState.message}
              </p>
            </div>
          )}
        </section>

        {/* Real-world Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Real-world Scenarios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              variant="featured"
              title="Premium Plan"
              description="Unlock advanced features with our premium subscription. Get unlimited access, priority support, and exclusive content."
            />

            <Card
              variant="interactive"
              title="Team Collaboration"
              description="Invite team members to collaborate on projects. Share files, communicate in real-time, and track progress together."
              onClick={() => console.log("Navigate to team page")}
            />

            <Card
              variant="status"
              status="warning"
              size="sm"
              title="Storage Warning"
              description="You're using 85% of your storage space. Consider upgrading or cleaning up old files."
            />

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Organize your workflow with our intuitive task management system. Set priorities, track deadlines, and collaborate efficiently.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium">A</div>
                  <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium">B</div>
                  <div className="w-8 h-8 rounded-full bg-accent border-2 border-background flex items-center justify-center text-xs font-medium">+3</div>
                </div>
                <Button size="sm">Join Project</Button>
              </CardFooter>
            </div>

            <Card
              variant="compact"
              title="Quick Stats"
              description="Monitor key performance indicators and metrics at a glance with real-time data updates."
            />

            <Card
              title="Learning Resources"
              description="Access our comprehensive library of tutorials, documentation, and community guides to master the platform."
            />
          </div>
        </section>
      </div>
    </div>
  )
}