import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/services/api', () => ({
  api: {
    delete: vi.fn().mockResolvedValue({}),
    patch: vi.fn().mockResolvedValue({ cow: { id: '123', tag: 'T123', name: 'Bella' } }),
  },
}));

import { cowApi } from '@/services/cowApi';
import { api } from '@/services/api';

describe('cowApi', () => {
  beforeEach(() => {
    api.delete.mockClear();
    api.patch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call delete endpoint with /v1/cows/:id', async () => {
    await cowApi.deleteCow('123');
    expect(api.delete).toHaveBeenCalledWith('/v1/cows/123');
  });

  it('should call update endpoint with /v1/cows/:id and payload', async () => {
    const payload = { tag: 'T123', name: 'Bella', breed: 'Jersey', health: 'Healthy' };

    await cowApi.updateCow('123', payload);

    expect(api.patch).toHaveBeenCalledWith('/v1/cows/123', payload);
  });
});
