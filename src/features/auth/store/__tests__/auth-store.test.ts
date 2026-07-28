import { hashPin } from 'src/shared/utils/hash-pin';
import { keychainUtils } from 'src/shared/utils/keychain';

import { useAuthStore } from '../auth-store';

jest.mock('src/shared/utils/keychain', () => ({
  keychainUtils: {
    savePinHash: jest.fn(),
    getPinHash: jest.fn(),
    deletePinHash: jest.fn(),
  },
}));

jest.mock('src/shared/utils/hash-pin', () => ({
  hashPin: jest.fn(),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ isAuthenticated: false, isLoading: false, authStep: 'create' });
  });

  describe('setAuthStep', () => {
    it('should update the authStep in the store', () => {
      // Arrange
      const { setAuthStep } = useAuthStore.getState();

      // Act
      setAuthStep('confirm');

      // Assert
      expect(useAuthStore.getState().authStep).toBe('confirm');
    });
  });

  describe('initAuth', () => {
    it('should set authStep to "verify" when an existing hash is found', async () => {
      // Arrange
      (keychainUtils.getPinHash as jest.Mock).mockResolvedValue('existing_hash');

      // Act
      await useAuthStore.getState().initAuth();

      // Assert
      const state = useAuthStore.getState();

      expect(state.authStep).toBe('verify');
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should set authStep to "create" when no hash is found', async () => {
      // Arrange
      (keychainUtils.getPinHash as jest.Mock).mockResolvedValue(null);

      // Act
      await useAuthStore.getState().initAuth();

      // Assert
      const state = useAuthStore.getState();

      expect(state.authStep).toBe('create');
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should default to "create" step when getPinHash throws an error', async () => {
      // Arrange
      (keychainUtils.getPinHash as jest.Mock).mockRejectedValue(new Error('keychain error'));

      // Act
      await useAuthStore.getState().initAuth();

      // Assert
      const state = useAuthStore.getState();

      expect(state.authStep).toBe('create');
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setupPin', () => {
    it('should hash the pin, save it via keychain and set isAuthenticated to true', async () => {
      // Arrange
      (hashPin as jest.Mock).mockReturnValue('hashed_value');
      (keychainUtils.savePinHash as jest.Mock).mockResolvedValue(undefined);

      // Act
      await useAuthStore.getState().setupPin('1234');

      // Assert
      expect(hashPin).toHaveBeenCalledWith('1234');
      expect(keychainUtils.savePinHash).toHaveBeenCalledWith('hashed_value');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('verifyPin', () => {
    it('should return true and set isAuthenticated when the pin hash matches', async () => {
      // Arrange
      (keychainUtils.getPinHash as jest.Mock).mockResolvedValue('matching_hash');
      (hashPin as jest.Mock).mockReturnValue('matching_hash');

      // Act
      const result = await useAuthStore.getState().verifyPin('1234');

      // Assert
      expect(result).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('should return false and not authenticate when the pin hash does not match', async () => {
      // Arrange
      (keychainUtils.getPinHash as jest.Mock).mockResolvedValue('stored_hash');
      (hashPin as jest.Mock).mockReturnValue('different_hash');

      // Act
      const result = await useAuthStore.getState().verifyPin('9999');

      // Assert
      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should return false when there is no stored hash', async () => {
      // Arrange
      (keychainUtils.getPinHash as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await useAuthStore.getState().verifyPin('1234');

      // Assert
      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should set isAuthenticated to false', () => {
      // Arrange
      useAuthStore.setState({ isAuthenticated: true });

      // Act
      useAuthStore.getState().logout();

      // Assert
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
