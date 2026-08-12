import { renderHook } from '@testing-library/react-native';

import { useExercisesStore } from 'src/features/exercises/store';

import { useExercisesListScreen } from '../hooks';

jest.mock('src/features/exercises/store', () => ({
  useExercisesStore: jest.fn(),
}));

describe('useExercisesListScreen', () => {
  const mockFetchExercises = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useExercisesStore as unknown as jest.Mock).mockImplementation(
      (selector: (s: unknown) => unknown) =>
        selector({
          exercises: [],
          isLoading: false,
          fetchExercises: mockFetchExercises,
        }),
    );
  });

  it('should call fetchExercises on mount', () => {
    renderHook(() => useExercisesListScreen());

    expect(mockFetchExercises).toHaveBeenCalledTimes(1);
  });

  it('should return exercises and isLoading from store', () => {
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

    (useExercisesStore as unknown as jest.Mock).mockImplementation(
      (selector: (s: unknown) => unknown) =>
        selector({
          exercises: mockExercises,
          isLoading: true,
          fetchExercises: mockFetchExercises,
        }),
    );

    const { result } = renderHook(() => useExercisesListScreen());

    expect(result.current.exercises).toEqual(mockExercises);
    expect(result.current.isLoading).toBe(true);
  });
});
