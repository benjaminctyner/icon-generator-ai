import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

import { Configuration, OpenAIApi } from "openai";
import { COLLECTION_FORMATS } from "openai/dist/base";

const configuration = new Configuration({
  apiKey: process.env.DALLE_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateIcon(prompt: string): Promise<string | undefined> {
  if (process.env.MOCK_DALLE === "true") {
    return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-JvWEA5gghE8OTMvlPTV9voV5/user-FmKIrZcJ8sw98Hl64xVKIoUP/img-2RPUEAz4K8wMcvqNr5Xba2CB.png?st=2023-06-07T22%3A39%3A49Z&se=2023-06-08T00%3A39%3A49Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-06-07T22%3A23%3A40Z&ske=2023-06-08T22%3A23%3A40Z&sks=b&skv=2021-08-06&sig=ek6Dp8LMomTMPEUYYEEYW%2BL7wrQEADg21PhkU1O2w3A%3D";
  } else {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data.data[0].url;
  }
}

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("we are here", input.prompt);

      //verify that user has enough credits
      //do an update in prisma, ctx
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
          credits: {
            gte: 1,
          },
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      console.log(count);

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have enough credits.",
        });
      }

      // const response = await openai.createImage({
      //   prompt: input.prompt,
      //   n: 1,
      //   size: "1024x1024",
      // });
      const image_url = await generateIcon(input.prompt);

      return {
        imageUrl: image_url,
      };
    }),
});
