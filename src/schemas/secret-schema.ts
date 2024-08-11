import { t } from 'elysia';

export const SecretSchema = t.Object({
  secret: t.String(),
  expireAfterViews: t.Number({ minimum: 1 }),
  expireAfter: t.Number({ minimum: 0 }),
});
