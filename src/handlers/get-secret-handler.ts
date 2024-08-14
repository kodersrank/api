import type { Handler } from 'elysia';
import { db } from '../db';

export const getSecretHandler: Handler = async ({ error, params }) => {
  const { hash } = params;

  // fetch the secret from the database
  const secret = await db('secrets').where({ hash }).first();

  // if secret does not exist, return 404
  if (!secret) {
    return error(404, 'secret not found');
  }

  const {
    expires_at: expiresAt,
    views_count: viewsCount,
    expire_after: expireAfter,
    expire_after_views: expireAfterViews,
    secret: secretText,
    created_at: createdAt,
  } = secret;

  // check expiration based on TTL
  if (expiresAt && new Date(expiresAt) <= new Date()) {
    return error(410, 'secret has expired');
  }

  // check expiration based on views
  if (viewsCount >= expireAfterViews) {
    return error(410, 'secret has expired');
  }

  const updatedCount = viewsCount + 1;

  // update the number of views
  await db('secrets').where({ hash }).update({
    views_count: updatedCount,
  });

  const remainingViews = +expireAfterViews - +updatedCount;

  // prepare the response data
  const response = {
    hash,
    secretText: secretText,
    createdAt,
    expiresAt,
    expireAfter,
    expireAfterViews,
    viewsCount: updatedCount,
    remainingViews: remainingViews >= 0 ? remainingViews : undefined,
  };

  // default response with 200 status code
  return response;
};
