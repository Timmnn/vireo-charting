import fastifyCors from "@fastify/cors";
import type { FastifyRequest, FastifyReply } from "fastify";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { appRouter, AppRouter } from "./procedures.ts";

// Create Fastify server
// --------------------
const server = fastify({
  maxParamLength: 5000,
});

// Enable CORS
// --------------------
server.register(fastifyCors, {
  origin: true, // Allow all origins (or specify your frontend URL, e.g., "http://localhost:5173")
  methods: ["GET", "POST", "OPTIONS"], // Allow these HTTP methods
  credentials: true, // Allow credentials (if needed)
});

server.options("/trpc/*", async (request, reply) => {
  reply.status(204).send(); // No content for OPTIONS requests
});

// Register tRPC plugin
server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext: ({
      req,
      res,
    }: {
      req: FastifyRequest;
      res: FastifyReply;
    }) => {
      const user = { name: req.headers.username ?? "anonymous" };
      return { req, res, user };
    },
    onError({ path, error }) {
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

// Start the server
(async () => {
  try {
    await server.listen({ port: 3000 });
    console.log("Server is running on http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
