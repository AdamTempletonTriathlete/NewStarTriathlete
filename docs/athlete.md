# Athlete

This file describes the saved athlete, condition, progression and career records currently implemented.

## Starting athlete

- An athlete requires a non-blank name, trimmed and limited to 24 characters. ✅
- A new athlete starts in London in week 1 of season 1 with three actions and 140 stars. ✅
- Starting attributes are swim 52, bike 52, run 52, stamina 50 and focus 50. ✅
- Starting condition is energy 84, fatigue 12 and morale 72. ✅
- Swim gear, bike setup and run kit each start at level 1 and can reach level 6. ✅
- A new athlete starts with zero ranking points, races, wins and podiums, and no best finish or claimed milestones. ✅
- London and Barcelona are initially marked as unlocked cities; other cities become marked as unlocked after visiting. ✅

## Attributes and condition

- Swim, bike and run are the respective discipline attributes; stamina and focus contribute to all three simulated race legs. ✅
- Attributes are clamped between 35 and 100, including after training or weekly events. ✅
- Energy, fatigue and morale are clamped between 0 and 100. ✅
- Higher energy and lower fatigue improve simulated race performance; low energy does not prevent training, travel or race entry. ✅
- Morale changes through activities, milestones, upgrades and weekly events; it adds a bounded modifier of -3 to +3 power to each race leg, with neutral performance at 50 morale. ✅
- The Status page displays energy, morale, fatigue and all five attributes as numerical bars; fatigue's bar is inverted so lower fatigue looks better. ✅
- Attributes improve through training and some random weekly events; there is no athlete level, experience bar or level-up threshold. ✅
- Mini-game quality scales each training session's randomly selected attribute gains; an attribute cannot exceed 100. ✅
- Each training session keeps its highest mini-game score as a personal best; the current result and personal best are shown after the workout. ✅
- Gear levels improve the corresponding race leg separately from the athlete's attributes; upgrades do not consume weekly actions. ✅
- On ending a week, energy increases by 18, fatigue decreases by 22 and morale changes randomly by -1 to +3, before any weekly event and clamping. ✅
- Travelling changes energy by -7, fatigue by +6 and morale by +2; racing changes condition based on race format, difficulty and finishing position. ✅

## Ranking and career

- Ranking points come from training and races and are used to qualify for races and claim milestones. ✅
- World rank is recalculated from ranking points, wins, podiums and average attributes; a lower rank number is better. ✅
- The stored initial world rank is 7000, but the first game render recalculates it from the athlete's starting attributes. ✅
- Career records track races entered, wins, podiums, best world rank and best finishing position. ✅
- Season results track race ranking points and entries; athletes who reach 250 race RP and enter at least two races qualify for a championship in week 12. ✅
- Winning a season championship awards 100 stars and a persistent +2 race-power legacy bonus, capped at +10; championship wins are recorded in the career summary. ✅
- Each race record in the journey log includes swim, bike, run and transition split times. ✅
- Win rate is calculated for display from wins divided by races entered; it is not stored separately. ✅
- The career summary shows the next unclaimed ranking-point milestone, or indicates when all milestones have been claimed. ✅
- Reaching a milestone automatically awards its stars and +3 morale once; claimed milestones are saved. ✅
- Journey history records week-numbered activity messages, newest first, and retains at most 80 entries. ✅
- Star transaction history records each earning and expense with its source and resulting balance, newest first, retaining at most 100 transactions. ✅

## Saved state

- The single local save includes a version, athlete name, week, season, actions remaining, current location, stars, ranking points, world rank and rank tier. ✅
- The save also includes energy, fatigue, morale, all five attributes, three gear levels and the career records. ✅
- Claimed milestones, visited/unlocked cities, the current upcoming race instances and journey history are saved. ✅
- The save also retains training personal bests, season championship progression and rewards, and star transactions. ✅
- Progress is saved when the game renders after changes; continuing restores the saved athlete and regenerates the calendar if it is empty. ✅
- Starting a new athlete replaces the existing single save; the Career page also provides a confirmed option to clear it. ✅
- Saves are local to the browser's storage, not synchronized between devices; a save failure is reported in a toast. ✅
