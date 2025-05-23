// @ts-ignore
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentSummaryProps {
  title: string
  amount: string
}

export function PaymentSummary({ title, amount }: PaymentSummaryProps) {
  // Calculate tax (for demonstration)
  const amountNum = Number.parseFloat(amount) || 0
  const tax = amountNum * 0.08
  const total = amountNum + tax

  return (
    <Card className="bg-white/40 backdrop-blur-sm border-teal-200/50 rounded-3xl shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-teal-900">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-teal-200/30">
            <span className="text-teal-800 font-medium">{title}</span>
            <span className="text-teal-900 font-medium">${amount}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-teal-700">Tax (8%)</span>
            <span className="text-teal-800">${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-teal-200/30">
            <span className="text-teal-900 font-bold">Total</span>
            <span className="text-teal-900 font-bold text-xl">${total.toFixed(2)}</span>
          </div>

          <div className="pt-4 text-sm text-teal-700">
            <p>You will be charged today. Your subscription will automatically renew each month until canceled.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
