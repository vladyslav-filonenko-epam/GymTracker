import { MMKV_KEYS, storage } from 'src/shared/utils/storage';

import { db } from '../index';
import { exercises } from '../schema';
import type { NewExercise } from '../schema';

const toMusclesJson = (groups: string[]) => JSON.stringify(groups);

const SEED_EXERCISES: NewExercise[] = [
  {
    id: 1,
    name: 'Barbell Bench Press',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Barbell',
    muscles: toMusclesJson(['CHEST', 'ARMS']),
    description:
      'Lie flat on the bench. Unrack the bar with a medium grip. Lower the bar to your mid-chest. Push the bar back up until arms are locked.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 2,
    name: 'Incline Dumbbell Press',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Dumbbells',
    muscles: toMusclesJson(['CHEST', 'ARMS']),
    description:
      'Set an incline bench to 30-45 degrees. Sit back and bring the dumbbells to your shoulders. Press the weights up over your chest. Lower back down under control.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 3,
    name: 'Push-Up',
    sport: 'Calisthenics',
    equipment: 'BODYWEIGHT',
    muscles: toMusclesJson(['CHEST', 'ARMS', 'CORE']),
    description:
      'Start in a plank position with hands slightly wider than shoulders. Lower your body until your chest nearly touches the floor. Keep your core tight and back straight. Push back up to the starting position.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 4,
    name: 'Barbell Back Squat',
    sport: 'Powerlifting',
    equipment: 'Barbell',
    muscles: toMusclesJson(['LEGS', 'BACK']),
    description:
      'Rest the barbell on your upper back muscles. Keep your feet shoulder-width apart. Squat down by pushing your hips back and bending knees. Drive through your heels to return to a standing position.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 5,
    name: 'Leg Press',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Machine',
    muscles: toMusclesJson(['LEGS']),
    description:
      'Sit on the machine and place feet on the sled. Lower the safety locks and control the weight down toward your chest. Press the platform away using your entire foot. Do not lock out your knees at the top.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 6,
    name: 'Bulgarian Split Squat',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Dumbbells',
    muscles: toMusclesJson(['LEGS']),
    description:
      'Place one foot flat behind you on a bench. Hold dumbbells at your sides. Lower your hips until your rear knee is just above the floor. Drive back up using your front leg.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 7,
    name: 'Conventional Deadlift',
    sport: 'Powerlifting',
    equipment: 'Barbell',
    muscles: toMusclesJson(['LEGS', 'BACK']),
    description:
      'Stand with mid-foot under the barbell. Bend over and grab the bar with a shoulder-width grip. Drop your hips slightly and flatten your spine. Stand up with the weight, keeping the bar close to your shins.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 8,
    name: 'Romanian Deadlift',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Barbell',
    muscles: toMusclesJson(['LEGS', 'BACK']),
    description:
      'Hold a barbell at your hips with a shoulder-width grip. Hinge at your hips, pushing them straight back. Lower the bar down your thighs while keeping your back flat. Squeeze your glutes to return to a standing position.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 9,
    name: 'Leg Curl',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Machine',
    muscles: toMusclesJson(['LEGS']),
    description:
      "Lie or sit on the leg curl machine. Align your knees with the machine's pivot point. Pull your heels toward your glutes dynamically. Slowly return the weight to the starting position.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 10,
    name: 'Pull-Up',
    sport: 'Calisthenics',
    equipment: 'BODYWEIGHT',
    muscles: toMusclesJson(['BACK', 'ARMS']),
    description:
      'Hang from a pull-up bar with an overhand grip. Pull your shoulder blades down and back. Drive your elbows toward your ribs to pull your chest to the bar. Lower yourself slowly back to a dead hang.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 11,
    name: 'Barbell Row',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Barbell',
    muscles: toMusclesJson(['BACK', 'ARMS']),
    description:
      'Hinge at the hips with a flat back, holding a barbell. Pull the bar up toward your lower chest/belly button. Squeeze your shoulder blades together at the top. Lower the bar with control back to the starting point.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 12,
    name: 'Lat Pulldown',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Cable Machine',
    muscles: toMusclesJson(['BACK', 'ARMS']),
    description:
      'Sit at a pulldown station and secure your thighs. Grab the bar with a wide overhand grip. Pull the bar down to your upper chest while leaning slightly back. Slowly extend your arms back to the starting position.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 13,
    name: 'Overhead Press',
    sport: 'Olympic Weightlifting / Strength',
    equipment: 'Barbell',
    muscles: toMusclesJson(['ARMS', 'CORE']),
    description:
      'Hold a barbell at shoulder height with a front rack grip. Brace your core and squeeze your glutes. Press the bar straight up overhead, moving your head out of the way. Lock your arms out completely at the peak.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 14,
    name: 'Dumbbell Lateral Raise',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Dumbbells',
    muscles: toMusclesJson(['ARMS', 'BACK']),
    description:
      'Stand straight with dumbbells by your sides. Raise your arms out to the sides with a slight bend in your elbows. Stop once your arms are parallel to the floor. Lower the weights slowly back down.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 15,
    name: 'Cable Face Pull',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Cable Machine',
    muscles: toMusclesJson(['BACK', 'ARMS']),
    description:
      'Set a cable machine pulley to upper chest height with a rope attachment. Hold the rope ends and step back to pull the weight off the stack. Pull the rope toward your face, flaring your elbows. External rotate your hands at the end of the pull.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 16,
    name: 'Barbell Bicep Curl',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Barbell',
    muscles: toMusclesJson(['ARMS']),
    description:
      'Stand straight holding a barbell with an underhand grip. Keep your elbows locked close to your torso. Curl the weight up while contracting your biceps. Lower the bar slowly back to the initial point.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 17,
    name: 'Dumbbell Hammer Curl',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Dumbbells',
    muscles: toMusclesJson(['ARMS']),
    description:
      'Stand straight holding dumbbells with a neutral (palms facing) grip. Keep your upper arms stationary. Curl the weights up while keeping your palms facing each other. Lower back down with a steady pace.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 18,
    name: 'Cable Overhead Tricep Extension',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Cable Machine',
    muscles: toMusclesJson(['ARMS', 'CORE']),
    description:
      'Attach a rope to a bottom or top pulley and face away from it. Hold the rope behind your head with elbows bent. Extend your arms upward to pull the cable. Squeeze your triceps at the top elongation point.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 19,
    name: 'Tricep Rope Pushdown',
    sport: 'Fitness / Bodybuilding',
    equipment: 'Cable Machine',
    muscles: toMusclesJson(['ARMS']),
    description:
      'Attach a rope to a high pulley and grab the handles. Keep your elbows tucked tightly against your ribs. Push the rope down, separating your hands at the bottom. Slowly let the rope return upward.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 20,
    name: 'Plank',
    sport: 'Fitness / Core',
    equipment: 'BODYWEIGHT',
    muscles: toMusclesJson(['CORE']),
    description:
      'Place forearms on the floor with elbows under your shoulders. Extend your legs behind you, keeping toes on the floor. Create a straight line from your head to your heels. Hold this rigid position while breathing deeply.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 21,
    name: 'Hanging Knee Raise',
    sport: 'Calisthenics',
    equipment: 'BODYWEIGHT',
    muscles: toMusclesJson(['CORE', 'LEGS']),
    description:
      'Hang from a bar with a straight body alignment. Raise your knees toward your chest by flexing your hips and abs. Pause for a brief second at the top peak. Lower your legs slowly to prevent swinging.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const seedExercises = async (): Promise<void> => {
  if (storage.getBoolean(MMKV_KEYS.EXERCISES_SEEDED)) {
    return;
  }

  for (const exercise of SEED_EXERCISES) {
    await db.insert(exercises).values(exercise);
  }

  storage.set(MMKV_KEYS.EXERCISES_SEEDED, true);
};
