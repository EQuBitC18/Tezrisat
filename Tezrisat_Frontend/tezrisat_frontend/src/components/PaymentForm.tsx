// PaymentForm.tsx
import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
// @ts-ignore
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  // @ts-ignore
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) return;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/success",
      },
    });
    if (error) setMessage(error.message || "An error occurred.");
    setLoading(false);
  };

  return (
    <Card className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-teal-900">Complete your Payment</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Your Stripe widget */}
          <PaymentElement />

          {/* 2. Submit button styled like your Card design */}
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          {/* 3. Optional error/message area */}
          {message && (
            <p className="text-sm text-red-500 text-center">{message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
