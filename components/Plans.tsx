import { CheckIcon } from "@heroicons/react/outline";
import { Product } from "@stripe/firestore-stripe-payments";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { loadCheckout } from "../lib/stripe";
import Loader from "./Loader";
import Table from "./Table";

interface Props {
  products: Product[];
}

function Plans({ products }: Props) {
  const { logout, user } = useAuth(); //for logout and making sure that a user exists

  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2]); //For selecting a subscription plan. Default is premium plan

  const [isBillingLoading, setIsBillingLoading] = useState(false)//for loading state

  const subscribeToPlan = () => {
    if (!user) return

    loadCheckout(selectedPlan?.prices[0].id!)//custom function in stripe.ts. requires priceId to know which plan user is subscribing to
    setIsBillingLoading(true)//want to execute loading state
  }

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="border-b border-white/10 bg-[#141414]">
        {/* Netflix Logo */}
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>

        {/* Sign Out button */}
        <button
          className="text-lg font-medium hover:underline"
          onClick={logout}
        >
          Sign Out
        </button>
      </header>

      {/* Market plans */}
      <main className="mx-auto pt-28 max-w-5xl px-5 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan that's right for you
        </h1>
        <ul>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Watch all you want.
            Ad-free.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Recommendations
            just for you.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Change or cancel
            your plan anytime.
          </li>
        </ul>

        <div className="mt-4 flex flex-col space-y-4">
          {/* self-end is for parent (self) to align towards end */}
          <div className="flex w-full items-center justify-center self-end md:w-3/5">
            {/* Map through product plans and print name */}
            {products.map((product) => (
              <div
                key={product.id}
                className={`planBox ${
                  selectedPlan?.id === product.id ? "opacity-100" : "opacity-60"//style selected plan differently from others
                }`}
                onClick={() => setSelectedPlan(product)}//Set currently selected plan to the one that is clicked. 
              >
                {product.name}
              </div>
            ))}
          </div>

                {/* Table for subscription plans */}
          <Table products={products} selectedPlan={selectedPlan}/>

          {/* subscribe button */}
          <button
            disabled={!selectedPlan || isBillingLoading}//dont' want user to keep clicking Subscribe button after already clicked or if no plan is selected
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? (
              <Loader color="dark:fill-gray-300" />//custom Loader component. Need to pass color because the Loader component uses Tailwind styles. Couldn't put the color into the Tailwind CSS in Loader?
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Plans;
