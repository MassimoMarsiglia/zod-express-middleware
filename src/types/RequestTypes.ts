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

export const customNumber = z
	.custom<number>()
	.refine((value) => value ?? false, "Required")
	.refine((value) => Number.isFinite(Number(value)), "Invalid number")
	.transform((value) => Number(value));
