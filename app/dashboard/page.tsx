import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardCalendar } from "@/components/dashboard-calendar";
import { getUserWorkoutsForDate, getUserWorkoutStats } from "@/data/workouts";

const formatDate = (date: Date): string => {
  const day = format(date, 'do');
  const month = format(date, 'MMM');
  const year = format(date, 'yyyy');
  return `${day} ${month} ${year}`;
};

interface PageProps {
  searchParams: Promise<{ date?: string }> | { date?: string };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const params = await searchParams;
  const selectedDateString = params.date;
  const selectedDate = selectedDateString
    ? new Date(selectedDateString + 'T00:00:00')
    : new Date();

  const rawWorkouts = await getUserWorkoutsForDate(userId, selectedDate);
  const stats = await getUserWorkoutStats(userId);

  // Group workouts and exercises
  const workoutsMap = new Map();
  rawWorkouts.forEach((row) => {
    if (!workoutsMap.has(row.id)) {
      workoutsMap.set(row.id, {
        id: row.id,
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        exercises: []
      });
    }
    if (row.exerciseName) {
      workoutsMap.get(row.id).exercises.push(row.exerciseName);
    }
  });

  const workouts = Array.from(workoutsMap.values());

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your lifting progress and view your workout history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Workouts for {formatDate(selectedDate)}</CardTitle>
                <DashboardCalendar selectedDate={selectedDate} />
              </CardHeader>
              <CardContent>
                {workouts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workout</TableHead>
                        <TableHead>Exercises</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workouts.map((workout) => {
                        const duration = workout.completedAt && workout.startedAt
                          ? Math.round((new Date(workout.completedAt).getTime() - new Date(workout.startedAt).getTime()) / (1000 * 60))
                          : null;

                        return (
                          <TableRow key={workout.id}>
                            <TableCell className="font-medium">
                              Workout #{workout.id}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {workout.exercises.map((exercise, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {exercise}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {duration ? `${duration} mins` : 'In progress'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={workout.completedAt ? "default" : "secondary"}
                              >
                                {workout.completedAt ? 'completed' : 'in progress'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No workouts logged for {formatDate(selectedDate)}
                    </p>
                    <Button className="mt-4">
                      Log Workout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Workouts Completed</span>
                    <span className="text-2xl font-bold">{stats.completedWorkouts}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Duration</span>
                    <span className="text-2xl font-bold">{stats.totalDuration || 0} mins</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Exercises</span>
                    <span className="text-2xl font-bold">{stats.totalExercises}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  Log New Workout
                </Button>
                <Button variant="outline" className="w-full">
                  View Progress
                </Button>
                <Button variant="outline" className="w-full">
                  Plan Workout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}