jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => {
    const store = new Map<string, unknown>();

    return {
      set: (k: string, v: unknown) => store.set(k, v),
      getString: (k: string) => store.get(k) as string | undefined,
      getBoolean: (k: string) => store.get(k) as boolean | undefined,
      delete: (k: string) => store.delete(k),
    };
  }),
}));

describe('storage', () => {
  it('should create an MMKV instance with id "gymtracker"', () => {
    // Arrange
    let capturedMMKV: jest.Mock | undefined;

    // Act
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      capturedMMKV = require('react-native-mmkv').MMKV;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../storage');
    });

    // Assert
    expect(capturedMMKV).toHaveBeenCalledWith({ id: 'gymtracker' });
  });

  it('should expose a usable storage instance', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { storage } = require('../storage');

    // Assert
    expect(storage).toBeDefined();
    expect(typeof storage.set).toBe('function');
    expect(typeof storage.getString).toBe('function');
  });
});
