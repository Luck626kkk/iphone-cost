import { createRequestHandler } from "@react-router/cloudflare";
import * as build from "../build/server";

const handleRequest = createRequestHandler({ build });

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)
    if (url.pathname === '/') {
      return Response.redirect(`${url.origin}/iphone-cost/`, 302)
    }
    return handleRequest({
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
    });
  },
} satisfies ExportedHandler<Env>;
