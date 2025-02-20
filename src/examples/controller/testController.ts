import { Response } from "express";
import { testRequestType } from "../schemas/TestRequestSchema";


export const testControllerRoute = (req: testRequestType, res: Response) => {

    res.send({ query: req.query, params: req.params, body: req.body })
}