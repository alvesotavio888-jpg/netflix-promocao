import { useState } from "react";
import { PlanSelection } from "./pages/PlanSelection";
import { Checkout } from "./pages/Checkout";
import type { CheckoutData } from "./pages/Checkout";
import { Confirmation } from "./pages/Confirmation";
import { AdminPanel } from "./pages/AdminPanel";

type Step = "plan" | "checkout" | "confirmation";

export function App() {
  const [step, setStep] = useState<Step>("plan");
  const [planId, setPlanId] = useState("premium");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  // Admin panel: acesse adicionando ?admin na URL
  const isAdmin = window.location.search.includes("admin");
  if (isAdmin) return <AdminPanel />;

  if (step === "plan") {
    return (
      <PlanSelection
        onNext={(id) => {
          setPlanId(id);
          setStep("checkout");
        }}
      />
    );
  }

  if (step === "checkout") {
    return (
      <Checkout
        planId={planId}
        onBack={() => setStep("plan")}
        onNext={(data) => {
          setCheckoutData(data);
          setStep("confirmation");
        }}
      />
    );
  }

  if (step === "confirmation" && checkoutData) {
    return (
      <Confirmation
        planId={planId}
        checkoutData={checkoutData}
        onRestart={() => setStep("plan")}
      />
    );
  }

  return null;
}
