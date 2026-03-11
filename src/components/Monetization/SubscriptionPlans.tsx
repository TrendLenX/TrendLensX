import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
}

export default function SubscriptionPlans() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscriptions/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setSubscribing(planId);
    try {
      const response = await fetch('/api/subscriptions/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        toast.success('Subscription created successfully!');
        // In a real app, this would redirect to payment processing
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to create subscription');
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (name: string) => {
    if (name.toLowerCase().includes('pro')) return <Crown className="w-6 h-6" />;
    if (name.toLowerCase().includes('premium')) return <Star className="w-6 h-6" />;
    return <Check className="w-6 h-6" />;
  };

  const getPlanColor = (name: string) => {
    if (name.toLowerCase().includes('pro')) return 'border-yellow-200 bg-yellow-50';
    if (name.toLowerCase().includes('premium')) return 'border-purple-200 bg-purple-50';
    return 'border-blue-200 bg-blue-50';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading subscription plans...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock premium content, exclusive insights, and advanced features with our subscription plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${getPlanColor(plan.name)} ${
              plan.name.toLowerCase().includes('pro') ? 'ring-2 ring-yellow-300' : ''
            }`}
          >
            {plan.name.toLowerCase().includes('pro') && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-white px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-2">
                {getPlanIcon(plan.name)}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.interval}
                </span>
              </div>
              {plan.description && (
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing === plan.id}
                className="w-full"
                variant={plan.name.toLowerCase().includes('pro') ? 'default' : 'outline'}
              >
                {subscribing === plan.id ? 'Subscribing...' : `Subscribe to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>All plans include a 30-day money-back guarantee.</p>
        <p>Prices are in USD and billed {plans[0]?.interval || 'monthly'}.</p>
      </div>
    </div>
  );
}