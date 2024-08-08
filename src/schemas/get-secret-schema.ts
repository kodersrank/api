import { type InputSchema, t } from 'elysia';

export const GetSecretSchema: InputSchema<never> = {
  params: t.Object({
    hash: t.String(),
  }),
};
