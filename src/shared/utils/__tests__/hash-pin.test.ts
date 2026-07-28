import { hashPin } from '../hash-pin';

describe('hashPin', () => {
  it('should return the same hash for the same input (deterministic)', () => {
    // Arrange
    const pin = '1234';

    // Act
    const first = hashPin(pin);
    const second = hashPin(pin);

    // Assert
    expect(first).toBe(second);
  });

  it('should return different hashes for different inputs', () => {
    // Arrange
    const pinA = '1234';
    const pinB = '4321';

    // Act
    const hashA = hashPin(pinA);
    const hashB = hashPin(pinB);

    // Assert
    expect(hashA).not.toBe(hashB);
  });

  it('should return an 8 character hexadecimal string', () => {
    // Arrange
    const pin = '5678';

    // Act
    const result = hashPin(pin);

    // Assert
    expect(result).toHaveLength(8);
    expect(result).toMatch(/^[0-9a-f]{8}$/);
  });

  it('should return a valid 8 character hex string for an empty string', () => {
    // Arrange
    const pin = '';

    // Act
    const result = hashPin(pin);

    // Assert
    expect(result).toHaveLength(8);
    expect(result).toMatch(/^[0-9a-f]{8}$/);
  });

  it('should return the known hash value for pin "1234"', () => {
    // Arrange
    const pin = '1234';

    // Act
    const result = hashPin(pin);

    // Assert
    expect(result).toBe('fdc422fc');
  });

  it('should return the known hash value for pin "0000"', () => {
    // Arrange
    const pin = '0000';

    // Act
    const result = hashPin(pin);

    // Assert
    expect(result).toBe('f7fdea60');
  });

  it('should return the known hash value for an empty pin', () => {
    // Arrange
    const pin = '';

    // Act
    const result = hashPin(pin);

    // Assert
    expect(result).toBe('811c9dc5');
  });
});
