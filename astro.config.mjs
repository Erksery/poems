import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import remarkBreaks from "remark-breaks";

export default defineConfig({
  site: "https://erksery.github.io",
  base: "/poems",

  markdown: {
    remarkPlugins: [remarkBreaks],
  },

  integrations: [react()],
});
