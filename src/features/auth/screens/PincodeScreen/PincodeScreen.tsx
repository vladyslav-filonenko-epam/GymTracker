import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Pressable, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from 'src/features/auth';
import { useAppNavigation } from 'src/navigation/hooks';
import { DumbbellIcon } from 'src/shared/icons';

import { NUMPAD_ROWS, PIN_LENGTH } from './constants';
import { useStyles } from './styles';

export const PincodeScreen = () => {
  const { t } = useTranslation();
  const { styles, colors } = useStyles();
  const navigation = useAppNavigation();

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
  const pinLength = useSharedValue(0);

  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    initAuth();
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [initAuth]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const dot0AnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pinLength.value,
      [0, 1],
      ['transparent', colors.accent.primary],
    ),
    borderColor: interpolateColor(
      pinLength.value,
      [0, 1],
      [colors.overlay.border, colors.accent.primary],
    ),
  }));
  const dot1AnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pinLength.value,
      [1, 2],
      ['transparent', colors.accent.primary],
    ),
    borderColor: interpolateColor(
      pinLength.value,
      [1, 2],
      [colors.overlay.border, colors.accent.primary],
    ),
  }));
  const dot2AnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pinLength.value,
      [2, 3],
      ['transparent', colors.accent.primary],
    ),
    borderColor: interpolateColor(
      pinLength.value,
      [2, 3],
      [colors.overlay.border, colors.accent.primary],
    ),
  }));
  const dot3AnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pinLength.value,
      [3, 4],
      ['transparent', colors.accent.primary],
    ),
    borderColor: interpolateColor(
      pinLength.value,
      [3, 4],
      [colors.overlay.border, colors.accent.primary],
    ),
  }));

  const dotAnimStyles = [dot0AnimStyle, dot1AnimStyle, dot2AnimStyle, dot3AnimStyle];

  const resetPin = useCallback(() => {
    setPin('');
    pinLength.value = withTiming(0, { duration: 100 });
  }, [pinLength]);

  const triggerShake = useCallback(() => {
    shakeOffset.value = withSequence(
      withTiming(10, { duration: 60 }),
      withTiming(-10, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
    shakeTimerRef.current = setTimeout(resetPin, 400);
  }, [shakeOffset, resetPin]);

  const handlePinComplete = useCallback(
    async (completedPin: string) => {
      if (authStep === 'create') {
        setFirstPin(completedPin);
        setAuthStep('confirm');
        resetPin();
      } else if (authStep === 'confirm') {
        if (completedPin === firstPin) {
          await setupPin(completedPin);
          navigation.navigate('App', { screen: 'WorkoutTab', params: { screen: 'WorkoutList' } });
        } else {
          triggerShake();
          setFirstPin('');
          resetTimerRef.current = setTimeout(() => {
            setAuthStep('create');
            resetPin();
          }, 600);
        }
      } else if (authStep === 'verify') {
        const success = await verifyPin(completedPin);

        if (success) {
          navigation.navigate('App', { screen: 'WorkoutTab', params: { screen: 'WorkoutList' } });
        } else {
          triggerShake();
        }
      }
    },
    [authStep, firstPin, setupPin, verifyPin, navigation, triggerShake, resetPin, setAuthStep],
  );

  const handleDigit = useCallback(
    async (digit: string) => {
      if (pin.length >= PIN_LENGTH) return;

      const newPin = pin + digit;

      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        pinLength.value = withTiming(newPin.length, { duration: 150 }, finished => {
          if (finished) {
            scheduleOnRN(handlePinComplete, newPin);
          }
        });
      } else {
        pinLength.value = withTiming(newPin.length, { duration: 150 });
      }
    },
    [pin, pinLength, handlePinComplete],
  );

  const handleDelete = useCallback(() => {
    if (pin.length === 0) return;
    setPin(prev => prev.slice(0, -1));
    pinLength.value = withTiming(pin.length - 1, { duration: 100 });
  }, [pin, pinLength]);

  const subtitles: Record<'verify' | 'confirm' | 'create', string> = {
    verify: t('auth.enterPin'),
    confirm: t('auth.confirmPin'),
    create: t('auth.createPin'),
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

        <Text style={styles.subtitle}>{subtitles[authStep]}</Text>
      </View>

      <Animated.View style={[styles.dotsContainer, containerAnimatedStyle]}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <Animated.View key={i} style={[styles.dot, dotAnimStyles[i]]} />
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
