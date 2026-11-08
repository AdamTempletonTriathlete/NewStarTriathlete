# Racing

This file describes race travel, the map, the race calendar, simulation and ranking progression.

## Cities and travel

- The game has 11 fixed race cities: London, Barcelona, Nice, Boulder, Rio de Janeiro, Cape Town, Dubai, Singapore, Tokyo, Sydney and Kona. ✅
- The athlete starts in London and must be in a race's city before entering it. ✅
- A destination can be chosen from the city selector or by clicking its marker on the map; selecting a destination does not itself travel. ✅
- Travel to a different city costs one action and a star fare based on straight-line distance between the fixed map coordinates. ✅
- A successful trip reduces energy by 7, increases fatigue by 6, increases morale by 2 and adds the destination to the saved unlocked-city list. ✅
- Attempting to travel to the current city does nothing; an unaffordable trip returns the action and reports the problem. ✅
- All cities can be selected and travelled to from the start if the athlete has sufficient stars and an action; the unlocked-city list does not gate travel. ✅

## Map

- The map is a stylized, fixed-coordinate world view drawn in the page, not a geographical map service. ✅
- Six CSS-shaped land masses sit behind city buttons, and the city positions are hard-coded. ✅
- City markers show three-letter abbreviations and expose the full city name as a title and accessible label. ✅
- The current city is highlighted, the selected city has a selection outline, and unvisited cities are visually dimmed as locked. ✅
- A dashed straight SVG line previews the route between the current city and a different selected city; it is not an animated journey. ✅
- Map selection and the destination dropdown update each other, and the dropdown shows the calculated star fare. ✅

## Race calendar and entry

- There are 17 predefined race templates across Rookie, Challenger, Pro, Elite and World event tiers. ✅
- Formats are Sprint, Olympic, Half and Full; each defines base swim, bike, run and transition times plus energy and fatigue costs. ✅
- The calendar normally contains five distinct race instances and is generated at the start of a career, when a week ends, or when the last available race is completed. ✅
- Calendar generation first chooses a random local event with a minimum requirement no more than 900 ranking points above the athlete, when one exists. ✅
- It then fills up to four slots from events within 900 points of the athlete's ranking points, without repeating a template. ✅
- If available, an event requiring more than 900 and up to 1,700 additional points has a 65% chance of being added; remaining slots are filled from unused templates. ✅
- Calendar listings may therefore include races the athlete cannot yet enter, including high-requirement filler events. ✅
- Each race card shows its name, tier, format, city, difficulty, entry fee, maximum listed prize, target ranking points and minimum ranking-point requirement. ✅
- Entry requires enough ranking points, being in the race city, enough stars for the fee and at least one action; the card displays the first unmet requirement in that order. ✅
- Entering a race spends one action and the entry fee, simulates the result immediately and removes that race instance from the calendar. ✅
- Failed eligibility checks return the action; there is no separate minimum energy requirement for entry. ✅

## Race events

- Rookie events are Thames Sprint in London (0 points required), Barcelona Bay Sprint (60) and Cape Coast Sprint in Cape Town (90). ✅
- Challenger events are Boulder Lake Olympic (180), Rio Coastal Olympic (320), Nice Open Olympic (420) and Dubai Desert Olympic (520). ✅
- Pro events are Tokyo Bay Pro (900), Sydney Harbour Pro (980), Kona Half Classic (1,120) and Singapore Night Half (1,250). ✅
- Elite events are European Elite Half in Barcelona (1,650), Pacific Elite Half in Sydney (1,850) and London World Series (2,000). ✅
- World events are Tokyo World Cup Final (2,600), Kona Championship (3,200) and Global Grand Final in Nice (3,800). ✅
- Race template difficulty ranges from 44 to 94, entry fees from 20 to 280 stars, listed prizes from 120 to 1,250 stars and fields from 28 to 62 athletes. ✅

## Simulation and rewards

- Each discipline's simulated power combines its attribute, stamina, focus, corresponding gear level, energy, fatigue and a random variation. ✅
- Gear contributes three power per level to its discipline; higher energy helps and higher fatigue hurts, while morale has no direct effect. ✅
- Each leg's time is based on the format's base time and the difference between race difficulty plus 8 and the athlete's leg power, with a bounded time multiplier. ✅
- The fixed transition time is added to the three leg times; the game does not offer player-controlled transitions. ✅
- The game generates the other competitors' times from the format, difficulty, event tier and random variation; placement is one plus the number of opponents with a faster time. ✅
- Each race has a target ranking-point value and a listed prize; the athlete receives a placement-based fraction, with race difficulty increasing the ranking-point award. ✅
- Placement multipliers are 1 for first, 0.78 for second, 0.62 for third, 0.46 for fourth or fifth, 0.30 for sixth through tenth, 0.16 through the top 60% and 0.08 otherwise. ✅
- Every finish earns at least 8 ranking points; the star reward is rounded and first place adds 20 stars. ✅
- Race energy cost and fatigue gain increase with the format's base costs and race difficulty; they are applied after the simulation. ✅
- Race morale changes by +8 for a win, +6 for second, +4 for third, +2 for fourth through tenth, 0 through the top 60% and -3 otherwise. ✅
- The result is recorded in the journey log with placement, field size, total time and rewards, while a toast announces the placement. ✅
- Race completion updates races entered, wins, podiums and best finish; rank recalculation updates the best world rank. ✅

## World ranking and progression

- World rank is calculated as 6800 minus 1.04 times the sum of ranking points, 110 per win, 45 per podium and a rounded average-attribute consistency bonus of 6 per point above 50. ✅
- The result is rounded and clamped from rank 1 to 7000; wins also count as podiums, so both bonuses apply. ✅
- Rank tiers are Club Level above 3000, Rising Contender at 3000 or better, National Star at 1200, Continental Pro at 400, World Elite at 100 and Global Icon at 25. ✅
- Race qualification uses ranking points rather than world rank or the displayed rank tier. ✅
- Ranking points earned from races and training unlock higher-requirement races and automatically trigger one-time milestone rewards. ✅
- Training and attribute improvements can also improve world rank without racing; race wins and podiums add further ranking bonuses. ✅
- Proposed feature: Record swim, bike, run and transition split times for each race in the journey log so athletes can track discipline-specific performance trends.
