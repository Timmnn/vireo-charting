import { z } from "zod";
import fs from "fs";
import { trpc } from "./trpc.ts";
import { parseCsv } from "./parseCsv.ts";

// Create a router object first, then add procedures to it
export const appRouter = trpc.router({
  ping: trpc.procedure.input(z.string()).query((opts) => {
    return `Pong ${opts.input}`;
  }),
  loadDataset: trpc.procedure.input(z.string()).query((opts) => {
    return new Promise<Record<string, string>[]>((resolve, reject) => {
      fs.readFile(opts.input, (err, data) => {
        if (err) {
          return reject();
        }

        const obj = parseCsv(data.toString(), [
          {
            name: "timestamp",
            type: "string",
          },
          {
            name: "open",
            type: "float",
          },
          {
            name: "high",
            type: "float",
          },
          {
            name: "low",
            type: "float",
          },
          {
            name: "close",
            type: "float",
          },
        ]);

        resolve(obj);
      });
    });
  }),
});

// Export type router type for client use
export type AppRouter = typeof appRouter;
