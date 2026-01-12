# Data Mutations Standards

This document outlines the required patterns and standards for all data mutations in the lifting diary application.

## Architecture Overview

Data mutations follow a strict layered architecture:
1. **UI Components** → call server actions
2. **Server Actions** → validate input and call data helpers
3. **Data Helpers** → execute database operations via Drizzle ORM

## Server Actions Requirements

### File Location
- Server actions MUST be placed in colocated `actions.ts` files
- Each feature/route should have its own `actions.ts` file alongside components

### Function Signatures
- All server action parameters MUST be explicitly typed
- Parameters MUST NOT use the `FormData` data type
- Use proper TypeScript interfaces or types for all parameters

```typescript
// ✅ Correct - explicitly typed parameters
export async function createWorkout(data: CreateWorkoutInput): Promise<ActionResult<Workout>>

// ❌ Incorrect - FormData parameter
export async function createWorkout(formData: FormData): Promise<ActionResult<Workout>>
```

### Input Validation
- ALL server actions MUST validate input parameters using Zod schemas
- Validation should happen at the start of each server action
- Return appropriate error responses for invalid input

```typescript
import { z } from 'zod';

const CreateWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  date: z.date(),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    sets: z.number().min(1)
  }))
});

export async function createWorkout(data: CreateWorkoutInput): Promise<ActionResult<Workout>> {
  // Validate input
  const validationResult = CreateWorkoutSchema.safeParse(data);
  if (!validationResult.success) {
    return {
      success: false,
      error: 'Invalid input data',
      fieldErrors: validationResult.error.flatten().fieldErrors
    };
  }

  // Call data helper
  try {
    const workout = await createWorkoutHelper(validationResult.data);
    return { success: true, data: workout };
  } catch (error) {
    return { success: false, error: 'Failed to create workout' };
  }
}
```

## Data Helper Functions

### File Location
- ALL data mutation helpers MUST be placed in the `src/data` directory
- Organize by domain/feature (e.g., `src/data/workouts.ts`, `src/data/exercises.ts`)

### Database Access
- Data helpers MUST use Drizzle ORM for all database operations
- NO direct SQL queries outside of Drizzle ORM
- All database schemas should be properly typed

### Function Responsibilities
- Data helpers are responsible for:
  - Executing database operations
  - Handling database transactions when needed
  - Throwing appropriate errors for database failures
  - Returning properly typed data

```typescript
// src/data/workouts.ts
import { db } from '@/lib/db';
import { workouts, exercises } from '@/db/schema';

export async function createWorkoutHelper(data: CreateWorkoutData): Promise<Workout> {
  return await db.transaction(async (tx) => {
    const [workout] = await tx
      .insert(workouts)
      .values({
        name: data.name,
        date: data.date,
        userId: data.userId
      })
      .returning();

    if (data.exercises.length > 0) {
      await tx.insert(exercises).values(
        data.exercises.map(ex => ({
          workoutId: workout.id,
          exerciseId: ex.exerciseId,
          sets: ex.sets
        }))
      );
    }

    return workout;
  });
}
```

## Error Handling

### Server Actions
- Use consistent error response format
- Include field-level validation errors when applicable
- Log errors appropriately for debugging

### Data Helpers
- Throw descriptive errors for database failures
- Let server actions handle error formatting and user-facing messages

## Type Safety

### Response Types
- All server actions should return a consistent `ActionResult<T>` type
- Define clear success and error states

```typescript
type ActionResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
};
```

### Input Types
- Define explicit input types for all server actions
- Use shared types between server actions and data helpers where appropriate

## Example File Structure

```
src/
  data/
    workouts.ts        # Workout data helpers
    exercises.ts       # Exercise data helpers
    users.ts          # User data helpers
  app/
    dashboard/
      actions.ts       # Dashboard server actions
    workouts/
      actions.ts       # Workout server actions
      create/
        actions.ts     # Create workout server actions
```

## Compliance Checklist

Before implementing any data mutation:

- [ ] Server action is in colocated `actions.ts` file
- [ ] Parameters are explicitly typed (no FormData)
- [ ] Input validation using Zod schemas
- [ ] Data helper function in `src/data` directory
- [ ] Database operations use Drizzle ORM only
- [ ] Consistent error handling and response format
- [ ] Proper TypeScript types throughout