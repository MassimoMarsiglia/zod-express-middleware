import { z, ZodObject } from "zod";

export type RequestWithSchema<T extends ZodObject<any>, Z> =
  Z extends undefined
    ? z.infer<T>
	: (Omit<Z, "body" | "params"> & z.infer<T>);
