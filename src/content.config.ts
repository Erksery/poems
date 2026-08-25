import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const poems = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/poems",
  }),

  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number().default(0),
    collections: z.array(z.string()),
    layout: z.enum(["default", "with-artwork"]).default("default"),
  }),
});

export const collections = {
  poems,
};
