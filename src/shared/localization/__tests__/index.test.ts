import i18next from 'i18next';

import '../index';

describe('localization', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en');
  });

  it('should return "Enter pincode" for auth.enterPin when language is "en"', async () => {
    // Arrange
    await i18next.changeLanguage('en');

    // Act
    const result = i18next.t('auth.enterPin');

    // Assert
    expect(result).toBe('Enter pincode');
  });

  it('should return "Темний режим" for settings.darkMode when language is "ua"', async () => {
    // Arrange
    await i18next.changeLanguage('ua');

    // Act
    const result = i18next.t('settings.darkMode');

    // Assert
    expect(result).toBe('Темний режим');
  });

  it('should fall back to "en" for an unsupported language', async () => {
    // Arrange
    await i18next.changeLanguage('fr');

    // Act
    const result = i18next.t('settings.title');

    // Assert
    expect(result).toBe('Settings');
  });
});
