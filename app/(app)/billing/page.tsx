import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <>
      <Header title="Billing" subtitle="Plan, credits, and invoices." />
      <Card className="mx-auto mt-16 max-w-md text-center">
        <p className="text-4xl">💳</p>
        <p className="mt-4 font-display text-xl font-semibold">
          Arrives in Stage 5
        </p>
        <p className="mt-2 text-sm text-muted">
          Stripe subscriptions land here: upgrade to Pro ($9/mo, 500 credits),
          manage or cancel anytime. The real thing — real money, real
          invoices.
        </p>
      </Card>
    </>
  );
}
