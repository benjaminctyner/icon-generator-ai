import { loadStripe } from "@stripe/stripe-js";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? "error");

export function useBuyCredits() {
  const checkout = api.checkout.createCheckout.useMutation();

  return {
    buyCredits: async () => {
      const response = await checkout.mutateAsync();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: response.id,
      });
    },
  };
}
