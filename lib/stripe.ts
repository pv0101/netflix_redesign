import {
    createCheckoutSession,
    getStripePayments,
  } from '@stripe/firestore-stripe-payments'
  import { getFunctions, httpsCallable } from '@firebase/functions'
  import app from '../firebase'

//   accepts instance of app from Firebase and options (collections?)
// allows us to retrieve payments but not collections
  const payments = getStripePayments(app, {
    productsCollection: 'products',
    customersCollection: 'customers',
  })

  const loadCheckout = async (priceId: string) => {
    await createCheckoutSession(payments, {
        price: priceId,
        success_url: window.location.origin, //window object is present anywhere on application and has access to anywhere on application. window.location.origin sends url of current window
        cancel_url: window.location.origin, //can set up custom success or cancel url and page if we want. But 
    }).then((snapshot) => window.location.assign(snapshot.url)) //assign navigates to given url. If createCheckoutSession is successful then redirect to Stripe payment portal given to us by Stripe
    .catch((error) => console.log(error.message))
  }

  const goToBillingPortal = async () => {
    // getFunctions() returns a function instance given the current app. us-central1 is default for firestore settings 
    const instance = getFunctions(app, 'us-central1')

    // returns a url which redirects user to customer portal based on cloud functions
    const functionRef = httpsCallable(instance, 'ext-firestore-stripe-payments-createPortalLink')//gives a link to redirect customer to customer portal

    await functionRef({
      returnUrl: `${window.location.origin}/account` //when user redirects back to app, want them to go back to account page
    }).then(({data}: any) => window.location.assign(data.url))//use any because could not find the Type. Generally do not want to use any Type
    .catch((error) => console.log(error.message))
  }

  export { loadCheckout, goToBillingPortal }
  export default payments