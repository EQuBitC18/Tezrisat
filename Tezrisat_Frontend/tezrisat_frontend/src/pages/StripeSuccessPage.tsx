import { CheckCircle } from "lucide-react"
// @ts-ignore
import { Button } from "@/components/ui/button"
import { AnimatedBlob } from "../components/animated-blob"
import { FloatingShapes } from "../components/floating-shapes"
import { Link } from "react-router-dom"
// @ts-ignore
import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "")

export default function StripeSuccessPage() {
  const [paymentIntent, setPaymentIntent] = useState<any>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const clientSecret = params.get("payment_intent_client_secret")
    if (!clientSecret) return

    stripePromise.then((stripe) => {
      if (!stripe) return
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent) {
          setPaymentIntent(paymentIntent)
        }
      })
    })
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-teal-700 to-teal-300 -z-10" />

      {/* Animated background elements */}
      <AnimatedBlob className="absolute top-20 left-10 opacity-30 -z-5" />
      <AnimatedBlob className="absolute bottom-40 right-10 opacity-20 -z-5" />
      <FloatingShapes className="absolute inset-0 -z-5" />

      <div className="container relative px-4 py-16 mx-auto max-w-7xl flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/40 backdrop-blur-sm rounded-3xl border border-teal-200/50 shadow-xl p-8 md:p-12 max-w-xl w-full text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-xl"></div>
              <CheckCircle className="h-24 w-24 text-teal-500 relative z-10" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-teal-900 mb-4">Payment Successful!</h1>

          <p className="text-lg text-teal-800 mb-8">
            Your payment has been processed successfully. Thank you for your purchase!
          </p>

          {/* Payment Details */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-teal-200/40 p-6 mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-teal-100">
              <span className="text-teal-800 font-medium">Order ID</span>
              <span className="text-teal-900 font-mono">
                {paymentIntent ? paymentIntent.id : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-teal-100">
              <span className="text-teal-800 font-medium">Date</span>
              <span className="text-teal-900">
                {paymentIntent
                  ? new Date(paymentIntent.created * 1000).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-teal-800 font-medium">Amount</span>
              <span className="text-teal-900 font-bold">
                {paymentIntent
                  ? `$${(paymentIntent.amount / 100).toFixed(2)}`
                  : "-"}
              </span>
            </div>
          </div>

          {/* Receipt Notice
          <p className="text-teal-700 mb-8">We've sent a receipt to your email. You can also download it below.</p>
          */}
        {/*   Action Buttons */}
        {/*  <div className="flex flex-col sm:flex-row gap-4 justify-center">*/}
        {/*    <Button className="bg-teal-600 hover:bg-teal-700 text-white">*/}
        {/*      <Download className="mr-2 h-4 w-4" />*/}
        {/*      Download Receipt*/}
        {/*    </Button>*/}

          </div>

        {/*   Return Link */}
        <div className="mt-8">
          <Link className="text-black-600 text-xl hover:text-teal-800 underline underline-offset-4" to={"/home"}>
            Return to Home
          </Link>
        </div>


        {/* Stripe Badge */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm mb-2">Powered by</p>
          <div className="bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
            <svg className="h-6" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.02-13.17 4.02-.86v3.54h3.14V9.1h-3.14v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C1.26 10.5 0 10.07 0 7.24 0 4.24 2.1 2.69 5.3 2.69c1.32 0 2.67.27 3.83.81v3.84a9.23 9.23 0 0 0-3.83-1.01c-.9 0-1.48.26-1.48.9 0 1.38 1.27 1.54 1.27 4.38z"
                fill="#fff"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
