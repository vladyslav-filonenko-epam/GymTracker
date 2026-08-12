import { render, screen } from '@testing-library/react-native';

import 'src/shared/localization';

import { ExercisesListScreen } from '../ExercisesListScreen';
import { useExercisesListScreen } from '../hooks';

jest.mock('../hooks', () => ({
  useExercisesListScreen: jest.fn(),
}));

describe('ExercisesListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show ActivityIndicator when isLoading is true', () => {
    (useExercisesListScreen as jest.Mock).mockReturnValue({ exercises: [], isLoading: true });

    const { UNSAFE_queryByType } = render(<ExercisesListScreen />);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    expect(UNSAFE_queryByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });

  it('should show empty state message when exercises is empty and not loading', () => {
    (useExercisesListScreen as jest.Mock).mockReturnValue({ exercises: [], isLoading: false });

    render(<ExercisesListScreen />);

    expect(screen.getByText('No exercises yet')).toBeTruthy();
  });

  it('should render exercise names when exercises are present', () => {
    const mockExercises = [
      {
        id: 1,
        name: 'Bench Press',
        muscles: JSON.stringify({ primary: ['Chest'], secondary: [] }),
        equipment: 'Barbell',
        difficulty: 'Intermediate',
        isCustom: 0,
        createdAt: 1000,
        updatedAt: 1000,
      },
      {
        id: 2,
        name: 'Pull-Up',
        muscles: JSON.stringify({ primary: ['Lats'], secondary: [] }),
        equipment: 'Bodyweight',
        difficulty: 'Advanced',
        isCustom: 0,
        createdAt: 1000,
        updatedAt: 1000,
      },
    ];

    (useExercisesListScreen as jest.Mock).mockReturnValue({
      exercises: mockExercises,
      isLoading: false,
    });

    render(<ExercisesListScreen />);

    expect(screen.getByText('Bench Press')).toBeTruthy();
    expect(screen.getByText('Pull-Up')).toBeTruthy();
  });

  it('should render the "Exercises" header', () => {
    (useExercisesListScreen as jest.Mock).mockReturnValue({ exercises: [], isLoading: false });

    render(<ExercisesListScreen />);

    expect(screen.getByText('Exercises')).toBeTruthy();
  });

  it('should match the snapshot', () => {
    (useExercisesListScreen as jest.Mock).mockReturnValue({ exercises: [], isLoading: false });

    const { toJSON } = render(<ExercisesListScreen />);

    expect(toJSON()).toMatchSnapshot();
  });
});
