import { NextRequest, NextResponse } from 'next/server';
import { db, workouts, workoutExercises, exercises, sets } from '@/app/db';
import { eq, and, gte, lt } from 'drizzle-orm';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const userId = searchParams.get('userId');

    if (!dateParam || !userId) {
      return NextResponse.json(
        { error: 'Date and userId parameters are required' },
        { status: 400 }
      );
    }

    // Parse the date and get start/end of day
    const selectedDate = parseISO(dateParam);
    const startDate = startOfDay(selectedDate);
    const endDate = endOfDay(selectedDate);

    // Query workouts for the specified date and user
    const workoutResults = await db
      .select({
        id: workouts.id,
        userId: workouts.userId,
        startedAt: workouts.startedAt,
        completedAt: workouts.completedAt,
      })
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.startedAt, startDate),
          lt(workouts.startedAt, endDate)
        )
      )
      .orderBy(workouts.startedAt);

    // For each workout, get exercises and sets
    const workoutsWithDetails = await Promise.all(
      workoutResults.map(async (workout) => {
        const exerciseResults = await db
          .select({
            id: workoutExercises.id,
            exerciseId: workoutExercises.exerciseId,
            order: workoutExercises.order,
            exerciseName: exercises.name,
          })
          .from(workoutExercises)
          .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
          .where(eq(workoutExercises.workoutId, workout.id))
          .orderBy(workoutExercises.order);

        const exercisesWithSets = await Promise.all(
          exerciseResults.map(async (exercise) => {
            const setResults = await db
              .select({
                id: sets.id,
                weight: sets.weight,
                reps: sets.reps,
                createdAt: sets.createdAt,
              })
              .from(sets)
              .where(eq(sets.workoutExerciseId, exercise.id))
              .orderBy(sets.createdAt);

            return {
              id: exercise.exerciseId,
              name: exercise.exerciseName,
              order: exercise.order,
              sets: setResults,
            };
          })
        );

        return {
          id: workout.id,
          startedAt: workout.startedAt?.toISOString(),
          completedAt: workout.completedAt?.toISOString() || null,
          exercises: exercisesWithSets,
        };
      })
    );

    return NextResponse.json({
      workouts: workoutsWithDetails,
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}