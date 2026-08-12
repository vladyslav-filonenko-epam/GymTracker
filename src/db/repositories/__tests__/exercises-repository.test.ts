import { db } from 'src/db/index';

import { exercisesRepository } from '../exercises-repository';

jest.mock('src/db/index', () => ({
  db: {
    select: jest.fn(),
    from: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    insert: jest.fn(),
    values: jest.fn(),
    returning: jest.fn(),
    update: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('drizzle-orm', () => ({
  desc: jest.fn(col => ({ desc: col })),
  eq: jest.fn((col, val) => ({ eq: col, val })),
}));

jest.mock('src/db/schema', () => ({
  exercises: { id: 'id', createdAt: 'createdAt' },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe('exercisesRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockDb.select as jest.Mock).mockReturnValue(mockDb);
    (mockDb.from as jest.Mock).mockReturnValue(mockDb);
    (mockDb.where as jest.Mock).mockReturnValue(mockDb);
    (mockDb.orderBy as jest.Mock).mockResolvedValue([]);
    (mockDb.insert as jest.Mock).mockReturnValue(mockDb);
    (mockDb.values as jest.Mock).mockReturnValue(mockDb);
    (mockDb.returning as jest.Mock).mockResolvedValue([]);
    (mockDb.update as jest.Mock).mockReturnValue(mockDb);
    (mockDb.set as jest.Mock).mockReturnValue(mockDb);
    (mockDb.delete as jest.Mock).mockReturnValue(mockDb);
  });

  describe('findAll', () => {
    it('should call select, from, orderBy in chain and return array', async () => {
      const mockExercises = [
        {
          id: 1,
          name: 'Bench Press',
          muscles: '{}',
          equipment: 'Barbell',
          difficulty: 'Intermediate',
          isCustom: 0,
          createdAt: 1000,
          updatedAt: 1000,
        },
      ];

      (mockDb.orderBy as jest.Mock).mockResolvedValue(mockExercises);

      const result = await exercisesRepository.findAll();

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.orderBy).toHaveBeenCalled();
      expect(result).toEqual(mockExercises);
    });
  });

  describe('findById', () => {
    it('should call select, from, where and return the first record', async () => {
      const mockExercise = {
        id: 1,
        name: 'Bench Press',
        muscles: '{}',
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        isCustom: 0,
        createdAt: 1000,
        updatedAt: 1000,
      };

      (mockDb.where as jest.Mock).mockResolvedValue([mockExercise]);

      const result = await exercisesRepository.findById(1);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(result).toEqual(mockExercise);
    });

    it('should return undefined when no record found', async () => {
      (mockDb.where as jest.Mock).mockResolvedValue([]);

      const result = await exercisesRepository.findById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should call insert, values, returning and return the first record', async () => {
      const newExercise = {
        name: 'Push-Up',
        muscles: '{}',
        equipment: 'Bodyweight',
        difficulty: 'Beginner',
        isCustom: 0,
        createdAt: 1000,
        updatedAt: 1000,
      };
      const created = { id: 2, ...newExercise };

      (mockDb.returning as jest.Mock).mockResolvedValue([created]);

      const result = await exercisesRepository.create(newExercise);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(newExercise);
      expect(mockDb.returning).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should call update, set, where, returning and return the updated record', async () => {
      const updated = {
        id: 1,
        name: 'Updated',
        muscles: '{}',
        equipment: 'Barbell',
        difficulty: 'Advanced',
        isCustom: 0,
        createdAt: 1000,
        updatedAt: 2000,
      };

      (mockDb.returning as jest.Mock).mockResolvedValue([updated]);

      const result = await exercisesRepository.update(1, { name: 'Updated' });

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Updated', updatedAt: expect.any(Number) }),
      );
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.returning).toHaveBeenCalled();
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should call delete, where and resolve to undefined', async () => {
      (mockDb.where as jest.Mock).mockResolvedValue([]);

      const result = await exercisesRepository.delete(1);

      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
