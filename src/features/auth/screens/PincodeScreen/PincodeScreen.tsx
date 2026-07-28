import React, { useEffect, useState } from 'react';

import { Pressable, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from 'src/features/auth/store';
import type { RootStackParamList } from 'src/navigation/types';
import { DumbbellIcon } from 'src/shared/icons';

import { useStyles } from './styles';

const PIN_LENGTH = 4;

const NUMPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

export const PincodeScreen = () => {
  const { t } = useTranslation();
  const { styles, colors } = useStyles();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { authStep, setAuthStep, setupPin, verifyPin, initAuth } = useAuthStore(
    useShallow(state => ({
      authStep: state.authStep,
      setAuthStep: state.setAuthStep,
      setupPin: state.setupPin,
      verifyPin: state.verifyPin,
      initAuth: state.initAuth,
    })),
  );

  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');

  const shakeOffset = useSharedValue(0);

  const dot0Scale = useSharedValue(0.6);
  const dot0Opacity = useSharedValue(0);
  const dot1Scale = useSharedValue(0.6);
  const dot1Opacity = useSharedValue(0);
  const dot2Scale = useSharedValue(0.6);
  const dot2Opacity = useSharedValue(0);
  const dot3Scale = useSharedValue(0.6);
  const dot3Opacity = useSharedValue(0);

  const dotSharedValues = [
    { scale: dot0Scale, opacity: dot0Opacity },
    { scale: dot1Scale, opacity: dot1Opacity },
    { scale: dot2Scale, opacity: dot2Opacity },
    { scale: dot3Scale, opacity: dot3Opacity },
  ];

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const dot0AnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot0Scale.value }],
    opacity: dot0Opacity.value,
  }));
  const dot1AnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot1Scale.value }],
    opacity: dot1Opacity.value,
  }));
  const dot2AnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot2Scale.value }],
    opacity: dot2Opacity.value,
  }));
  const dot3AnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot3Scale.value }],
    opacity: dot3Opacity.value,
  }));

  const dotAnimStyles = [dot0AnimStyle, dot1AnimStyle, dot2AnimStyle, dot3AnimStyle];

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const animateDotFill = (index: number, filled: boolean) => {
    const dot = dotSharedValues[index];

    if (dot) {
      dot.scale.value = withTiming(filled ? 1 : 0.6, { duration: filled ? 150 : 100 });
      dot.opacity.value = withTiming(filled ? 1 : 0, { duration: filled ? 150 : 100 });
    }
  };

  const resetPin = () => {
    setPin('');
    for (let i = 0; i < PIN_LENGTH; i++) {
      animateDotFill(i, false);
    }
  };

  const triggerShake = () => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values must be mutated via `.value`.
    shakeOffset.value = withSequence(
      withTiming(10, { duration: 60 }),
      withTiming(-10, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
    setTimeout(() => resetPin(), 400);
  };

  const handleDigit = async (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + digit;

    setPin(newPin);
    animateDotFill(newPin.length - 1, true);

    if (newPin.length === PIN_LENGTH) {
      await handlePinComplete(newPin);
    }
  };

  const handleDelete = () => {
    if (pin.length === 0) return;
    animateDotFill(pin.length - 1, false);
    setPin(prev => prev.slice(0, -1));
  };

  const handlePinComplete = async (completedPin: string) => {
    if (authStep === 'create') {
      setFirstPin(completedPin);
      setAuthStep('confirm');
      resetPin();
    } else if (authStep === 'confirm') {
      if (completedPin === firstPin) {
        await setupPin(completedPin);
        navigation.navigate('App');
      } else {
        triggerShake();
        setFirstPin('');
        setTimeout(() => {
          setAuthStep('create');
          resetPin();
        }, 600);
      }
    } else if (authStep === 'verify') {
      const success = await verifyPin(completedPin);

      if (success) {
        navigation.navigate('App');
      } else {
        triggerShake();
      }
    }
  };

  const getSubtitle = () => {
    if (authStep === 'verify') return t('auth.enterPin');
    if (authStep === 'confirm') return t('auth.confirmPin');
    return t('auth.createPin');
  };

  const renderKey = (key: string, colIndex: number) => {
    if (key === '') {
      return <View key={`empty-${colIndex}`} style={styles.numpadKeyEmpty} />;
    }

    if (key === 'del') {
      return (
        <Pressable key="del" style={styles.numpadKey} onPress={handleDelete}>
          <Text style={styles.numpadDeleteText}>⌫</Text>
        </Pressable>
      );
    }

    return (
      <Pressable key={key} style={styles.numpadKey} onPress={() => handleDigit(key)}>
        <Text style={styles.numpadKeyText}>{key}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.logoRow}>
          <DumbbellIcon width={24} height={24} color={colors.accent.primary} />

          <Text style={styles.logoText}>{t('auth.appName')}</Text>
        </View>

        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      <Animated.View style={[styles.dotsContainer, containerAnimatedStyle]}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]}>
            <Animated.View style={[styles.dotInner, dotAnimStyles[i]]} />
          </View>
        ))}
      </Animated.View>

      <View style={styles.numpad}>
        {NUMPAD_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numpadRow}>
            {row.map((key, colIndex) => renderKey(key, colIndex))}
          </View>
        ))}
      </View>
    </View>
  );
};
