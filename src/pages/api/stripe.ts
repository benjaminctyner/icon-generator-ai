import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { prisma } from "~/server/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_193076d6cf5c1b85bea3dcea895bdcbf50ae418bb5db5eae002c82e018c9d5b5";

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   console.log(`Unhandled event type ${event.type}`);

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

// app.listen(4242, () => console.log('Running on port 4242'));

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("webhook started");
  if (req.method === "POST") {
    console.log("webhook post started");
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      console.log("start event const");
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEB_HOOK_SECRET
      );
    } catch (err) {
      console.log("an error occured");
      let message = "Unknown Error";
      if (err instanceof Error) message = err.message;
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }

    console.log(event, "event");

    switch (event.type) {
      case "checkout.session.completed":
        console.log("completed event");
        const completedEvent = event.data.object as {
          id: string;
          metadata: { userId: string };
        };
        await prisma.user.update({
          where: {
            id: completedEvent.metadata.userId,
          },
          data: {
            credits: {
              increment: 100,
            },
          },
        });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Handle the event
    console.log(`Unhandled event type ${event.type}`);

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed.");
  }
};

export default webhook;
