import { Elysia } from 'elysia';
import { addSecretHandler } from './handlers/add-secret-handler';
import { getSecretHandler } from './handlers/get-secret-handler';
import { AddSecretSchema } from './schemas/add-secret-schema';
import { GetSecretSchema } from './schemas/get-secret-schema';
import { xml } from 'elysia-xml';
import swagger from '@elysiajs/swagger';

// Initialize Elysia server
const app = new Elysia()
  .use(swagger())
  .group('/secret', (app) =>
    app
      .use(xml())
      .post('/', addSecretHandler, AddSecretSchema)
      .get('/:hash', getSecretHandler, GetSecretSchema)
  )
  .listen(3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
