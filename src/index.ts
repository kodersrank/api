import { Elysia } from 'elysia';
import { addSecretHandler } from './handlers/add-secret-handler';
import { getSecretHandler } from './handlers/get-secret-handler';
import { AddSecretSchema } from './schemas/add-secret-schema';
import { GetSecretSchema } from './schemas/get-secret-schema';
import { xml } from 'elysia-xml';

// Initialize Elysia server
const app = new Elysia()
  .use(xml())
  .post('/secret', addSecretHandler, AddSecretSchema)
  .get('/secret/:hash', getSecretHandler, GetSecretSchema)
  .listen(3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
