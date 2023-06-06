import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.DALLE_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

      const response = await openai.createImage({
        prompt: input.prompt,
        n: 1,
        size: "1024x1024",
      });
      const image_url = response.data.data[0].url;

      return {
        imageUrl: image_url,
      };
    }),
});
