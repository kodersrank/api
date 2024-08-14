import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { getSecretHandler } from './get-secret-handler';
import type { Handler } from 'elysia';
import type { Knex } from 'knex';

vi.mock('../db', () => {
  const firstMock = vi.fn();
  const updateMock = vi.fn();
  const whereMock = vi.fn(() => ({
    first: firstMock,
    update: updateMock,
  }));

  return {
    firstMock,
    updateMock,
    whereMock,
    db: vi.fn(() => ({
      where: whereMock,
    })),
  };
});

describe('getSecretHandler', () => {
  const errorMock = vi.fn();
  let db: Mock<Knex<any, unknown[]>>;
  let firstMock: Mock;
  let updateMock: Mock;
  let whereMock: Mock;

  const DEF_MOCK = {
    hash: 'somehash',
    curDateRef: 1234567890123,
    expireAfterViews: 5,
    expireAfter: 3,
    viewsCount: 1,
  };

  const mockData = {
    ...structuredClone(DEF_MOCK),
    get expiryDateRef(): number {
      return this.curDateRef + this.expireAfter * 60000;
    },
  };

  beforeEach(async () => {
    ({ db, firstMock, updateMock, whereMock } = (await import('../db')) as any);

    vi.spyOn(Date, 'now').mockImplementation(() => mockData.curDateRef);
  });

  afterEach(() => {
    vi.clearAllMocks();

    Object.assign(mockData, DEF_MOCK);
  });

  describe('When called with an existing secret', () => {
    let latestResponse: any;

    beforeEach(async () => {
      firstMock.mockResolvedValue({
        secret: '🧂',
        created_at: new Date(mockData.curDateRef),
        expires_at: new Date(mockData.expiryDateRef),
        expire_after: mockData.expireAfter,
        expire_after_views: mockData.expireAfterViews,
        views_count: mockData.viewsCount,
      });

      latestResponse = await getSecretHandler({
        params: { hash: mockData.hash },
        error: errorMock,
      } as unknown as Parameters<Handler>[0]);
    });

    it('should call secrets table twice (select + update)', () => {
      expect(db.mock.calls).toEqual([['secrets'], ['secrets']]);
    });

    it('should filter results by matching hash', () => {
      expect(whereMock).toHaveBeenCalledWith({ hash: mockData.hash });
    });

    it('should update views count correctly', () => {
      expect(updateMock).toHaveBeenCalledWith({
        views_count: mockData.viewsCount + 1,
      });
    });

    it('should return the expected response', () => {
      const expected = {
        hash: mockData.hash,
        secretText: '🧂',
        createdAt: new Date(mockData.curDateRef),
        expiresAt: new Date(mockData.expiryDateRef),
        expireAfter: mockData.expireAfter,
        expireAfterViews: mockData.expireAfterViews,
        viewsCount: mockData.viewsCount + 1,
        remainingViews: mockData.expireAfterViews - (mockData.viewsCount + 1),
      };

      expect(latestResponse).toEqual(expected);
    });

    it('should not call error function on success', () => {
      expect(errorMock).not.toHaveBeenCalled();
    });
  });

  describe('When called with a non-existent secret', () => {
    beforeEach(async () => {
      firstMock.mockResolvedValue(null);

      await getSecretHandler({
        params: { hash: mockData.hash },
        error: errorMock,
      } as unknown as Parameters<Handler>[0]);
    });

    it('should return 404 for non-existent secret', () => {
      expect(errorMock).toHaveBeenCalledWith(404, 'secret not found');
    });
  });

  describe('When called with an expired secret', () => {
    beforeEach(async () => {
      firstMock.mockResolvedValue({
        secret: '🧂',
        created_at: new Date(mockData.curDateRef),
        expire_after: mockData.expireAfter,
        expire_after_views: mockData.expireAfterViews,
        views_count: mockData.viewsCount,
        expires_at: new Date(mockData.curDateRef - 1000), // expired
      });

      await getSecretHandler({
        params: { hash: mockData.hash },
        error: errorMock,
      } as unknown as Parameters<Handler>[0]);
    });

    it('should return 410 for expired secret', () => {
      expect(errorMock).toHaveBeenCalledWith(410, 'secret has expired');
    });
  });

  describe('When called with a secret exceeding view limit', () => {
    beforeEach(async () => {
      firstMock.mockResolvedValue({
        secret: '🧂',
        created_at: new Date(mockData.curDateRef),
        expires_at: new Date(mockData.expiryDateRef),
        expire_after: mockData.expireAfter,
        expire_after_views: mockData.expireAfterViews,
        views_count: mockData.expireAfterViews, // exceeds limit
      });

      await getSecretHandler({
        params: { hash: mockData.hash },
        error: errorMock,
      } as unknown as Parameters<Handler>[0]);
    });

    it('should return 410 for views exceeding limit', () => {
      expect(errorMock).toHaveBeenCalledWith(410, 'secret has expired');
    });
  });
});
