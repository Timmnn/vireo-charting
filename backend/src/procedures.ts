import { z } from "zod";
import fs from "fs";
import { trpc } from "./trpc.ts";
import { parseCsv } from "./parseCsv.ts";
import { ParquetSchema, ParquetWriter, ParquetReader } from "@dobesv/parquets";

// Create a router object first, then add procedures to it
export const appRouter = trpc.router({
  ping: trpc.procedure.input(z.string()).query((opts) => {
    return `Pong ${opts.input}`;
  }),
  loadDataset: trpc.procedure.input(z.string()).query(async (opts) => {
    const file_path = opts.input;

    let reader = await ParquetReader.openFile(file_path);

    let cursor = reader.getCursor();

    let data = [] as any[];
    let record = null;
    while ((record = await cursor.next())) {
      data.push(record);
    }

    return data;
  }),
});

// Export type router type for client use
export type AppRouter = typeof appRouter;
