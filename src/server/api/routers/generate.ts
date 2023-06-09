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
import { b64Image } from "~/data/b64Image";
import AWS from "aws-sdk";

const BUCKET_NAME = "ai-icon-generator-bct";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: "us-east-1",
});

const configuration = new Configuration({
  apiKey: process.env.DALLE_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateIcon(prompt: string): Promise<string | undefined> {
  if (process.env.MOCK_DALLE === "true") {
    return b64Image;
  } else {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });
    // console.log("----");
    // console.log(response.data.data[0]?.b64_json);
    // console.log("----");

    return response.data.data[0]?.b64_json;
  }
}

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        color: z.string(),
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

      const finalPrompt = `a modern icon in ${input.color} of a ${input.prompt}, 3D rendered, metallic material, and minimalistic.`;
      const base64Data = await generateIcon(finalPrompt);
      //TODO save the images to the s3 bucket

      const icon = await ctx.prisma.icon.create({
        data: { prompt: input.prompt, userId: ctx.session.user.id },
      });

      await s3
        .putObject({
          Bucket: BUCKET_NAME,
          Body: Buffer.from(base64Data!, "base64"),
          Key: icon.id,
          ContentEncoding: "base64",
          ContentType: "image/png",
        })
        .promise();

      return {
        imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${icon.id}`,
      };
    }),
});
