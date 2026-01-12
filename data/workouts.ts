import { db } from '@/app/db';
import { workouts, workoutExercises, exercises, sets } from '@/app/db/schema';
import { eq, and, desc, gte, lte, count, countDistinct } from 'drizzle-orm';

export async function getUserWorkouts(userId: string) {
  return await db
    .select({
      id: workouts.id,
      userId: workouts.userId,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
    })
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.startedAt));
}

export async function getUserWorkoutsWithDetails(userId: string) {
  return await db
    .select({
      id: workouts.id,
      userId: workouts.userId,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseId: workoutExercises.exerciseId,
      exerciseName: exercises.name,
      exerciseOrder: workoutExercises.order,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
    .leftJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.startedAt), workoutExercises.order);
}

export async function getUserWorkoutsForDate(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db
    .select({
      id: workouts.id,
      userId: workouts.userId,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseId: workoutExercises.exerciseId,
      exerciseName: exercises.name,
      exerciseOrder: workoutExercises.order,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
    .leftJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay),
        lte(workouts.startedAt, endOfDay)
      )
    )
    .orderBy(desc(workouts.startedAt), workoutExercises.order);
}

export async function getWorkoutById(workoutId: number, userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, userId)
    ))
    .limit(1);
}

export async function getUserWorkoutStats(userId: string) {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Get today's workouts
  const todaysWorkouts = await db
    .select({
      id: workouts.id,
      completedAt: workouts.completedAt,
    })
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay),
        lte(workouts.startedAt, endOfDay)
      )
    );

  // Get exercise count for today's workouts
  const exerciseCount = await db
    .select({
      count: countDistinct(exercises.id),
    })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workoutExercises.workoutId, workouts.id))
    .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay),
        lte(workouts.startedAt, endOfDay)
      )
    );

  const completedCount = todaysWorkouts.filter(w => w.completedAt).length;
  const totalExercises = exerciseCount[0]?.count || 0;

  return {
    completedWorkouts: completedCount,
    totalDuration: 0,
    totalExercises: Number(totalExercises),
  };
}