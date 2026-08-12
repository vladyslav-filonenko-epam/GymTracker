import { render, screen } from '@testing-library/react-native';

import { ExerciseCard } from '../ExerciseCard';

describe('ExerciseCard', () => {
  const defaultProps = {
    name: 'Barbell Bench Press',
    muscles: JSON.stringify(['CHEST', 'ARMS']),
    equipment: 'Barbell',
  };

  it('should render the exercise name', () => {
    render(<ExerciseCard {...defaultProps} />);

    expect(screen.getByText('Barbell Bench Press')).toBeTruthy();
  });

  it('should render muscles parsed from JSON array', () => {
    render(<ExerciseCard {...defaultProps} />);

    expect(screen.getByText('CHEST, ARMS')).toBeTruthy();
  });

  it('should render equipment', () => {
    render(<ExerciseCard {...defaultProps} />);

    expect(screen.getByText('Barbell')).toBeTruthy();
  });

  it('should handle multiple muscles joined by comma', () => {
    render(<ExerciseCard {...defaultProps} muscles={JSON.stringify(['LEGS', 'BACK', 'CORE'])} />);

    expect(screen.getByText('LEGS, BACK, CORE')).toBeTruthy();
  });

  it('should render nothing for muscles when null', () => {
    render(<ExerciseCard {...defaultProps} muscles={null} />);

    expect(screen.getByText('Barbell Bench Press')).toBeTruthy();
  });

  it('should handle malformed muscles JSON gracefully', () => {
    render(<ExerciseCard {...defaultProps} muscles="invalid json" />);

    expect(screen.getByText('Barbell Bench Press')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<ExerciseCard {...defaultProps} />);

    expect(toJSON()).toMatchSnapshot();
  });
});
