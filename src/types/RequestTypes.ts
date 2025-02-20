import { z, ZodObject, ZodSchema, ZodType } from "zod";
import { Request } from "express";

export type RequestSchemas = {
	body?: ZodSchema;
	query?: ZodSchema;
	headers?: ZodSchema;
};

export type RequestWithSchema<T extends ZodObject<any>> = Omit<
	Request,
	"body" | "params"
> & {
	params: z.infer<T>["params"];
	query: z.infer<T>["query"];
	body: z.infer<T>["body"];
};
