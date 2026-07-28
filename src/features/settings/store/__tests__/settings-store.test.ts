import { act } from 'react';

jest.mock('src/shared/utils/storage', () => ({
  storage: {
    getString: jest.fn(),
    set: jest.fn(),
  },
}));

const loadStoreWithStoredTheme = (storedTheme: string | undefined) => {
  let loadedModule: typeof import('../settings-store') | undefined;
  let loadedStorage: { getString: jest.Mock; set: jest.Mock } | undefined;

  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { storage } = require('src/shared/utils/storage');

    (storage.getString as jest.Mock).mockReturnValue(storedTheme);
    loadedStorage = storage;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    loadedModule = require('../settings-store');
  });

  return { ...loadedModule!, storage: loadedStorage! };
};

describe('useSettingsStore', () => {
  it('should initialize with theme "dark" when storage returns "dark"', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { useSettingsStore } = loadStoreWithStoredTheme('dark');

    // Assert
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('should initialize with theme "light" when storage returns "light"', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { useSettingsStore } = loadStoreWithStoredTheme('light');

    // Assert
    expect(useSettingsStore.getState().theme).toBe('light');
  });

  it('should default to theme "dark" when storage has no stored value', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { useSettingsStore } = loadStoreWithStoredTheme(undefined);

    // Assert
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('should default to theme "dark" when storage has an invalid stored value', () => {
    // Arrange
    // no additional arrangement needed

    // Act
    const { useSettingsStore } = loadStoreWithStoredTheme('not-a-theme');

    // Assert
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('should update theme when setTheme is called', () => {
    // Arrange
    const { useSettingsStore } = loadStoreWithStoredTheme('dark');

    // Act
    useSettingsStore.getState().setTheme('light');

    // Assert
    expect(useSettingsStore.getState().theme).toBe('light');
  });

  it('should NOT persist to storage when setTheme is called (ThemeProvider owns persistence)', () => {
    // Arrange
    const { useSettingsStore, storage } = loadStoreWithStoredTheme('dark');

    // Act
    act(() => {
      useSettingsStore.getState().setTheme('light');
    });

    // Assert
    expect(storage.set).not.toHaveBeenCalled();
  });
});
