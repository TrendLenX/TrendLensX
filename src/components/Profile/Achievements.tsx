import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star, BookOpen, Clock, Target, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  order: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

const achievementIcons = {
  'first-session': BookOpen,
  'five-sessions': Star,
  'ten-sessions': Trophy,
  'first-hour': Clock,
  'five-hours': Target,
  'ten-hours': Award,
  'first-goal': Target,
  'goal-master': Trophy,
};

const rarityColors = {
  common: 'bg-gray-100 text-gray-800',
  rare: 'bg-blue-100 text-blue-800',
  epic: 'bg-purple-100 text-purple-800',
  legendary: 'bg-yellow-100 text-yellow-800',
};

export default function Achievements() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (achievementId: string) => {
    const IconComponent = achievementIcons[achievementId as keyof typeof achievementIcons] || Trophy;
    return IconComponent;
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  if (loading) {
    return <div className="flex justify-center p-8">Loading achievements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Achievements</h2>
          <p className="text-muted-foreground">
            {unlockedCount} of {achievements.length} unlocked • {totalPoints} points earned
          </p>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{unlockedCount}</p>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Categories */}
      <div className="grid gap-4">
        {achievements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No achievements available</h3>
              <p className="text-muted-foreground text-center">
                Start reading to unlock your first achievements!
              </p>
            </CardContent>
          </Card>
        ) : (
          achievements.map((achievement) => {
            const IconComponent = getIcon(achievement.id);
            return (
              <Card
                key={achievement.id}
                className={`transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-200 bg-yellow-50/50'
                    : 'opacity-60'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      achievement.unlocked
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {achievement.unlocked ? (
                        <IconComponent className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{achievement.name}</h3>
                        <Badge
                          variant="secondary"
                          className={rarityColors[achievement.rarity]}
                        >
                          {achievement.rarity}
                        </Badge>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{achievement.points} points</span>
                          <span>{achievement.category}</span>
                        </div>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <span className="text-sm text-muted-foreground">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}