import * as Keychain from 'react-native-keychain';

import { keychainUtils } from '../keychain';

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue({ password: 'hashed_pin' }),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
}));

const PINCODE_SERVICE = 'com.gymtracker.pincode';

describe('keychainUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('savePinHash', () => {
    it('should call Keychain.setGenericPassword with correct args including service', async () => {
      // Arrange
      const hash = 'abcd1234';

      // Act
      await keychainUtils.savePinHash(hash);

      // Assert
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith('pin', hash, {
        service: PINCODE_SERVICE,
      });
    });
  });

  describe('getPinHash', () => {
    it('should return the password from the result', async () => {
      // Arrange
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce({
        password: 'stored_hash',
      });

      // Act
      const result = await keychainUtils.getPinHash();

      // Assert
      expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: PINCODE_SERVICE });
      expect(result).toBe('stored_hash');
    });

    it('should return null when getGenericPassword returns false', async () => {
      // Arrange
      (Keychain.getGenericPassword as jest.Mock).mockResolvedValueOnce(false);

      // Act
      const result = await keychainUtils.getPinHash();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('deletePinHash', () => {
    it('should call Keychain.resetGenericPassword with correct service', async () => {
      // Arrange
      // no additional arrange needed

      // Act
      await keychainUtils.deletePinHash();

      // Assert
      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({ service: PINCODE_SERVICE });
    });
  });
});
