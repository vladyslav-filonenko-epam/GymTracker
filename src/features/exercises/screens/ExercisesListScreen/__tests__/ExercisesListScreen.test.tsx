import { render, screen } from '@testing-library/react-native';

import 'src/shared/localization';

import { ExercisesListScreen } from '../ExercisesListScreen';

describe('ExercisesListScreen', () => {
  it('should render the "Exercises" header', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<ExercisesListScreen />);

    // Assert
    expect(screen.getByText('Exercises')).toBeTruthy();
  });

  it('should render the empty state message', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    render(<ExercisesListScreen />);

    // Assert
    expect(screen.getByText('No exercises yet')).toBeTruthy();
  });

  it('should match the snapshot', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { toJSON } = render(<ExercisesListScreen />);

    // Assert
    expect(toJSON()).toMatchSnapshot();
  });
});
