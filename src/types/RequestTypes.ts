import { z, ZodObject } from "zod";
import { Request } from "express";

export type RequestWithSchema<T extends ZodObject<any>> =
	| (Omit<Request, "body"> & {
			params: z.infer<T>["params"];
			query: z.infer<T>["query"];
			body: z.infer<T>["body"];
	  })
	| z.infer<T>;
