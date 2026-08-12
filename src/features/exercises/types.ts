import type { MUSCLE_GROUPS } from './constants';

export type MuscleGroup = (typeof MUSCLE_GROUPS)[keyof typeof MUSCLE_GROUPS];
