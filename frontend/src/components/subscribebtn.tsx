import React from 'react';
import { useState } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from "../../convex/generated/api";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export function SubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const user = useQuery(api.users.getUser);
  const startSubscription = useAction(api.stripe.pay);
  const cancelSubscription = useAction(api.stripe.cancelSubscription);
  const handleSimulateCancel = async () => {
    try {
      const result = await cancelSubscription();
      console.log(result); // Check the output in the console
    } catch (err) {
      console.error('Cancellation simulation failed:', err);
    }
  };
  

  
  
  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const url = await startSubscription();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const result = await cancelSubscription();
      if (result?.success) {
        setMessage(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <Button onClick={handleSimulateCancel}>Simulate Cancel Subscription</Button>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-x-4">
        <Button 
          onClick={handleSubscribe}
          disabled={loading || user?.subscriptionId}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {user?.subscriptionId ? 'Already Subscribed' : 'Subscribe'}
        </Button>

        {user?.subscriptionId && (
          <Button 
            onClick={handleCancel}
            disabled={loading}
            variant="outline"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel Subscription
          </Button>
        )}
      </div>

      {user?.subscriptionId && (
        <div className="text-sm text-gray-500">
          Credits remaining: {user.credits}
        </div>
      )}
    </div>
  );
}