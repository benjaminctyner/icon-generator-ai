import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import Stripe from "stripe";
import { hostname } from "os";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "error", {
  apiVersion: "2022-11-15",
});

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    return await stripe.checkout.sessions.create({
      metadata: { userId: ctx.session.user.id },
      payment_method_types: ["card", "us_bank_account"],
      line_items: [
        { price: `${process.env.PRICE_ID ?? "error"}`, quantity: 1 },
      ],
      mode: "payment",
      success_url: `${process.env.HOST_NAME ?? "error"}`,
      cancel_url: `${process.env.HOST_NAME ?? "error"}`,
    });
  }),
});
