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
    accessKeyId: process.env.ACCESS_KEY_ID ?? "error",
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "error",
  },
  region: "us-east-1",
});

export const iconsRouter = createTRPCRouter({
  getIcons: protectedProcedure.query(async ({ ctx }) => {
    const icons = await ctx.prisma.icon.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return icons;
  }),
});
