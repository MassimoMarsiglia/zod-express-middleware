import { z } from "zod";
import { RequestWithSchema } from '../../types/RequestTypes';


export const testRequestSchema = z.object({
    query: z.object({
        testquery: z.string(),
    }),
    params: z.object({
        testparam: z.string(),
    }),
    body: z.object({
        testbody: z.string()
    })
})

export type testRequestType<Z = undefined> = RequestWithSchema<typeof testRequestSchema, Z>;