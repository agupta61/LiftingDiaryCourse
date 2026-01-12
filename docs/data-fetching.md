# Data Fetching Guidelines

## 🚨 CRITICAL REQUIREMENTS 🚨

### Server Components Only
**ALL data fetching within this application MUST be done via server components.**

❌ **NEVER fetch data via:**
- Route handlers
- Client components
- Any other method

✅ **ONLY fetch data via:**
- Server components

### Database Query Pattern
All database queries MUST follow this exact pattern:

1. **Helper Functions**: Create helper functions within the `/data` directory
2. **Drizzle ORM**: Use Drizzle ORM exclusively for database queries
3. **NO Raw SQL**: Raw SQL queries are strictly prohibited

### Data Security
**🔒 CRITICAL SECURITY REQUIREMENT**:
- Logged in users can ONLY access their own data
- Users MUST NOT be able to access any other user's data
- All data queries must include proper user isolation/filtering

## Implementation Pattern

```typescript
// Example: /data/workouts.ts
import { db } from '@/lib/db';
import { workouts } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}

export async function getWorkoutById(workoutId: string, userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, userId) // ALWAYS filter by user
    ));
}
```

```typescript
// Example: Server Component usage
import { getUserWorkouts } from '@/data/workouts';
import { auth } from '@/lib/auth';

export default async function WorkoutsPage() {
  const session = await auth();
  const workouts = await getUserWorkouts(session.user.id);

  return (
    <div>
      {/* Render workouts */}
    </div>
  );
}
```

## Key Rules

1. **Server Components**: All data fetching happens in server components
2. **Data Directory**: All database queries go through `/data` helper functions
3. **Drizzle Only**: Use Drizzle ORM, never raw SQL
4. **User Isolation**: Always filter data by authenticated user ID
5. **Security First**: Assume every query could be exploited if not properly filtered