import { type InputSchema, t } from 'elysia';

export const AddSecretSchema: InputSchema<never> = {
  body: t.Object({
    secret: t.String(),
    expireAfterViews: t.Number({ minimum: 1 }),
    expireAfter: t.Number({ minimum: 0 }),
  }),
};
