import { Response, Request } from "express";
import { testRequestType } from "../schemas/TestRequestSchema";


export const testControllerRoute = (req: testRequestType<Request>, res: Response) => {

    res.send({ query: req.query, params: req.params, body: req.body })
}