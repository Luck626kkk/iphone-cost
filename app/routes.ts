import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("result", "routes/result.tsx"),
  route("api/og", "routes/api.og.tsx"),
] satisfies RouteConfig;
