import { exercisesRepository } from 'src/db/repositories';

import { useExercisesStore } from '../exercises-store';

jest.mock('src/db/repositories', () => ({
  exercisesRepository: {
    findAll: jest.fn(),
  },
}));

describe('useExercisesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useExercisesStore.setState({ exercises: [], isLoading: false, error: null });
  });

  it('should have correct initial state', () => {
    const state = useExercisesStore.getState();

    expect(state.exercises).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set isLoading true while fetching, then resolve with data', async () => {
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

    (exercisesRepository.findAll as jest.Mock).mockResolvedValue(mockExercises);

    const fetchPromise = useExercisesStore.getState().fetchExercises();

    expect(useExercisesStore.getState().isLoading).toBe(true);

    await fetchPromise;

    const state = useExercisesStore.getState();

    expect(state.isLoading).toBe(false);
    expect(state.exercises).toEqual(mockExercises);
    expect(state.error).toBeNull();
  });

  it('should set error state when fetch throws an Error', async () => {
    (exercisesRepository.findAll as jest.Mock).mockRejectedValue(new Error('DB error'));

    await useExercisesStore.getState().fetchExercises();

    const state = useExercisesStore.getState();

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('DB error');
    expect(state.exercises).toEqual([]);
  });

  it('should set "Unknown error" when fetch throws a non-Error', async () => {
    (exercisesRepository.findAll as jest.Mock).mockRejectedValue('some string error');

    await useExercisesStore.getState().fetchExercises();

    const state = useExercisesStore.getState();

    expect(state.error).toBe('Unknown error');
  });
});
