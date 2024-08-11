import { type InputSchema, t } from 'elysia';
import { SecretSchemaExtended } from './secret-schema-extended';

export const GetSecretSchema: InputSchema<never> = {
  params: t.Object({
    hash: t.String(),
  }),
  response: {
    200: SecretSchemaExtended,
    404: t.String({ description: 'Secret not found' }),
    410: t.String({ description: 'Secret has expired' }),
  },
};
