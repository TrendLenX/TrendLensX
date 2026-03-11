import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, CreditCard, X } from 'lucide-react';
import { toast } from 'sonner';

interface UserSubscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  plan: {
    name: string;
    price: number;
    currency: string;
    interval: string;
  };
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function UserSubscriptions() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchSubscriptions();
    }
  }, [session]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions/user');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch('/api/subscriptions/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, action: 'cancel' }),
      });

      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        fetchSubscriptions();
      } else {
        toast.error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!session) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Please sign in to view your subscriptions.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading subscriptions...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Subscriptions</h2>
        <p className="text-muted-foreground">Manage your subscription plans and billing</p>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Crown className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No active subscriptions</h3>
            <p className="text-muted-foreground text-center mb-4">
              Subscribe to a plan to access premium content and features.
            </p>
            <Button>View Plans</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <div>
                      <CardTitle className="text-xl">{subscription.plan.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ${subscription.plan.price}/{subscription.plan.interval}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(subscription.status)}>
                    {subscription.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Started: {new Date(subscription.startDate).toLocaleDateString()}</span>
                  </div>
                  {subscription.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Ends: {new Date(subscription.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {subscription.payments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Recent Payments
                    </h4>
                    <div className="space-y-2">
                      {subscription.payments.slice(0, 3).map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                          <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                          <span className={`font-medium ${
                            payment.status === 'completed' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${payment.amount} - {payment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subscription.status === 'active' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelSubscription(subscription.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}