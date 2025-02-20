import { z } from "zod";

export const TestGetRequestSchema = z.object({
	params: z.object({
		productid: z.string(),
	}),
	query: z.object({
		maxage: z.number().default(10),
	}),
});
