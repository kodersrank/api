import type { Handler } from 'elysia';
import { db } from '../db';
import type { Secret } from '../types/secret.interface';
import { createHash } from 'crypto';

export const addSecretHandler: Handler = async ({ body }) => {
  const { secret, expireAfterViews, expireAfter } = body as Secret;

  // generate unique hash
  const hash = createHash('sha256')
    .update(secret + Date.now().toString())
    .digest('hex');

  // insert secret into the database
  await db('secrets').insert({
    secret,
    expireAfterViews,
    expireAfter,
    createdAt: new Date(),
    expiresAt:
      expireAfter > 0 ? new Date(Date.now() + expireAfter * 60000) : null,
    hash,
  });

  const response = {
    hash,
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
