import type { AppRouter } from "../backend/src/procedures";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const getTrpcClient = () =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/trpc", // Adjust the URL if needed
      }),
    ],
  });
