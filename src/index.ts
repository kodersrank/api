import { Elysia } from 'elysia';
import { addSecretHandler } from './handlers/add-secret-handler';
import { getSecretHandler } from './handlers/get-secret-handler';
import { AddSecretSchema } from './schemas/add-secret-schema';
import { GetSecretSchema } from './schemas/get-secret-schema';
import { xml } from 'elysia-xml';
import swagger from '@elysiajs/swagger';
import cors from '@elysiajs/cors';

// Initialize Elysia server
const app = new Elysia()
  .use(
    cors({
      origin: new RegExp(`${process.env.APP_ORIGIN}$`),
    })
  )
  .use(swagger())
  .group('/api', (app) =>
    app
      .use(xml())
      .post('/secret/', addSecretHandler, AddSecretSchema)
      .get('/secret/:hash', getSecretHandler, GetSecretSchema)
  )
  .listen(3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
