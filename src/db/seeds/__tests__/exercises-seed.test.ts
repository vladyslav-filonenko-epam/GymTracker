import { MMKV_KEYS, storage } from 'src/shared/utils/storage';

import { seedExercises } from '../exercises-seed';

const mockValues = jest.fn().mockResolvedValue([]);
const mockInsert = jest.fn().mockReturnValue({ values: mockValues });

jest.mock('src/db/index', () => ({
  db: {
    get insert() {
      return mockInsert;
    },
  },
}));

jest.mock('src/shared/utils/storage', () => ({
  storage: {
    getBoolean: jest.fn(),
    set: jest.fn(),
  },
  MMKV_KEYS: {
    EXERCISES_SEEDED: 'exercises_seeded',
  },
}));

describe('seedExercises', () => {
  beforeEach(() => {
    mockInsert.mockClear();
    mockValues.mockClear();
    mockValues.mockResolvedValue([]);
    mockInsert.mockReturnValue({ values: mockValues });
  });

  it('should insert all 21 exercises and set the seeded flag when not yet seeded', async () => {
    (storage.getBoolean as jest.Mock).mockReturnValue(false);

    await seedExercises();

    expect(mockInsert).toHaveBeenCalledTimes(21);
    expect(mockValues).toHaveBeenCalledTimes(21);
    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Barbell Bench Press' }),
    );
    expect(storage.set).toHaveBeenCalledWith(MMKV_KEYS.EXERCISES_SEEDED, true);
  });

  it('should skip insertion when already seeded', async () => {
    (storage.getBoolean as jest.Mock).mockReturnValue(true);

    await seedExercises();

    expect(mockInsert).not.toHaveBeenCalled();
    expect(storage.set).not.toHaveBeenCalled();
  });
});
