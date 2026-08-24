import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://erksery.github.io",
  base: "/poems",

  integrations: [react()],
});
