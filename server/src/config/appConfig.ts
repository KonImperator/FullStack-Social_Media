import { Application } from 'express';

import { initDB } from './dbConfig';
import { initExpress } from './expressConfig';
import { initRoutes } from './routeConfig';
import { auth } from '../middlewares/auth';
import { errorHandler } from '../utils/errorHandler';

export async function init(app: Application) {
    await initDB();
    initExpress(app);
    app.use(auth());
    initRoutes(app);
}
