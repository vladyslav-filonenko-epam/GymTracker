import type { ReactNode } from 'react';

import { ActivityIndicator, View } from 'react-native';

import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';

import { db, migrations, seedDatabase } from 'src/db';

import { useStyles } from './styles';

interface DbProviderProps {
  children: ReactNode;
}

export const DbProvider = ({ children }: DbProviderProps) => {
  const { styles, colors } = useStyles();
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('[DbProvider] Migration failed:', error.message);
    }

    return null;
  }

  if (!success) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.accent.primary} />
      </View>
    );
  }

  void seedDatabase();

  return <>{children}</>;
};
