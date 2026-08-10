import { render, screen } from '@testing-library/react-native';

import 'src/shared/localization';

import { WorkoutListScreen } from '../WorkoutListScreen';

describe('WorkoutListScreen', () => {
  it('should render the "Workouts" header', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<WorkoutListScreen />);

    // Assert
    expect(screen.getByText('Workouts')).toBeTruthy();
  });

  it('should render the empty state message', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<WorkoutListScreen />);

    // Assert
    expect(screen.getByText('No workouts yet')).toBeTruthy();
  });

  it('should match the snapshot', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { toJSON } = render(<WorkoutListScreen />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });
});
