import express from 'express';
import { validateRequest } from '../../middleware/requestValidator';
import { testRequestSchema } from '../schemas/TestRequestSchema';
import { testControllerRoute } from '../controller/testController';

const router = (): express.Router => {
    const router = express.Router();

    testRoutes(router);

    return router;
}

const testRoutes = (router: express.Router) => {
    router.get('/test', validateRequest(testRequestSchema), testControllerRoute)
}

export default router;