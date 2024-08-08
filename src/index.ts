import { Elysia } from 'elysia';
import { addSecretHandler } from './handlers/add-secret-handler';
import { getSecretHandler } from './handlers/get-secret-handler';

// Initialize Elysia server
const app = new Elysia();

// Define routes with mock responses
app.post('/secret', addSecretHandler);

app.get('/secret/:hash', getSecretHandler);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
