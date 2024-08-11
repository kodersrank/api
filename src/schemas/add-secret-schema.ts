import { type InputSchema, t } from 'elysia';
import { SecretSchema } from './secret-schema';
import { SecretSchemaExtended } from './secret-schema-extended';

export const AddSecretSchema: InputSchema<never> = {
  body: t.Object(SecretSchema),
  response: {
    201: t.Object(SecretSchemaExtended.properties, {
      description: 'Successful operation',
    }),
    422: t.String({ description: 'Invalid input' }),
  },
};
