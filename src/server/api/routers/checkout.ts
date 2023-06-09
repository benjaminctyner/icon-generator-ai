import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import Stripe from "stripe";
import { hostname } from "os";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// const stripe = require('stripe')('sk_test_51NH65kJNhXDMHHyHmLExwTHCi57SfWGODEZ7vsIoyzCg4SS7auIXqPhgxGwoa2ECPnjmAoAgw5ZOY0AGfXkLMHDM00g6Jywtir');

export const checkoutRouter = createTRPCRouter({
  createCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    return await stripe.checkout.sessions.create({
      metadata: { userId: ctx.session.user.id },
      payment_method_types: ["card", "us_bank_account"],
      line_items: [{ price: `${process.env.PRICE_ID}`, quantity: 1 }],
      mode: "payment",
      success_url: `${process.env.HOST_NAME}`,
      cancel_url: `${process.env.HOST_NAME}`,
    });
  }),
});
