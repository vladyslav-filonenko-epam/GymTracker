import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const useAppNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
