import React, { useEffect, useMemo, useState } from 'react';

import { Animated, Pressable, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from 'src/features/auth/store';
import type { RootStackParamList } from 'src/navigation/types';
import { DumbbellIcon } from 'src/shared/icons';
import { useTheme } from 'src/shared/theme';

import { createStyles } from './styles';

const PIN_LENGTH = 4;

const NUMPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

export const PincodeScreen = () => {
  const { colors, spacing, radius } = useTheme();
  const styles = createStyles(colors, spacing, radius);
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

  const shakeAnim = useMemo(() => new Animated.Value(0), []);
  const dotAnims = useMemo(
    () =>
      Array.from({ length: PIN_LENGTH }, () => ({
        scale: new Animated.Value(0.6),
        opacity: new Animated.Value(0),
      })),
    [],
  );

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const animateDotFill = (index: number, filled: boolean) => {
    if (filled) {
      Animated.parallel([
        Animated.timing(dotAnims[index].scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnims[index].opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(dotAnims[index].scale, {
          toValue: 0.6,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnims[index].opacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const resetPin = () => {
    setPin('');
    for (let i = 0; i < PIN_LENGTH; i++) {
      animateDotFill(i, false);
    }
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => resetPin(), 100);
    });
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
    if (authStep === 'verify') return 'ENTER PINCODE';
    if (authStep === 'confirm') return 'CONFIRM PINCODE';
    return 'CREATE PINCODE';
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

          <Text style={styles.logoText}>GYMTRACKER</Text>
        </View>

        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]}>
            <Animated.View
              style={{
                flex: 1,
                borderRadius: radius.full,
                backgroundColor: colors.accent.primary,
                transform: [{ scale: dotAnims[i].scale }],
                opacity: dotAnims[i].opacity,
              }}
            />
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
