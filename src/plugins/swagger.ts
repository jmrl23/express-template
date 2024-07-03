import swaggerUiExpress from 'swagger-ui-express';
import { spec } from '../lib/docs';
import { asPlugin } from '../lib/util/typings';

export default asPlugin<Options>(async function swagger(app, options) {
  const { routePrefix } = options;

  app
    .use(routePrefix, swaggerUiExpress.serve)
    .get(routePrefix, swaggerUiExpress.setup(spec));
});

interface Options {
  routePrefix: string;
}
