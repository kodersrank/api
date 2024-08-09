import type { Handler } from 'elysia';
import { db } from '../db';

export const getSecretHandler: Handler = async ({ error, params }) => {
  const { hash } = params;

  // Retrieve secret from the database
  const secretRecord = await db('secrets').where({ id: hash }).first();

  if (!secretRecord) {
    error(404);
    return;
  }

  const response = {
    hash: secretRecord.id,
    secretText: secretRecord.secret,
    createdAt: secretRecord.createdAt.toISOString(),
    expiresAt: secretRecord.expiresAt
      ? secretRecord.expiresAt.toISOString()
      : null,
    remainingViews: secretRecord.expireAfterViews,
  };

  return response;
};
