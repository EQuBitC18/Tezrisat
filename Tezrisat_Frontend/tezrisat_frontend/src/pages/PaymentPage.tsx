import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// @ts-ignore
import { Elements } from "@stripe/react-stripe-js";
// @ts-ignore
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";
import {AnimatedBlob} from "../components/animated-blob";
import {FloatingShapes} from "../components/floating-shapes";


const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || ""
);

const PaymentPage = () => {
  const location = useLocation();
  const { clientSecret } = location.state || {};
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (clientSecret) {
      setOptions({
        // @ts-ignore
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      });
    }
  }, [clientSecret]);

  return (
    <div className="relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900 via-teal-700 to-teal-300 -z-10" />
      {/* Animated background elements */}
      <AnimatedBlob className="absolute top-20 left-10 opacity-30 -z-5" />
      <AnimatedBlob className="absolute bottom-40 right-10 opacity-20 -z-5" />
      <FloatingShapes className="absolute inset-0 -z-5" />
      {/* center container */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        {options ? (
          <Elements stripe={stripePromise} options={options}>
            <div className="w-full max-w-lg">
              <PaymentForm />
            </div>
          </Elements>
        ) : (
          <p className="text-white">Loading payment details…</p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;