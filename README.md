# Zod Express Middleware

A lightweight and efficient Express.js middleware for validating request bodies, query parameters, and headers using [Zod](https://zod.dev/).

## Features
- Seamless integration with Express.js
- Apply schema default values
- Validate request bodies, query paramters, and url parameters
- Automatically returns a 400 response on validation failure
- Request typesafety
- Monorepo friendly

## Installation

```sh
npm install zod express
```

```sh
npm install @types/express
```

## Usage

### Monorepo example


## Schema
```typescript
import z from "zod";
import { RequestWithSchema } from "@shared/types/RequestTypes";

export const TestGetRequestSchema = z.object({
	query: z.object({
		optionalfield: z.string().optional(),
		requiredfield: z.string(),
	}),
});

type TestGetRequest<Z = undefined> = RequestWithSchema<typeof TestGetRequestSchema, Z>;
```

## Backend

```typescript
import express, { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { validateRequest } from "../src/middleware/requestValidator";
import { RequestWithSchema } from "@shared/types/RequestTypes";
import { TestGetRequestSchema, TestGetRequest } from "@shared/schemas/schema";

const app = express();
app.use(express.json());

app.get(
	"/test",
	validateRequest(TestGetRequestSchema),
	(req: TestGetRequest<Request>, res: Response) => { //specify express Request type here to extend Request type
		res.send({ query: req.query.requiredfield }); //typesafe access to the query parameters
	},
);

const PORT = process.env.PORT;

app.listen(PORT, () => { 
    console.log(`Server running at PORT: ${PORT}`); 
}).on("error", (error) => {
    console.error('Server error:', error.message);
});
```

## Frontend
```typescript
export const register = async (request: TestGetRequest) => {
  const response = await apiClient.get("/test", request);
  return response;
};
```


## Error Handling

If the request does not meet the defined schema, a 400 response is returned with an error message showing what condition wasn't met.

## License

MIT

