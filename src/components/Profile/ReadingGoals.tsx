import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Calendar, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ReadingGoal {
  id: string;
  type: string;
  target: number;
  metric: string;
  current: number;
  completed: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

export default function ReadingGoals() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<ReadingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'time' as string,
    target: '',
    endDate: '',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Goal created successfully!');
        setFormData({ type: 'time', target: '', endDate: '' });
        setShowForm(false);
        fetchGoals();
      } else {
        toast.error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const getGoalTypeLabel = (type: string, metric: string) => {
    if (type === 'time') return `Reading Time (${metric})`;
    if (type === 'articles') return `Articles Read`;
    return type;
  };

  const getProgressPercentage = (goal: ReadingGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reading Goals</h2>
          <p className="text-muted-foreground">Set and track your reading objectives</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Goal Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="time">Reading Time</option>
                    <option value="articles">Articles Read</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    placeholder={formData.type === 'time' ? 'Minutes' : 'Articles'}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Goal</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Set your first reading goal to start tracking your progress
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">
                        {getGoalTypeLabel(goal.type, goal.metric)}: {goal.target}
                      </h3>
                      {goal.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {goal.current} / {goal.target}
                      </span>
                      {goal.endDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {new Date(goal.endDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Started {new Date(goal.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(getProgressPercentage(goal))}%</span>
                  </div>
                  <Progress value={getProgressPercentage(goal)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}