import type { Handler } from 'elysia';
import { db } from '../db';
import type { Secret } from '../types/secret.interface';

export const addSecretHandler: Handler = async ({ body }) => {
  const { secret, expireAfterViews, expireAfter } = body as Secret;

  // Insert secret into the database
  const [id] = await db('secrets')
    .insert({
      secret,
      expireAfterViews,
      expireAfter,
      createdAt: new Date(),
      expiresAt:
        expireAfter > 0 ? new Date(Date.now() + expireAfter * 60000) : null,
    })
    .returning('id');

  const response = {
    hash: id,
    secretText: secret,
    createdAt: new Date().toISOString(),
    expiresAt:
      expireAfter > 0
        ? new Date(Date.now() + expireAfter * 60000).toISOString()
        : null,
    remainingViews: expireAfterViews,
  };

  return response;
};
