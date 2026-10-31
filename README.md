# New Star Triathlete

New Star Triathlete is a mobile-first web game inspired by the training + race progression loop of classic New Star-style sports games.

You create an athlete, train swim/bike/run skills, spend **stars** on travel and upgrades, and race across the world to climb the global rankings.

## How to run

This is a static web app. You can run it with any local web server.

### Option 1: Python

```bash
python -m http.server 8080
```

Then open:

http://localhost:8080

### Option 2: Open directly

You can also open `index.html` in a browser, but using a local server is recommended.

## Gameplay loop

- Enter your character name to begin (no login required)
- Use weekly actions to:
  - Train disciplines and improve stats
  - Travel to race cities
  - Enter races for stars and ranking points
- Spend stars on:
  - Travel between global race venues
  - Gear upgrades for swim/bike/run
- End the week to recover, receive sponsor payout, and refresh race calendars
- Reach milestones and earn bonus star rewards

## Persistence

Progress is saved in browser `localStorage`.  
Use **Start New Athlete** in-app to clear the current save and begin again.
