import swaggerUiExpress from 'swagger-ui-express';
import { spec } from '../lib/swagger';
import { asPlugin } from '../lib/util/typings';

export default asPlugin(async function swagger(app, options: Options) {
  const { routePrefix } = options;

  app
    .use(routePrefix, swaggerUiExpress.serve)
    .get(routePrefix, swaggerUiExpress.setup(spec));
});

interface Options {
  routePrefix: string;
}
