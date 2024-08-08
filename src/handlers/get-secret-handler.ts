import type { Handler } from 'elysia';

export const getSecretHandler: Handler = async () => {
  // Mock response
  return { message: 'Secret retrieved successfully' };
};
