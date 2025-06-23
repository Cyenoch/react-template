import { registerGlobalMiddleware } from '@tanstack/react-start';
import { appMiddlewares } from './server/middleware/global';

registerGlobalMiddleware({
  middleware: [...appMiddlewares],
});
