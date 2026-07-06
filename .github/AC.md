# GT-42: Workout Logging

## Feature
`workout`

## Branch
`task/GT-42`

## Type
`feature`

<!-- Types: feature | tech | design-system | refactor -->

## Description
As a user, I want to log a workout session with exercises, sets, reps, and weight so that I can track my gym progress over time.

## Acceptance Criteria

### AC-1: Create Workout
- [ ] User can tap "Start Workout" on the Workout tab
- [ ] A new workout is created with the current date and time
- [ ] User is navigated to the active workout screen

### AC-2: Add Exercise to Workout
- [ ] User can search and select an exercise from the Exercise Library
- [ ] Selected exercise is added to the current workout
- [ ] User can add multiple exercises

### AC-3: Log Sets
- [ ] User can add a set to an exercise with reps and weight
- [ ] User can edit an existing set
- [ ] User can delete a set
- [ ] Weight is displayed in kg

### AC-4: Finish Workout
- [ ] User can tap "Finish" to complete the workout
- [ ] Completed workout is saved to the database
- [ ] User is navigated back to the Workout history screen

### AC-5: View Workout History
- [ ] Completed workouts are listed in reverse chronological order
- [ ] Each item shows date, duration, and number of exercises

## Out of Scope
- Rest timers
- Workout templates
- Social sharing
