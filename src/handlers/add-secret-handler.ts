import type { Handler } from 'elysia';

export const addSecretHandler: Handler = async () => {
  // Mock response
  return { message: 'Secret added successfully' };
};
