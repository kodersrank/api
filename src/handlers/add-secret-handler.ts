import type { Handler } from 'elysia';
import { db } from '../db';
import type { Secret } from '../types/secret.interface';
import { createHash } from 'crypto';

export const addSecretHandler: Handler = async ({ body, set }) => {
  const { secret, expireAfterViews, expireAfter } = body as Secret;

  // generate unique hash
  const hash = createHash('sha256')
    .update(secret + Date.now().toString())
    .digest('hex');

  const createdAt = new Date();

  const expiresAt =
    +expireAfter <= 0 ? null : new Date(Date.now() + +expireAfter * 60000);

  // insert secret into the database
  await db('secrets').insert({
    secret,
    expire_after_views: expireAfterViews,
    expire_after: expireAfter,
    created_at: createdAt,
    expires_at: expiresAt,
    hash,
  });

  const response = {
    hash,
    secretText: secret,
    createdAt,
    expiresAt,
    expireAfter,
    expireAfterViews,
    remainingViews: expireAfterViews,
  };

  set.status = 201;

  return response;
};
