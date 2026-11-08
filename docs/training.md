# Training

This file describes the current training sessions, their mini-games and how results affect the athlete.

## Sessions

- Training is offered through six sessions, including the three core swim, bike and run options. ✅
- Swim Intervals uses Rhythm Gauge and has base gains of 2–4 swim and 1–2 stamina, with -12 energy, +8 fatigue and +1 morale. ✅
- Bike Endurance uses Sprint Tap and has base gains of 2–4 bike and 1–2 stamina, with -13 energy, +9 fatigue and +1 morale. ✅
- Tempo Run uses Pattern Recall and has base gains of 2–4 run and 1–2 focus, with -11 energy, +8 fatigue and +1 morale. ✅
- Brick Workout uses Rhythm Gauge and has base gains of 1–3 bike, 1–3 run and 1–2 focus, with -18 energy, +13 fatigue and +2 morale. ✅
- Strength & Core uses Pattern Recall and has base gains of 2–4 stamina and 1–2 focus, with -10 energy, +6 fatigue and +1 morale. ✅
- Recovery Day uses Sprint Tap and has a base gain of 0–1 focus, with +24 energy, -20 fatigue and +4 morale. ✅
- Base attribute gains are independently chosen as random whole numbers within the stated ranges before score scaling. ✅
- Training is available regardless of current energy; the training buttons are disabled when no actions remain. ✅
- Selecting a session opens a modal with instructions and a Start Mini-Game button; cancelling or pressing Escape closes it without consuming an action or granting rewards. ✅
- Completing a mini-game consumes one action, applies the session and its rewards, records the outcome and closes the modal. ✅

## Rhythm Gauge

- Rhythm Gauge has eight rounds with a white marker moving back and forth along a meter. ✅
- In each round, press Hit Zone while the marker is inside the green zone; its position changes for the next round. ✅
- A hit scores more when closer to the center of the green zone; a miss scores zero. ✅
- The final score is the rounded average of the eight round scores, expressed as a percentage. ✅

## Pattern Recall

- Pattern Recall displays a random six-symbol sequence chosen from triangle, diamond, circle and square. ✅
- Watch the symbols appear one at a time, then select the same symbols in order using the four buttons. ✅
- The first wrong input ends the game; the score is the percentage of the six positions correctly entered before that mistake. ✅
- Repeating all six symbols correctly scores 100%. ✅

## Sprint Tap

- Sprint Tap lasts 7.5 seconds and shows one target at a time in a playing field. ✅
- Tap the target to count a hit and immediately move it to a new random position. ✅
- A target also moves automatically after 650 milliseconds if it has not been tapped. ✅
- The final score is hits divided by 16 as a percentage, rounded and capped at 100%. ✅

## Applying a score

- Mini-game scores are rounded and capped between 0% and 100%. ✅
- Positive training changes are multiplied by 0.45 at 0% through 1.55 at 100%, with 1 at 50%, and rounded. ✅
- Negative training changes are multiplied by 1.35 at 0% through 0.65 at 100%, with 1 at 50%, and rounded. ✅
- Scaling follows the sign of each change rather than whether it is beneficial: higher scores also increase positive fatigue gains and reduce the magnitude of Recovery Day's negative fatigue change. ✅
- The resulting attributes and condition are clamped to their normal limits after the session. ✅
- Each completed session awards ranking points equal to 2 plus the score divided by 11, rounded, giving 2–11 points. ✅
- Each completed session awards the score divided by 22 in stars, rounded, giving 0–5 stars. ✅
- The journey log records the session, score, mini-game result and rewards; the final toast shows the session and score. ✅
- Proposed feature: Track each session's personal-best mini-game score and display it alongside the current score after each workout.
