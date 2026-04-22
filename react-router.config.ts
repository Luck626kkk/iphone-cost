import type { Config } from "@react-router/dev/config";
import { cloudflarePages } from "@react-router/cloudflare";

export default {
  ssr: true,
  presets: [cloudflarePages()],
} satisfies Config;
