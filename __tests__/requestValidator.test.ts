import { validateRequest } from "../src/middleware/requestValidator";
import express, { Request, Response } from "express";
import request from "supertest";
import { z } from "zod";
import { RequestWithSchema } from "../src/types/RequestTypes";

const TestGetRequestSchema = z.object({
	query: z.object({
		maxage: z.number({ coerce: true }), //coerce needed to convert string to number
	}),
});

const productInfoSchema = z.object({
	price: z.number(),
	description: z.string(),
	count: z.number().default(0),
});

const TestPostRequestSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	body: z.object({
		name: z.string(),
		productInfo: productInfoSchema,
	}),
});

const TestGetRequestSchema2 = z.object({
	query: z.object({
		optionalfield: z.string().optional(),
		requiredfield: z.string(),
	}),
});

const app = express();
app.use(express.json());

type TestGetRequestType = RequestWithSchema<typeof TestGetRequestSchema>;

app.get(
	"/test",
	validateRequest(TestGetRequestSchema),
	(req: TestGetRequestType, res: Response) => {
		res.send({ query: req.query });
	},
);

type TestPostRequestType = RequestWithSchema<typeof TestPostRequestSchema>;

app.post(
	"/test2/:id",
	validateRequest(TestPostRequestSchema),
	(req: TestPostRequestType, res: Response) => {
		res.send({ params: req.params, body: req.body });
	},
);

type TestGetRequest2Type = RequestWithSchema<typeof TestGetRequestSchema2>;

app.get(
	"/test3",
	validateRequest(TestGetRequestSchema2),
	(req: TestGetRequest2Type, res: Response) => {
		res.send({ query: req.query });
	},
);

describe("Request Validator Middleware", () => {
	it("should return status 400 if request doesnt meet schema", async () => {
		const response = await request(app).get("/test");

		expect(response.status).toBe(400);
	});
	it("should return status 200 if request meets schema", async () => {
		const response = await request(app).get("/test?maxage=20");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ query: { maxage: 20 } });
	});
	it("should return status 400 if request query is not a number", async () => {
		const response = await request(app).get("/test?maxage=hello");

		expect(response.status).toBe(400);
	});
	it("should error 400 if not the entire request body is provided", async () => {
		const response = await request(app)
			.post("/test2/123")
			.send({ name: "test" });

		expect(response.status).toBe(400);
	});
	it("should apply defaults for missing fields", async () => {
		const response = await request(app)
			.post("/test2/123")
			.send({
				name: "test",
				productInfo: { price: 20, description: "testDescription" },
			});

		expect(response.status).toBe(200);
		expect(response.body.params.id).toBe("123");
		expect(response.body.body.productInfo.count).toBe(0);
		expect(response.body.body.productInfo.price).toBe(20);
	});
	it("should return status 200 if a optional field is not provided", async () => {
		const response = await request(app).get("/test3?requiredfield=hello");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ query: { requiredfield: "hello" } });
	});
	it("should return status 400 if a optional field is provided but not a required field", async () => {
		const response = await request(app).get("/test3?optionalfield=hello");
		expect(response.status).toBe(400);
	});
	it("should remove fields not specified in the schema from the request object", async () => {
		const response = await request(app).get(
			"/test3?requiredfield=hello&invalidfield=hello",
		);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ query: { requiredfield: "hello" } });
	});
});
