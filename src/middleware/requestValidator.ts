import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
	(schema: ZodSchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = schema.safeParse({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			if (!result.success) {
				throw new Error(JSON.stringify(result.error.format()));
			}

			//apply the validated data to the request object to apply schema defaults
			req.body = result.data.body;
			req.query = result.data.query;
			req.params = result.data.params;

			next();
		} catch (error: any) {
			res.status(400).send(error.message);
		}
	};
