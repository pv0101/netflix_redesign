import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useSubscription from "../hooks/useSubscription";
import { goToBillingPortal } from "../lib/stripe";
import Loader from "./Loader";

function Membership() {
  // Can use Recoil and include isBillingLoading for global use instead of having a different piece of state every time. Did not implement for this build
  const { user } = useAuth();
  const subscription = useSubscription(user);
  const [isBillingLoading, setBillingLoading] = useState(false);

  const manageSubscription = () => {
    if (subscription) {
      setBillingLoading(true);
      goToBillingPortal();
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
      <div className="space-y-2 py-4">
        <h4 className="text-lg text-[gray]">Membership & Billing</h4>
        <button
          disabled={isBillingLoading || !subscription}
          className="h-10 w-3/5 whitespace-nowrap bg-gray-300 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5"
          onClick={manageSubscription}
        >
          {isBillingLoading ? (
            <Loader color="dark:fill-[#e50914]" />
          ) : (
            "Cancel Membership"
          )}
        </button>
      </div>

      <div className="col-span-3">

        {/* Account management */}
        <div className="flex flex-col justify-between border-b border-white/10 py-4 md:flex-row">

          {/* Username and Password */}
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-[gray]">Password: *******</p>
          </div>

          {/* Change email and password */}
          <div className="md:text-right">
            <p className="membershipLink">Change email</p>
            <p className="membershipLink">Change password</p>
          </div>
        </div>

            {/* Membership management */}
        <div className="flex flex-col justify-between pt-4 pb-4 md:flex-row md:pb-0">
          <div>
            {/* Show end of billing period, change message based on whether subscription is canceled or not. */}
            <p>
              {subscription?.cancel_at_period_end
                ? "Your membership will end on "
                : "Your next billing date is "}
              {subscription?.current_period_end}
            </p>
          </div>

                {/* Membership management links */}
          <div className="md:text-right">
            <p className="membershipLink">Manage payment info</p>
            <p className="membershipLink">Add backup payment method</p>
            <p className="membershipLink">Billing Details</p>
            <p className="membershipLink">Change billing day</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Membership;
