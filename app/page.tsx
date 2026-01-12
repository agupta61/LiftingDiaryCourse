import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, TrendingUp, Calendar, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Dumbbell className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Lifting Diary Course
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Track your workouts, monitor your progress, and achieve your fitness goals with our comprehensive lifting diary platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="text-center p-6">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your strength gains and track your workout history with detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center p-6">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Plan Workouts</h3>
              <p className="text-muted-foreground">
                Create and schedule your lifting sessions with our intuitive workout planner.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center p-6">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Achieve Goals</h3>
              <p className="text-muted-foreground">
                Set targets, track milestones, and celebrate your fitness achievements.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to start your fitness journey?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of lifters who are already tracking their progress with our platform.
          </p>
          <Button size="lg">
            Sign Up Today
          </Button>
        </div>
      </main>
    </div>
  );
}
