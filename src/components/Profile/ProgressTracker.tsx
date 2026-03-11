import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Clock, BookOpen, Target, Trophy, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ProgressData {
  totalSessions: number;
  totalReadingTime: number;
  currentStreak: number;
  activeGoals: Array<{
    id: string;
    type: string;
    target: number;
    progress: number;
    completed: boolean;
  }>;
  recentAchievements: Array<{
    id: string;
    unlockedAt: string;
    achievement: {
      name: string;
      icon: string;
      points: number;
    };
  }>;
}

export default function ProgressTracker() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-red-500';
    if (streak >= 7) return 'text-orange-500';
    if (streak >= 3) return 'text-yellow-500';
    return 'text-gray-500';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading progress...</div>;
  }

  if (!progress) {
    return <div className="text-center p-8">Failed to load progress data</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reading Progress</h2>
        <p className="text-muted-foreground">Track your reading journey and achievements</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{progress.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{formatTime(progress.totalReadingTime)}</p>
                <p className="text-sm text-muted-foreground">Total Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Flame className={`w-8 h-8 ${getStreakColor(progress.currentStreak)}`} />
              <div>
                <p className={`text-2xl font-bold ${getStreakColor(progress.currentStreak)}`}>
                  {progress.currentStreak}
                </p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{progress.recentAchievements.length}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals Progress */}
      {progress.activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.activeGoals.map((goal) => {
              const percentage = Math.min((goal.progress / goal.target) * 100, 100);
              const goalTypeLabel = goal.type === 'time' ? 'minutes' :
                                   goal.type === 'sessions' ? 'sessions' : 'posts';

              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {goal.target} {goalTypeLabel}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {goal.progress} / {goal.target}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-right text-sm text-muted-foreground">
                    {Math.round(percentage)}% complete
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      {progress.recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.recentAchievements.slice(0, 3).map((userAchievement) => (
                <div key={userAchievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <div className="flex-1">
                    <p className="font-medium">{userAchievement.achievement.name}</p>
                    <p className="text-sm text-muted-foreground">
                      +{userAchievement.achievement.points} points
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streak Calendar Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Reading Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getStreakColor(progress.currentStreak)}`}>
              {progress.currentStreak}
            </div>
            <p className="text-muted-foreground mb-4">
              {progress.currentStreak === 1 ? 'day' : 'days'} in a row
            </p>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i < progress.currentStreak
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < progress.currentStreak ? '✓' : i + 1}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Keep reading daily to maintain your streak!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}