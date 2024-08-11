import { t } from 'elysia';
import { SecretSchema } from './secret-schema';

const baseSchema = Object.fromEntries(
  Object.entries(SecretSchema.properties).map(([k, v]) => [
    // this override is necessary because of divergence between endpoints in original API docs
    k === 'secret' ? 'secretText' : k,
    v,
  ])
);

export const SecretSchemaExtended = t.Object({
  ...baseSchema,
  hash: t.String(),
  createdAt: t.Date(),
  expiresAt: t.Date(),
});
