# Interface

This file describes the current screens, navigation and visible controls, and the purpose of each area.

## General layout

- The interface is a dark, mobile-first, card-based static web page, with the main content centered and limited to 560 pixels wide. ✅
- A fixed bottom navigation bar switches between Status, Training, Travel and Career panels without loading separate pages. ✅
- Status is the initially active panel; changing tabs scrolls the window to the top. ✅
- Layouts use responsive grids, including a wider status summary grid on screens at least 600 pixels wide. ✅
- Short-lived toast messages report actions, results and errors; the toast is announced through a polite live region. ✅

## Start screen

- The start overlay explains the goal and accepts an athlete name of up to 24 characters. ✅
- Start Journey, or Enter in the name field, creates a new athlete; a blank name shows an inline prompt. ✅
- When a readable saved athlete exists, Continue Journey appears with the athlete's name, alongside the option to start a new athlete. ✅
- Starting a new athlete from this screen immediately replaces the existing save rather than asking for confirmation. ✅

## Status

- The Status panel summarizes athlete name, week, season, stars, world rank, rank tier, current location, actions remaining and ranking points. ✅
- The Condition card displays energy, morale, fatigue, swim, bike, run, stamina and focus as labeled values and colored bars. ✅
- Bar colors indicate good, warning or poor values; fatigue is inverted because less fatigue is better. ✅
- End Week advances the calendar, restores actions and applies weekly recovery, sponsorship and possible events. ✅
- Ending a week with unused actions first asks for confirmation. ✅
- A "Next Week Preview" card on the Status panel would show the next relevant race, its entry requirements, and a one-line readiness hint (e.g. "Fatigue high - consider resting") so players can plan their remaining actions. ✅

## Training

- The Training panel lists the six sessions as buttons with short summaries of their mini-games and intended benefits. ✅
- After each workout, the result and that session's personal-best mini-game score are shown; the Career summary lists all session bests. ✅
- Choosing a session opens a modal showing its title, mini-game type, instructions, game area, start button and cancel button. ✅
- The modal presents the interactive Rhythm Gauge, Pattern Recall or Sprint Tap game and can also be dismissed with Escape. ✅
- The Gear Upgrades card shows swim gear, bike setup and run kit, their levels, a displayed pace value and upgrade buttons with prices. ✅
- Gear upgrade buttons are disabled when unaffordable or when the category has reached its maximum level. ✅
- The displayed pace value is seven times the gear level; race simulation instead adds three power per gear level to the corresponding leg. ✅
- Each session button on the Training panel would show a small "Personal best" badge with the player's best score (or "New!" if never played) and the energy change, so players can choose a workout without opening the modal. ✅

## Travel

- The Travel panel has a destination selector, Travel button and stylized world map for choosing and previewing journeys. ✅
- The Upcoming Races card lists the current calendar and explains why an event cannot currently be entered on its disabled button. ✅
- Race cards preview the venue's course profile and conditions, identify the event tier, and show morale's current bounded power modifier per race leg. ✅
- An eligible event offers Race Now, which immediately runs the simulation rather than opening a separate race screen. ✅
- If the race calendar is empty, the panel displays a message suggesting ending the week to refresh it. ✅
- Each destination in the Travel selector would show its travel cost and a "Visited" tick or "New!" tag, so players can compare journeys without selecting each one. ✅

## Career

- The Career card displays races entered, wins, podiums, calculated win rate, best world rank, best finish and the next milestone. ✅
- The Journey Log displays recent week-numbered events in a scrollable list, newest first. ✅
- The Journey Log includes each race's swim, bike, run and transition splits. ✅
- Star Transactions lists each currency earning and expense with its source and resulting balance, newest first. ✅
- Start New Athlete asks for confirmation, clears the local save and returns to the start screen. ✅
- The Career card would show a "Career Highlights" row with the player's current win streak and longest podium streak, so recent form is visible at a glance. ✅
