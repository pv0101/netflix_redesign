// Custom hook
import {
  onCurrentUserSubscriptionUpdate,
  Subscription,
} from "@stripe/firestore-stripe-payments";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import payments from "../lib/stripe";

function useSubscription(user: User | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // similar to onAuthStateChanged, listener for subscription event
  useEffect(() => {
    if (!user) return;

    onCurrentUserSubscriptionUpdate(payments, (snapshot) => {
      // Filter through subscriptions array and only set subscriptions to be true if subscription.status is active or trial
      setSubscription(
        snapshot.subscriptions.filter(
          (subscription) =>
            subscription.status === "active" ||
            subscription.status === "trialing"
        )[0]
      );
    });
  }, [user]);

  return subscription
}

export default useSubscription;
