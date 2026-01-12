# Authentication Standards

This document outlines the coding standards and patterns for authentication in this lifting diary application.

## Authentication Provider

**Primary Provider**: [Clerk](https://clerk.com/)

This application uses Clerk as the primary authentication service. All authentication-related code must follow Clerk's patterns and best practices.

## Core Principles

1. **Clerk-first approach**: Always use Clerk's provided components and hooks
2. **Server-side protection**: Protect API routes and server components using Clerk's auth helpers
3. **Type safety**: Leverage TypeScript with Clerk's type definitions
4. **Consistent patterns**: Follow established Clerk conventions throughout the codebase

## Required Dependencies

```json
{
  "@clerk/nextjs": "^latest",
  "@clerk/themes": "^latest"
}
```

## Configuration Standards

### Environment Variables
```bash
# Required Clerk environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional but recommended
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Middleware Setup
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/protected(.*)'
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

## Component Standards

### Layout Integration
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### Sign In/Sign Up Pages
```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <SignIn />
}

// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp />
}
```

### User Button Component
```typescript
// Use Clerk's UserButton for user management
import { UserButton } from '@clerk/nextjs'

export function Header() {
  return (
    <header>
      <UserButton afterSignOutUrl="/" />
    </header>
  )
}
```

## Authentication Hooks and Utilities

### Client-Side Authentication
```typescript
import { useUser, useAuth } from '@clerk/nextjs'

// Get current user information
const { user, isLoaded, isSignedIn } = useUser()

// Get authentication state and methods
const { signOut, sessionId, userId } = useAuth()
```

### Server-Side Authentication
```typescript
// Server Components
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function ProtectedPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId) {
    redirect('/sign-in')
  }

  return <div>Protected content</div>
}
```

### API Route Protection
```typescript
// app/api/protected/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Protected API logic
  return NextResponse.json({ data: 'protected data' })
}
```

## Database Integration

### User ID Storage
- Always use Clerk's `userId` as the primary identifier
- Store `userId` as a string type in database schemas
- Never store sensitive user data locally - use Clerk's user object

```typescript
// Example database schema (Drizzle ORM)
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(), // Clerk userId
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
```

## Error Handling

### Authentication Errors
```typescript
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'

try {
  // Clerk operation
} catch (error) {
  if (isClerkAPIResponseError(error)) {
    // Handle Clerk-specific errors
    console.error('Clerk error:', error.errors)
  }
}
```

## Security Best Practices

1. **Never expose secret keys**: Keep `CLERK_SECRET_KEY` server-side only
2. **Validate on both ends**: Check authentication client and server-side
3. **Use HTTPS**: Always use HTTPS in production
4. **Session management**: Let Clerk handle session lifecycle
5. **User data**: Fetch user data from Clerk, not local storage

## Styling and Theming

### Custom Appearance
```typescript
// Customize Clerk components appearance
import { dark } from '@clerk/themes'

<ClerkProvider appearance={{
  baseTheme: dark,
  variables: {
    colorPrimary: 'your-brand-color',
  },
  elements: {
    formButtonPrimary: 'your-custom-classes',
  },
}}>
```

## Testing Considerations

1. **Mock Clerk hooks** in tests using `@clerk/testing`
2. **Test auth flows** with Clerk's testing utilities
3. **Environment setup** for test environments

## Migration and Updates

- Follow Clerk's migration guides for version updates
- Test authentication flows after any Clerk package updates
- Monitor Clerk's changelog for breaking changes

## Forbidden Patterns

❌ **Do NOT:**
- Implement custom authentication logic
- Store passwords or sensitive auth data
- Bypass Clerk's authentication checks
- Use other auth providers alongside Clerk
- Manually manage session storage

✅ **Do:**
- Use Clerk's provided components and hooks
- Follow Clerk's routing conventions
- Leverage Clerk's built-in security features
- Keep authentication logic centralized through Clerk

## Support and Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Integration Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Community Discord](https://clerk.com/discord)