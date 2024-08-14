import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { addSecretHandler } from './add-secret-handler';
import type { Handler } from 'elysia';
import type { Knex } from 'knex';

vi.mock('../db', () => {
  const insert = vi.fn();

  return {
    insertMock: insert,
    db: vi.fn(() => ({
      insert,
    })),
  };
});
describe('addSecretHandler', () => {
  let db: Mock<Knex<any, unknown[]>>;

  let insertMock: Mock;

  const DEF_MOCK = {
    secret: '🧂',
    curDateRef: 1234567890123,
    expireAfterViews: 5,
    expireAfter: 3,
  };

  const mockData = {
    ...structuredClone(DEF_MOCK),
    get expiryDateRef(): number {
      return this.curDateRef + this.expireAfter * 60000;
    },
  };

  beforeEach(async () => {
    ({ db, insertMock } = (await import('../db')) as any);

    vi.spyOn(Date, 'now').mockImplementation(() => mockData.curDateRef);
  });

  afterEach(() => {
    vi.clearAllMocks();

    Object.assign(mockData, DEF_MOCK);
  });

  describe('When called', () => {
    let set: Record<string, unknown>;

    const SHA_256_HASH = expect.stringMatching(/^[a-f\d]{64}$/);

    let latestResponse: any;

    beforeEach(async () => {
      set = { status: null };

      latestResponse = await addSecretHandler({
        body: {
          secret: mockData.secret,
          expireAfterViews: mockData.expireAfterViews,
          expireAfter: mockData.expireAfter,
        },
        set,
      } as Parameters<Handler>[0]);
    });

    describe('insert statement', () => {
      it('should point to secrets table', () => {
        expect(db.mock.calls).toEqual([['secrets']]);
      });

      it('should be called', () => {
        expect(insertMock).toHaveBeenCalledOnce();
      });

      describe('when expireAfter value is positive', () => {
        it('should be provided a matching payload with valid expiry date', () => {
          const expectedCall = [
            expect.objectContaining({
              secret: mockData.secret,
              expire_after: mockData.expireAfter,
              expire_after_views: mockData.expireAfterViews,
              created_at: new Date(mockData.curDateRef),
              expires_at: new Date(mockData.expiryDateRef),
              hash: SHA_256_HASH,
            }),
          ];

          expect(insertMock.mock.calls).toEqual([expectedCall]);
        });

        describe('when expireAfter value is zero', () => {
          beforeAll(() => {
            mockData.expireAfter = 0;
          });

          it('should be provided a matching payload with valid expiry date', () => {
            const expectedCall = [
              expect.objectContaining({
                secret: mockData.secret,
                expire_after: mockData.expireAfter,
                expire_after_views: mockData.expireAfterViews,
                created_at: new Date(mockData.curDateRef),
                expires_at: null,
                hash: SHA_256_HASH,
              }),
            ];

            expect(insertMock.mock.calls).toEqual([expectedCall]);
          });
        });
      });
    });

    describe('HTTP status code', () => {
      it('should be set to 201', () => {
        expect(set.status).toBe(201);
      });
    });

    describe('when expireAfter is positive', () => {
      describe('Response body', () => {
        it('should match expected contract with expiry date', () => {
          const expected = expect.objectContaining({
            hash: SHA_256_HASH,
            secretText: mockData.secret,
            createdAt: new Date(mockData.curDateRef),
            expiresAt: new Date(mockData.expiryDateRef),
            expireAfter: mockData.expireAfter,
            expireAfterViews: mockData.expireAfterViews,
            remainingViews: mockData.expireAfterViews,
          });

          expect(latestResponse).toEqual(expected);
        });

        it('should match snapshot', () => {
          expect(latestResponse).toMatchSnapshot();
        });
      });
    });

    describe('when expireAfter is zero', () => {
      beforeAll(() => {
        mockData.expireAfter = 0;
      });

      describe('Response body', () => {
        it('should match expected contract without expiry date', () => {
          const expected = expect.objectContaining({
            hash: SHA_256_HASH,
            secretText: mockData.secret,
            createdAt: new Date(mockData.curDateRef),
            expiresAt: null,
            expireAfter: 0,
            expireAfterViews: mockData.expireAfterViews,
            remainingViews: mockData.expireAfterViews,
          });

          expect(latestResponse).toEqual(expected);
        });

        it('should match snapshot', () => {
          expect(latestResponse).toMatchSnapshot();
        });
      });
    });
  });
});
