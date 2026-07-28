import * as Keychain from 'react-native-keychain';

const PINCODE_SERVICE = 'com.gymtracker.pincode';

export const keychainUtils = {
  savePinHash: (hash: string) =>
    Keychain.setGenericPassword('pin', hash, { service: PINCODE_SERVICE }),
  getPinHash: async (): Promise<string | null> => {
    const result = await Keychain.getGenericPassword({ service: PINCODE_SERVICE });

    return result ? result.password : null;
  },
  deletePinHash: () => Keychain.resetGenericPassword({ service: PINCODE_SERVICE }),
};
