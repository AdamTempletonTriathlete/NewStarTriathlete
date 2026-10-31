(function () {
  "use strict";

  const STORAGE_KEY = "new-star-triathlete-save-v1";
  const SAVE_VERSION = 1;
  const ACTIONS_PER_WEEK = 3;
  const MAX_GEAR_LEVEL = 6;
  const MAX_LOG_ENTRIES = 80;
  const MIN_STAT = 35;
  const MAX_STAT = 100;

  const CITIES = [
    { id: "london", name: "London", x: 2.4, y: 8.5 },
    { id: "barcelona", name: "Barcelona", x: 2.9, y: 7.7 },
    { id: "nice", name: "Nice", x: 3.1, y: 7.9 },
    { id: "boulder", name: "Boulder", x: 0.9, y: 7.2 },
    { id: "rio", name: "Rio de Janeiro", x: 1.5, y: 4.0 },
    { id: "cape-town", name: "Cape Town", x: 3.4, y: 2.3 },
    { id: "dubai", name: "Dubai", x: 5.5, y: 7.1 },
    { id: "singapore", name: "Singapore", x: 7.1, y: 5.2 },
    { id: "tokyo", name: "Tokyo", x: 8.5, y: 7.7 },
    { id: "sydney", name: "Sydney", x: 9.2, y: 2.8 },
    { id: "kona", name: "Kona", x: 5.0, y: 5.1 },
  ];

  const RACE_FORMATS = {
    sprint: {
      label: "Sprint",
      base: { swim: 17, bike: 43, run: 28, transition: 4 },
      energyCost: 20,
      fatigueGain: 18,
    },
    olympic: {
      label: "Olympic",
      base: { swim: 32, bike: 89, run: 56, transition: 5 },
      energyCost: 28,
      fatigueGain: 26,
    },
    half: {
      label: "Half",
      base: { swim: 41, bike: 178, run: 116, transition: 7 },
      energyCost: 40,
      fatigueGain: 35,
    },
    full: {
      label: "Full",
      base: { swim: 85, bike: 353, run: 248, transition: 10 },
      energyCost: 58,
      fatigueGain: 52,
    },
  };

  const TRAINING_OPTIONS = [
    {
      id: "swim-session",
      label: "Swim Intervals",
      summary: "Mini-game: Rhythm | +Swim +Stamina",
      miniGame: "rhythm",
      stats: { swim: [2, 4], stamina: [1, 2] },
      energy: -12,
      fatigue: 8,
      morale: 1,
      log: "Pool session sharpened your swim form.",
    },
    {
      id: "bike-session",
      label: "Bike Endurance",
      summary: "Mini-game: Sprint Tap | +Bike +Stamina",
      miniGame: "sprint",
      stats: { bike: [2, 4], stamina: [1, 2] },
      energy: -13,
      fatigue: 9,
      morale: 1,
      log: "Long ride boosted bike power.",
    },
    {
      id: "run-session",
      label: "Tempo Run",
      summary: "Mini-game: Pattern Recall | +Run +Focus",
      miniGame: "memory",
      stats: { run: [2, 4], focus: [1, 2] },
      energy: -11,
      fatigue: 8,
      morale: 1,
      log: "Tempo work tightened run pacing.",
    },
    {
      id: "brick-session",
      label: "Brick Workout",
      summary: "Mini-game: Rhythm | +Bike +Run +Focus",
      miniGame: "rhythm",
      stats: { bike: [1, 3], run: [1, 3], focus: [1, 2] },
      energy: -18,
      fatigue: 13,
      morale: 2,
      log: "Brick training improved bike-to-run transition speed.",
    },
    {
      id: "strength-session",
      label: "Strength & Core",
      summary: "Mini-game: Pattern Recall | +Stamina +Focus",
      miniGame: "memory",
      stats: { stamina: [2, 4], focus: [1, 2] },
      energy: -10,
      fatigue: 6,
      morale: 1,
      log: "Strength work made you more durable late in races.",
    },
    {
      id: "recovery-session",
      label: "Recovery Day",
      summary: "Mini-game: Sprint Tap | Recovery boost",
      miniGame: "sprint",
      stats: { focus: [0, 1] },
      energy: 24,
      fatigue: -20,
      morale: 4,
      log: "Recovery day reset your body for the next push.",
    },
  ];

  const MINI_GAME_MODES = {
    rhythm: {
      label: "Rhythm Gauge",
      instructions:
        "Press Hit Zone when the white marker is inside green. Keep your timing sharp for stronger gains.",
    },
    memory: {
      label: "Pattern Recall",
      instructions:
        "Watch the symbol sequence, then tap the same pattern. More correct inputs means better training output.",
    },
    sprint: {
      label: "Sprint Tap",
      instructions:
        "Hit as many moving targets as you can before time expires. Faster taps improve rewards.",
    },
  };

  const MILESTONES = [
    { id: "breakthrough", points: 250, stars: 70, label: "Breakthrough Athlete" },
    { id: "contender", points: 700, stars: 120, label: "Continental Contender" },
    { id: "pro-circuit", points: 1400, stars: 180, label: "Pro Circuit Arrival" },
    { id: "elite-break", points: 2400, stars: 260, label: "Elite Breakthrough" },
    { id: "world-stage", points: 3600, stars: 360, label: "World Stage Threat" },
  ];

  const WEEKLY_EVENTS = [
    {
      message: "A sponsor media day paid well, but drained your patience.",
      stars: 40,
      morale: -4,
    },
    {
      message: "A sports scientist optimized your pacing strategy.",
      stats: { focus: [1, 2] },
      morale: 2,
    },
    {
      message: "Unexpected weather cut one session short.",
      energy: -5,
      stats: { stamina: [1, 1] },
    },
    {
      message: "You inspired a local club and gained confidence.",
      morale: 4,
      stars: 15,
    },
    {
      message: "Altitude camp sharpened your engine.",
      stats: { stamina: [1, 3] },
      fatigue: 2,
    },
  ];

  const RACE_TEMPLATES = [
    {
      id: "thames-sprint",
      name: "Thames Sprint",
      location: "london",
      format: "sprint",
      tier: "Rookie",
      minPoints: 0,
      difficulty: 44,
      entry: 20,
      prize: 120,
      points: 90,
      fieldSize: 28,
    },
    {
      id: "barcelona-bay-sprint",
      name: "Barcelona Bay Sprint",
      location: "barcelona",
      format: "sprint",
      tier: "Rookie",
      minPoints: 60,
      difficulty: 47,
      entry: 24,
      prize: 136,
      points: 98,
      fieldSize: 30,
    },
    {
      id: "cape-town-coast-sprint",
      name: "Cape Coast Sprint",
      location: "cape-town",
      format: "sprint",
      tier: "Rookie",
      minPoints: 90,
      difficulty: 49,
      entry: 28,
      prize: 148,
      points: 108,
      fieldSize: 32,
    },
    {
      id: "boulder-lake-olympic",
      name: "Boulder Lake Olympic",
      location: "boulder",
      format: "olympic",
      tier: "Challenger",
      minPoints: 180,
      difficulty: 52,
      entry: 38,
      prize: 190,
      points: 134,
      fieldSize: 34,
    },
    {
      id: "rio-coastal-olympic",
      name: "Rio Coastal Olympic",
      location: "rio",
      format: "olympic",
      tier: "Challenger",
      minPoints: 320,
      difficulty: 57,
      entry: 48,
      prize: 230,
      points: 160,
      fieldSize: 36,
    },
    {
      id: "nice-open-olympic",
      name: "Nice Open Olympic",
      location: "nice",
      format: "olympic",
      tier: "Challenger",
      minPoints: 420,
      difficulty: 60,
      entry: 55,
      prize: 250,
      points: 175,
      fieldSize: 38,
    },
    {
      id: "dubai-desert-olympic",
      name: "Dubai Desert Olympic",
      location: "dubai",
      format: "olympic",
      tier: "Challenger",
      minPoints: 520,
      difficulty: 62,
      entry: 62,
      prize: 275,
      points: 186,
      fieldSize: 40,
    },
    {
      id: "tokyo-bay-pro",
      name: "Tokyo Bay Pro",
      location: "tokyo",
      format: "olympic",
      tier: "Pro",
      minPoints: 900,
      difficulty: 67,
      entry: 88,
      prize: 355,
      points: 228,
      fieldSize: 42,
    },
    {
      id: "sydney-harbour-pro",
      name: "Sydney Harbour Pro",
      location: "sydney",
      format: "olympic",
      tier: "Pro",
      minPoints: 980,
      difficulty: 69,
      entry: 92,
      prize: 370,
      points: 236,
      fieldSize: 44,
    },
    {
      id: "kona-half-classic",
      name: "Kona Half Classic",
      location: "kona",
      format: "half",
      tier: "Pro",
      minPoints: 1120,
      difficulty: 72,
      entry: 110,
      prize: 440,
      points: 275,
      fieldSize: 46,
    },
    {
      id: "singapore-night-half",
      name: "Singapore Night Half",
      location: "singapore",
      format: "half",
      tier: "Pro",
      minPoints: 1250,
      difficulty: 74,
      entry: 118,
      prize: 470,
      points: 292,
      fieldSize: 46,
    },
    {
      id: "euro-elite-half",
      name: "European Elite Half",
      location: "barcelona",
      format: "half",
      tier: "Elite",
      minPoints: 1650,
      difficulty: 78,
      entry: 145,
      prize: 570,
      points: 350,
      fieldSize: 50,
    },
    {
      id: "pacific-elite-half",
      name: "Pacific Elite Half",
      location: "sydney",
      format: "half",
      tier: "Elite",
      minPoints: 1850,
      difficulty: 80,
      entry: 154,
      prize: 620,
      points: 376,
      fieldSize: 50,
    },
    {
      id: "london-world-series",
      name: "London World Series",
      location: "london",
      format: "olympic",
      tier: "Elite",
      minPoints: 2000,
      difficulty: 82,
      entry: 160,
      prize: 650,
      points: 388,
      fieldSize: 52,
    },
    {
      id: "tokyo-world-cup-final",
      name: "Tokyo World Cup Final",
      location: "tokyo",
      format: "half",
      tier: "World",
      minPoints: 2600,
      difficulty: 86,
      entry: 198,
      prize: 800,
      points: 470,
      fieldSize: 56,
    },
    {
      id: "kona-championship",
      name: "Kona Championship",
      location: "kona",
      format: "full",
      tier: "World",
      minPoints: 3200,
      difficulty: 90,
      entry: 240,
      prize: 980,
      points: 560,
      fieldSize: 60,
    },
    {
      id: "global-grand-final",
      name: "Global Grand Final",
      location: "nice",
      format: "full",
      tier: "World",
      minPoints: 3800,
      difficulty: 94,
      entry: 280,
      prize: 1250,
      points: 690,
      fieldSize: 62,
    },
  ];

  const TIER_SKILL_SHIFT = {
    Rookie: -2,
    Challenger: 2,
    Pro: 6,
    Elite: 10,
    World: 14,
  };

  const elements = {};
  let state = null;
  let savedStateCandidate = null;
  let toastTimerId = null;
  let miniGameState = null;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    bindEvents();

    savedStateCandidate = loadSave();
    if (savedStateCandidate) {
      showStartScreen(true);
      elements.continueText.textContent = `Saved athlete: ${savedStateCandidate.playerName}`;
    } else {
      showStartScreen(false);
    }
  }

  function cacheElements() {
    elements.startScreen = document.getElementById("start-screen");
    elements.continuePanel = document.getElementById("continue-panel");
    elements.continueText = document.getElementById("continue-text");
    elements.continueBtn = document.getElementById("continue-btn");
    elements.nameInput = document.getElementById("name-input");
    elements.startBtn = document.getElementById("start-btn");
    elements.startHint = document.getElementById("start-hint");

    elements.app = document.getElementById("app");
    elements.athleteName = document.getElementById("athlete-name");
    elements.weekLabel = document.getElementById("week-label");
    elements.starsValue = document.getElementById("stars-value");
    elements.rankValue = document.getElementById("rank-value");
    elements.rankTier = document.getElementById("rank-tier");
    elements.locationValue = document.getElementById("location-value");
    elements.actionsValue = document.getElementById("actions-value");
    elements.rankingPointsValue = document.getElementById("ranking-points-value");

    elements.conditionBars = document.getElementById("condition-bars");
    elements.trainingActions = document.getElementById("training-actions");
    elements.travelSelect = document.getElementById("travel-select");
    elements.travelBtn = document.getElementById("travel-btn");
    elements.travelMap = document.getElementById("travel-map");
    elements.racesList = document.getElementById("races-list");
    elements.upgradesList = document.getElementById("upgrades-list");
    elements.careerSummary = document.getElementById("career-summary");
    elements.logList = document.getElementById("log-list");
    elements.endWeekBtn = document.getElementById("end-week-btn");
    elements.newAthleteBtn = document.getElementById("new-athlete-btn");
    elements.toast = document.getElementById("toast");
    elements.miniGameModal = document.getElementById("minigame-modal");
    elements.miniGameTitle = document.getElementById("minigame-title");
    elements.miniGameType = document.getElementById("minigame-type");
    elements.miniGameInstructions = document.getElementById("minigame-instructions");
    elements.miniGameStage = document.getElementById("minigame-stage");
    elements.miniGameFeedback = document.getElementById("minigame-feedback");
    elements.miniGameStartBtn = document.getElementById("minigame-start-btn");
    elements.miniGameCancelBtn = document.getElementById("minigame-cancel-btn");
  }

  function bindEvents() {
    elements.startBtn.addEventListener("click", handleStartNewAthlete);
    elements.continueBtn.addEventListener("click", handleContinueJourney);
    elements.nameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleStartNewAthlete();
      }
    });

    elements.trainingActions.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-training-id]");
      if (!button) {
        return;
      }
      startTrainingSession(button.dataset.trainingId);
    });

    elements.travelBtn.addEventListener("click", travelToSelectedCity);
    elements.travelSelect.addEventListener("change", renderTravelMap);
    elements.travelMap.addEventListener("click", handleMapCitySelection);

    elements.racesList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-race-id]");
      if (!button) {
        return;
      }
      enterRace(button.dataset.raceId);
    });

    elements.upgradesList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-upgrade-type]");
      if (!button) {
        return;
      }
      upgradeGear(button.dataset.upgradeType);
    });

    elements.endWeekBtn.addEventListener("click", endWeek);
    elements.newAthleteBtn.addEventListener("click", confirmResetAthlete);
    elements.miniGameStartBtn.addEventListener("click", startMiniGameRun);
    elements.miniGameCancelBtn.addEventListener("click", closeMiniGameModal);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && miniGameState) {
        closeMiniGameModal();
      }
    });
  }

  function showStartScreen(hasSave) {
    elements.startScreen.classList.remove("hidden");
    elements.app.classList.add("hidden");
    elements.continuePanel.classList.toggle("hidden", !hasSave);
    elements.startHint.textContent = "";
  }

  function showGameScreen() {
    elements.startScreen.classList.add("hidden");
    elements.app.classList.remove("hidden");
  }

  function handleStartNewAthlete() {
    const rawName = elements.nameInput.value.trim();
    if (!rawName) {
      elements.startHint.textContent = "Please enter an athlete name to begin.";
      return;
    }

    const athleteName = rawName.slice(0, 24);
    state = createNewState(athleteName);
    state.upcomingRaces = generateUpcomingRaces(state);
    addLog(`Welcome ${athleteName}. Your triathlon journey has started.`);
    saveState();
    showGameScreen();
    render();
    showToast("Journey started.");
  }

  function handleContinueJourney() {
    if (!savedStateCandidate) {
      return;
    }
    state = hydrateState(savedStateCandidate);
    if (!state.upcomingRaces.length) {
      state.upcomingRaces = generateUpcomingRaces(state);
    }
    showGameScreen();
    render();
    showToast("Loaded saved journey.");
  }

  function createNewState(playerName) {
    return {
      version: SAVE_VERSION,
      playerName,
      week: 1,
      season: 1,
      actionsRemaining: ACTIONS_PER_WEEK,
      location: "london",
      stars: 140,
      rankingPoints: 0,
      worldRank: 7000,
      rankTier: "Club Level",
      energy: 84,
      fatigue: 12,
      morale: 72,
      stats: {
        swim: 52,
        bike: 52,
        run: 52,
        stamina: 50,
        focus: 50,
      },
      gear: {
        swim: 1,
        bike: 1,
        run: 1,
      },
      career: {
        racesEntered: 0,
        racesWon: 0,
        podiums: 0,
        bestRank: 7000,
        bestFinish: null,
      },
      milestonesClaimed: [],
      unlockedCities: ["london", "barcelona"],
      upcomingRaces: [],
      eventHistory: [],
    };
  }

  function hydrateState(rawState) {
    const base = createNewState(
      typeof rawState.playerName === "string" ? rawState.playerName : "Athlete"
    );
    const hydrated = {
      ...base,
      ...rawState,
      stats: { ...base.stats, ...rawState.stats },
      gear: { ...base.gear, ...rawState.gear },
      career: { ...base.career, ...rawState.career },
      milestonesClaimed: Array.isArray(rawState.milestonesClaimed) ? rawState.milestonesClaimed : [],
      unlockedCities: Array.isArray(rawState.unlockedCities) ? rawState.unlockedCities : ["london"],
      upcomingRaces: Array.isArray(rawState.upcomingRaces)
        ? rawState.upcomingRaces.filter(isValidRaceInstance)
        : [],
      eventHistory: Array.isArray(rawState.eventHistory) ? rawState.eventHistory : [],
    };
    normalizeState(hydrated);
    return hydrated;
  }

  function normalizeState(targetState) {
    targetState.version = SAVE_VERSION;
    targetState.week = positiveInt(targetState.week, 1);
    targetState.season = positiveInt(targetState.season, Math.floor((targetState.week - 1) / 12) + 1);
    targetState.actionsRemaining = clamp(
      Math.round(numberOr(targetState.actionsRemaining, ACTIONS_PER_WEEK)),
      0,
      ACTIONS_PER_WEEK
    );
    targetState.stars = Math.max(0, Math.round(numberOr(targetState.stars, 0)));
    targetState.rankingPoints = Math.max(0, Math.round(numberOr(targetState.rankingPoints, 0)));
    targetState.energy = clamp(numberOr(targetState.energy, 70), 0, 100);
    targetState.fatigue = clamp(numberOr(targetState.fatigue, 10), 0, 100);
    targetState.morale = clamp(numberOr(targetState.morale, 70), 0, 100);

    for (const key of Object.keys(targetState.stats)) {
      targetState.stats[key] = clamp(numberOr(targetState.stats[key], 50), MIN_STAT, MAX_STAT);
    }

    for (const key of Object.keys(targetState.gear)) {
      targetState.gear[key] = clamp(positiveInt(targetState.gear[key], 1), 1, MAX_GEAR_LEVEL);
    }
  }

  function render() {
    if (!state) {
      return;
    }

    normalizeState(state);
    recalculateRank(state);
    const milestoneAwarded = checkMilestones(state);
    if (milestoneAwarded) {
      normalizeState(state);
      recalculateRank(state);
    }

    elements.athleteName.textContent = state.playerName;
    elements.weekLabel.textContent = `Week ${state.week} | Season ${state.season}`;
    elements.starsValue.textContent = `${state.stars}`;
    elements.rankValue.textContent = `#${state.worldRank}`;
    elements.rankTier.textContent = state.rankTier;
    elements.locationValue.textContent = getCityName(state.location);
    elements.actionsValue.textContent = `${state.actionsRemaining}/${ACTIONS_PER_WEEK}`;
    elements.rankingPointsValue.textContent = `${state.rankingPoints}`;

    renderConditionBars();
    renderTrainingActions();
    renderTravelOptions();
    renderTravelMap();
    renderRaces();
    renderUpgrades();
    renderCareerSummary();
    renderLog();
    saveState();
  }

  function renderConditionBars() {
    const metrics = [
      { label: "Energy", value: state.energy, invert: false },
      { label: "Morale", value: state.morale, invert: false },
      { label: "Fatigue", value: state.fatigue, invert: true },
      { label: "Swim", value: state.stats.swim, invert: false },
      { label: "Bike", value: state.stats.bike, invert: false },
      { label: "Run", value: state.stats.run, invert: false },
      { label: "Stamina", value: state.stats.stamina, invert: false },
      { label: "Focus", value: state.stats.focus, invert: false },
    ];

    elements.conditionBars.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (const metric of metrics) {
      const item = document.createElement("div");
      item.className = "bar-item";

      const row = document.createElement("div");
      row.className = "bar-row";
      const label = document.createElement("span");
      label.textContent = metric.label;
      const value = document.createElement("span");
      value.textContent = `${Math.round(metric.value)}`;
      row.append(label, value);

      const track = document.createElement("div");
      track.className = "bar-track";
      const fill = document.createElement("div");
      fill.className = `bar-fill ${barClass(metric.value, metric.invert)}`;
      const widthPercent = metric.invert ? 100 - metric.value : metric.value;
      fill.style.width = `${clamp(widthPercent, 0, 100)}%`;
      track.appendChild(fill);

      item.append(row, track);
      fragment.appendChild(item);
    }

    elements.conditionBars.appendChild(fragment);
  }

  function renderTrainingActions() {
    elements.trainingActions.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (const training of TRAINING_OPTIONS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "action-btn";
      button.dataset.trainingId = training.id;
      button.disabled = state.actionsRemaining < 1;

      const title = document.createElement("strong");
      title.textContent = training.label;
      const summary = document.createElement("span");
      summary.textContent = training.summary;
      button.append(title, summary);
      fragment.appendChild(button);
    }
    elements.trainingActions.appendChild(fragment);
  }

  function renderTravelOptions() {
    const previousValue = elements.travelSelect.value;
    elements.travelSelect.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (const city of CITIES) {
      const option = document.createElement("option");
      option.value = city.id;

      if (city.id === state.location) {
        option.textContent = `${city.name} (current city)`;
      } else {
        const cost = calculateTravelCost(state.location, city.id);
        option.textContent = `${city.name} (${cost} stars)`;
      }
      fragment.appendChild(option);
    }

    elements.travelSelect.appendChild(fragment);

    if (previousValue && CITIES.some((city) => city.id === previousValue)) {
      elements.travelSelect.value = previousValue;
    }
  }

  function renderTravelMap() {
    const selectedCityId = elements.travelSelect.value || state.location;
    const currentCity = getCity(state.location);
    const selectedCity = getCity(selectedCityId);

    elements.travelMap.innerHTML = "";

    const landConfigs = [
      "map-land map-land-1",
      "map-land map-land-2",
      "map-land map-land-3",
      "map-land map-land-4",
      "map-land map-land-5",
      "map-land map-land-6",
    ];
    for (const classes of landConfigs) {
      const land = document.createElement("div");
      land.className = classes;
      elements.travelMap.appendChild(land);
    }

    const routeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    routeSvg.setAttribute("viewBox", "0 0 1000 560");
    if (currentCity && selectedCity && currentCity.id !== selectedCity.id) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", `${currentCity.x * 100}`);
      line.setAttribute("y1", `${(10 - currentCity.y) * 56}`);
      line.setAttribute("x2", `${selectedCity.x * 100}`);
      line.setAttribute("y2", `${(10 - selectedCity.y) * 56}`);
      line.setAttribute("stroke", "rgba(255, 204, 102, 0.9)");
      line.setAttribute("stroke-width", "4");
      line.setAttribute("stroke-dasharray", "10 8");
      routeSvg.appendChild(line);
    }
    elements.travelMap.appendChild(routeSvg);

    for (const city of CITIES) {
      const marker = document.createElement("button");
      marker.type = "button";
      marker.className = "map-city";
      marker.dataset.cityId = city.id;
      marker.style.left = `${city.x * 10}%`;
      marker.style.top = `${(10 - city.y) * 10}%`;
      marker.textContent = city.name.slice(0, 3).toUpperCase();
      marker.title = city.name;
      marker.setAttribute("aria-label", city.name);

      if (city.id === state.location) {
        marker.classList.add("map-city-current");
      }
      if (city.id === selectedCityId) {
        marker.classList.add("map-city-selected");
      }
      if (!state.unlockedCities.includes(city.id) && city.id !== state.location) {
        marker.classList.add("map-city-locked");
      }
      elements.travelMap.appendChild(marker);
    }
  }

  function handleMapCitySelection(event) {
    const marker = event.target.closest("button[data-city-id]");
    if (!marker) {
      return;
    }
    elements.travelSelect.value = marker.dataset.cityId;
    renderTravelMap();
  }

  function renderRaces() {
    elements.racesList.innerHTML = "";
    if (!state.upcomingRaces.length) {
      const placeholder = document.createElement("p");
      placeholder.className = "muted";
      placeholder.textContent = "No races available yet. End week to refresh the calendar.";
      elements.racesList.appendChild(placeholder);
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const race of state.upcomingRaces) {
      const wrapper = document.createElement("article");
      wrapper.className = "race-item";

      const top = document.createElement("div");
      top.className = "race-top";
      const name = document.createElement("strong");
      name.textContent = race.name;
      const tier = document.createElement("span");
      tier.className = "race-tier";
      tier.textContent = race.tier;
      top.append(name, tier);

      const meta = document.createElement("div");
      meta.className = "race-meta";
      meta.innerHTML = [
        `${RACE_FORMATS[race.format].label} | ${getCityName(race.location)} | Difficulty ${race.difficulty}`,
        `Entry ${race.entry} stars | Prize up to ${race.prize} stars`,
        `Ranking points target: ${race.points} | Requires ${race.minPoints} RP`,
      ]
        .map((line) => `<div>${line}</div>`)
        .join("");

      const enterButton = document.createElement("button");
      enterButton.className = "btn btn-secondary btn-wide";
      enterButton.type = "button";
      enterButton.dataset.raceId = race.instanceId;

      const needsRank = state.rankingPoints < race.minPoints;
      const needsTravel = state.location !== race.location;
      const needsStars = state.stars < race.entry;
      const noActions = state.actionsRemaining < 1;

      if (needsRank) {
        enterButton.disabled = true;
        enterButton.textContent = `Need ${race.minPoints - state.rankingPoints} more RP`;
      } else if (needsTravel) {
        enterButton.disabled = true;
        const travelCost = calculateTravelCost(state.location, race.location);
        enterButton.textContent = `Travel to ${getCityName(race.location)} (${travelCost} stars)`;
      } else if (needsStars) {
        enterButton.disabled = true;
        enterButton.textContent = `Need ${race.entry - state.stars} more stars`;
      } else if (noActions) {
        enterButton.disabled = true;
        enterButton.textContent = "No actions left this week";
      } else {
        enterButton.disabled = false;
        enterButton.textContent = "Race Now";
      }

      wrapper.append(top, meta, enterButton);
      fragment.appendChild(wrapper);
    }
    elements.racesList.appendChild(fragment);
  }

  function renderUpgrades() {
    const upgradeTypes = [
      { id: "swim", label: "Swim Gear" },
      { id: "bike", label: "Bike Setup" },
      { id: "run", label: "Run Kit" },
    ];

    elements.upgradesList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (const upgrade of upgradeTypes) {
      const level = state.gear[upgrade.id];
      const wrapper = document.createElement("article");
      wrapper.className = "upgrade-item";

      const title = document.createElement("div");
      title.className = "race-top";
      const name = document.createElement("strong");
      name.textContent = `${upgrade.label} (Lv ${level})`;
      const impact = document.createElement("span");
      impact.className = "race-tier";
      impact.textContent = `+${level * 7} pace`;
      title.append(name, impact);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-secondary btn-wide";
      button.dataset.upgradeType = upgrade.id;

      if (level >= MAX_GEAR_LEVEL) {
        button.disabled = true;
        button.textContent = "Max level reached";
      } else {
        const cost = gearUpgradeCost(level);
        button.disabled = state.stars < cost;
        button.textContent = `Upgrade for ${cost} stars`;
      }

      wrapper.append(title, button);
      fragment.appendChild(wrapper);
    }
    elements.upgradesList.appendChild(fragment);
  }

  function renderCareerSummary() {
    const entered = state.career.racesEntered;
    const wins = state.career.racesWon;
    const podiums = state.career.podiums;
    const winRate = entered > 0 ? Math.round((wins / entered) * 100) : 0;
    const nextMilestone = MILESTONES.find(
      (milestone) => !state.milestonesClaimed.includes(milestone.id)
    );

    elements.careerSummary.innerHTML = "";

    const items = [
      `Races Entered: <strong>${entered}</strong>`,
      `Wins: <strong>${wins}</strong>`,
      `Podiums: <strong>${podiums}</strong>`,
      `Win Rate: <strong>${winRate}%</strong>`,
      `Best World Rank: <strong>#${state.career.bestRank}</strong>`,
      `Best Finish: <strong>${state.career.bestFinish ? ordinal(state.career.bestFinish) : "-"}</strong>`,
      nextMilestone
        ? `Next Milestone: <strong>${nextMilestone.label}</strong> (${state.rankingPoints}/${nextMilestone.points} RP)`
        : "Next Milestone: <strong>All milestone rewards claimed</strong>",
    ];

    for (const item of items) {
      const row = document.createElement("div");
      row.innerHTML = item;
      elements.careerSummary.appendChild(row);
    }
  }

  function renderLog() {
    elements.logList.innerHTML = "";
    const entries = state.eventHistory.slice(0, MAX_LOG_ENTRIES);
    const fragment = document.createDocumentFragment();
    for (const entry of entries) {
      const li = document.createElement("li");
      li.textContent = `Week ${entry.week}: ${entry.message}`;
      fragment.appendChild(li);
    }
    elements.logList.appendChild(fragment);
  }

  function startTrainingSession(trainingId) {
    const training = TRAINING_OPTIONS.find((item) => item.id === trainingId);
    if (!training) {
      return;
    }
    if (state.actionsRemaining <= 0) {
      showToast("No actions left. End week to continue.");
      return;
    }

    openMiniGameModal(training);
  }

  function openMiniGameModal(training) {
    cleanupMiniGameRuntime();
    const mode = MINI_GAME_MODES[training.miniGame] || MINI_GAME_MODES.rhythm;

    miniGameState = {
      training,
      modeKey: training.miniGame in MINI_GAME_MODES ? training.miniGame : "rhythm",
      onCleanup: null,
    };

    elements.miniGameTitle.textContent = training.label;
    elements.miniGameType.textContent = mode.label;
    elements.miniGameInstructions.textContent = mode.instructions;
    elements.miniGameFeedback.textContent = "Complete the mini-game to lock in this training session.";
    elements.miniGameStartBtn.disabled = false;
    elements.miniGameStartBtn.textContent = "Start Mini-Game";
    elements.miniGameStage.innerHTML = '<div class="mini-center">Press Start when you are ready.</div>';
    elements.miniGameModal.classList.remove("hidden");
  }

  function closeMiniGameModal() {
    cleanupMiniGameRuntime();
    miniGameState = null;
    elements.miniGameModal.classList.add("hidden");
  }

  function cleanupMiniGameRuntime() {
    if (!miniGameState || typeof miniGameState.onCleanup !== "function") {
      return;
    }
    miniGameState.onCleanup();
    miniGameState.onCleanup = null;
  }

  function startMiniGameRun() {
    if (!miniGameState) {
      return;
    }

    elements.miniGameStartBtn.disabled = true;
    elements.miniGameFeedback.textContent = "";

    if (miniGameState.modeKey === "memory") {
      startMemoryMiniGame();
      return;
    }
    if (miniGameState.modeKey === "sprint") {
      startSprintMiniGame();
      return;
    }
    startRhythmMiniGame();
  }

  function startRhythmMiniGame() {
    const rounds = 8;
    let round = 1;
    let totalScore = 0;
    let targetCenter = randomBetween(30, 70);
    const targetWidth = 18;
    const startTime = performance.now();

    elements.miniGameStage.innerHTML = `
      <div class="mini-row">
        <span id="rhythm-round-label">Round 1/${rounds}</span>
        <span>Click in the green zone</span>
      </div>
      <div class="mini-meter">
        <div id="rhythm-target" class="mini-target-zone"></div>
        <div id="rhythm-cursor" class="mini-cursor"></div>
      </div>
      <button id="rhythm-hit-btn" type="button" class="btn btn-secondary btn-wide">Hit Zone</button>
    `;
    const roundLabel = document.getElementById("rhythm-round-label");
    const targetEl = document.getElementById("rhythm-target");
    const cursor = document.getElementById("rhythm-cursor");
    const hitBtn = document.getElementById("rhythm-hit-btn");

    const setTarget = () => {
      targetCenter = randomBetween(24, 76);
      const left = targetCenter - targetWidth / 2;
      targetEl.style.left = `${left}%`;
      targetEl.style.width = `${targetWidth}%`;
    };
    setTarget();

    const renderCursor = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const phase = ((Math.sin(elapsed * 3.6) + 1) / 2) * 100;
      cursor.style.left = `${phase}%`;
      return phase;
    };
    const rafId = requestAnimationFrame(function tick() {
      renderCursor();
      miniGameState.onCleanupRaf = requestAnimationFrame(tick);
    });
    miniGameState.onCleanupRaf = rafId;

    const handleHit = () => {
      const cursorPos = renderCursor();
      const distance = Math.abs(cursorPos - targetCenter);
      const isInside = distance <= targetWidth / 2;
      const hitScore = isInside ? Math.max(15, Math.round(100 - distance * 7.2)) : 0;
      totalScore += hitScore;
      round += 1;
      if (round > rounds) {
        const finalScore = Math.round(totalScore / rounds);
        finishTrainingMiniGame(finalScore, `Rhythm score ${finalScore}%`);
        return;
      }
      roundLabel.textContent = `Round ${round}/${rounds}`;
      setTarget();
    };

    hitBtn.addEventListener("click", handleHit);
    miniGameState.onCleanup = () => {
      cancelAnimationFrame(miniGameState.onCleanupRaf);
      hitBtn.removeEventListener("click", handleHit);
    };
  }

  function startMemoryMiniGame() {
    const symbols = ["▲", "◆", "●", "■"];
    const sequenceLength = 6;
    const sequence = Array.from({ length: sequenceLength }, () => randomItem(symbols));
    const input = [];
    let revealIndex = 0;
    let revealTimerId = null;

    elements.miniGameStage.innerHTML = `
      <div class="mini-row">
        <span id="memory-status">Watch the sequence</span>
        <span>Length ${sequenceLength}</span>
      </div>
      <div id="memory-preview" class="mini-center">...</div>
      <div id="memory-grid" class="mini-sequence-grid"></div>
    `;
    const preview = document.getElementById("memory-preview");
    const status = document.getElementById("memory-status");
    const grid = document.getElementById("memory-grid");

    for (const symbol of symbols) {
      const key = document.createElement("button");
      key.type = "button";
      key.className = "mini-sequence-key";
      key.dataset.symbol = symbol;
      key.textContent = symbol;
      key.disabled = true;
      grid.appendChild(key);
    }

    const keys = Array.from(grid.querySelectorAll("button"));
    const revealStep = () => {
      if (revealIndex >= sequence.length) {
        preview.textContent = "Repeat the pattern.";
        status.textContent = "Your turn";
        for (const key of keys) {
          key.disabled = false;
        }
        return;
      }
      const symbol = sequence[revealIndex];
      preview.textContent = symbol;
      for (const key of keys) {
        key.classList.toggle("active", key.dataset.symbol === symbol);
      }
      revealIndex += 1;
      revealTimerId = window.setTimeout(revealStep, 650);
    };
    revealStep();

    const handleInput = (event) => {
      const key = event.target.closest("button[data-symbol]");
      if (!key) {
        return;
      }
      const symbol = key.dataset.symbol;
      input.push(symbol);
      const index = input.length - 1;
      const expected = sequence[index];
      const isCorrect = symbol === expected;
      preview.textContent = `${input.join(" ")}`;

      if (!isCorrect) {
        const finalScore = Math.round((index / sequence.length) * 100);
        finishTrainingMiniGame(finalScore, "Pattern broken early.");
        return;
      }
      if (input.length === sequence.length) {
        finishTrainingMiniGame(100, "Perfect recall.");
      }
    };

    grid.addEventListener("click", handleInput);
    miniGameState.onCleanup = () => {
      if (revealTimerId) {
        clearTimeout(revealTimerId);
      }
      grid.removeEventListener("click", handleInput);
    };
  }

  function startSprintMiniGame() {
    let hits = 0;
    let targetExpiresId = null;
    const durationMs = 7500;
    const startedAt = Date.now();

    elements.miniGameStage.innerHTML = `
      <div class="mini-row">
        <span id="sprint-timer">Time 7.5s</span>
        <span id="sprint-hits">Hits 0</span>
      </div>
      <div id="sprint-field" class="mini-target-field"></div>
    `;
    const timerLabel = document.getElementById("sprint-timer");
    const hitsLabel = document.getElementById("sprint-hits");
    const field = document.getElementById("sprint-field");

    const placeTarget = () => {
      field.innerHTML = "";
      const target = document.createElement("button");
      target.type = "button";
      target.className = "mini-target";
      target.textContent = "Tap";
      target.style.left = `${randomInt(4, 80)}%`;
      target.style.top = `${randomInt(6, 70)}%`;
      field.appendChild(target);
      if (targetExpiresId) {
        clearTimeout(targetExpiresId);
      }
      targetExpiresId = window.setTimeout(placeTarget, 650);
    };

    const countdown = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, durationMs - elapsed);
      timerLabel.textContent = `Time ${(remaining / 1000).toFixed(1)}s`;
      if (remaining <= 0) {
        const score = clamp(Math.round((hits / 16) * 100), 0, 100);
        finishTrainingMiniGame(score, `Sprint taps: ${hits}`);
      }
    }, 100);

    const handleTap = (event) => {
      const target = event.target.closest("button.mini-target");
      if (!target) {
        return;
      }
      hits += 1;
      hitsLabel.textContent = `Hits ${hits}`;
      placeTarget();
    };

    field.addEventListener("click", handleTap);
    placeTarget();
    miniGameState.onCleanup = () => {
      clearInterval(countdown);
      if (targetExpiresId) {
        clearTimeout(targetExpiresId);
      }
      field.removeEventListener("click", handleTap);
    };
  }

  function finishTrainingMiniGame(score, contextMessage) {
    if (!miniGameState) {
      return;
    }
    const cappedScore = clamp(Math.round(score), 0, 100);
    const training = miniGameState.training;
    const outcome = applyTrainingFromMiniGame(training, cappedScore);
    addLog(
      `${training.log} Mini-game ${cappedScore}% (${contextMessage}) for +${outcome.rankingPoints} RP and +${outcome.stars} stars.`
    );
    elements.miniGameFeedback.textContent = `Session complete: ${cappedScore}% | +${outcome.rankingPoints} RP | +${outcome.stars} stars`;
    closeMiniGameModal();
    render();
    showToast(`${training.label}: ${cappedScore}% result.`);
  }

  function applyTrainingFromMiniGame(training, score) {
    if (!spendActionIfAvailable()) {
      return { rankingPoints: 0, stars: 0 };
    }

    const quality = clamp(score, 0, 100);
    const qualityShift = (quality - 50) / 50;
    const benefitMultiplier = clamp(1 + qualityShift * 0.55, 0.45, 1.55);
    const strainMultiplier = clamp(1 - qualityShift * 0.35, 0.65, 1.35);

    applyScaledStatRanges(state.stats, training.stats, benefitMultiplier, strainMultiplier);
    state.energy += scaleTrainingDelta(training.energy, benefitMultiplier, strainMultiplier);
    state.fatigue += scaleTrainingDelta(training.fatigue, benefitMultiplier, strainMultiplier);
    state.morale += scaleTrainingDelta(training.morale, benefitMultiplier, strainMultiplier);

    const rankingPoints = Math.max(0, Math.round(2 + quality / 11));
    const stars = Math.max(0, Math.round(quality / 22));
    state.rankingPoints += rankingPoints;
    state.stars += stars;
    normalizeState(state);
    return { rankingPoints, stars };
  }

  function travelToSelectedCity() {
    const destination = elements.travelSelect.value;
    if (!destination) {
      return;
    }
    if (destination === state.location) {
      showToast("You are already in that city.");
      return;
    }
    if (!spendActionIfAvailable()) {
      return;
    }

    const travelCost = calculateTravelCost(state.location, destination);
    if (state.stars < travelCost) {
      state.actionsRemaining += 1;
      showToast("Not enough stars to travel.");
      return;
    }

    state.stars -= travelCost;
    state.location = destination;
    state.energy -= 7;
    state.fatigue += 6;
    state.morale += 2;
    if (!state.unlockedCities.includes(destination)) {
      state.unlockedCities.push(destination);
    }
    normalizeState(state);

    addLog(`Traveled to ${getCityName(destination)} for ${travelCost} stars.`);
    render();
    showToast(`Arrived in ${getCityName(destination)}.`);
  }

  function enterRace(instanceId) {
    const race = state.upcomingRaces.find((event) => event.instanceId === instanceId);
    if (!race) {
      return;
    }
    if (!spendActionIfAvailable()) {
      return;
    }
    if (state.rankingPoints < race.minPoints) {
      state.actionsRemaining += 1;
      showToast("You do not meet this race requirement yet.");
      return;
    }
    if (state.location !== race.location) {
      state.actionsRemaining += 1;
      showToast("Travel to this race city first.");
      return;
    }
    if (state.stars < race.entry) {
      state.actionsRemaining += 1;
      showToast("Not enough stars for race entry.");
      return;
    }

    state.stars -= race.entry;
    const result = simulateRace(race, state);
    state.stars += result.starsReward;
    state.rankingPoints += result.pointsReward;
    state.energy -= result.energyCost;
    state.fatigue += result.fatigueGain;
    state.morale += result.moraleDelta;

    state.career.racesEntered += 1;
    if (result.placement === 1) {
      state.career.racesWon += 1;
    }
    if (result.placement <= 3) {
      state.career.podiums += 1;
    }
    if (!state.career.bestFinish || result.placement < state.career.bestFinish) {
      state.career.bestFinish = result.placement;
    }

    state.upcomingRaces = state.upcomingRaces.filter((event) => event.instanceId !== instanceId);
    normalizeState(state);

    addLog(
      `${race.name}: ${ordinal(result.placement)}/${race.fieldSize} in ${formatMinutes(
        result.totalTime
      )}. Rewards +${result.pointsReward} RP, +${result.starsReward} stars.`
    );
    showToast(`${race.name}: ${ordinal(result.placement)} place.`);

    if (!state.upcomingRaces.length) {
      state.upcomingRaces = generateUpcomingRaces(state);
      addLog("Race calendar refreshed with new events.");
    }

    render();
  }

  function endWeek() {
    if (state.actionsRemaining > 0) {
      const continueNow = window.confirm(
        `You still have ${state.actionsRemaining} action(s). End the week anyway?`
      );
      if (!continueNow) {
        return;
      }
    }

    state.week += 1;
    state.season = Math.floor((state.week - 1) / 12) + 1;
    state.actionsRemaining = ACTIONS_PER_WEEK;

    const sponsorPayout = 18 + Math.max(0, Math.floor((7000 - state.worldRank) / 460));
    state.stars += sponsorPayout;
    state.energy += 18;
    state.fatigue -= 22;
    state.morale += randomInt(-1, 3);

    maybeApplyWeeklyEvent();
    state.upcomingRaces = generateUpcomingRaces(state);
    normalizeState(state);

    addLog(`New week started. Sponsor payout: +${sponsorPayout} stars.`);
    render();
    showToast(`Week ${state.week} is live.`);
  }

  function maybeApplyWeeklyEvent() {
    if (Math.random() > 0.42) {
      return;
    }
    const event = randomItem(WEEKLY_EVENTS);
    if (!event) {
      return;
    }

    state.stars += numberOr(event.stars, 0);
    state.energy += numberOr(event.energy, 0);
    state.fatigue += numberOr(event.fatigue, 0);
    state.morale += numberOr(event.morale, 0);

    if (event.stats) {
      applyStatRanges(state.stats, event.stats);
    }

    normalizeState(state);
    addLog(event.message);
  }

  function upgradeGear(upgradeType) {
    if (!state.gear[upgradeType]) {
      return;
    }
    const currentLevel = state.gear[upgradeType];
    if (currentLevel >= MAX_GEAR_LEVEL) {
      showToast("That gear is already maxed.");
      return;
    }

    const cost = gearUpgradeCost(currentLevel);
    if (state.stars < cost) {
      showToast("Not enough stars to upgrade.");
      return;
    }

    state.stars -= cost;
    state.gear[upgradeType] += 1;
    state.morale += 1;
    normalizeState(state);

    addLog(`${upgradeLabel(upgradeType)} upgraded to level ${state.gear[upgradeType]}.`);
    render();
    showToast(`${upgradeLabel(upgradeType)} improved.`);
  }

  function checkMilestones(targetState) {
    let unlockedAny = false;
    for (const milestone of MILESTONES) {
      if (targetState.rankingPoints < milestone.points) {
        continue;
      }
      if (targetState.milestonesClaimed.includes(milestone.id)) {
        continue;
      }
      targetState.milestonesClaimed.push(milestone.id);
      targetState.stars += milestone.stars;
      targetState.morale += 3;
      addLog(`Milestone unlocked: ${milestone.label}. Bonus +${milestone.stars} stars.`);
      showToast(`Milestone: ${milestone.label}`);
      unlockedAny = true;
    }
    return unlockedAny;
  }

  function recalculateRank(targetState) {
    const wins = targetState.career.racesWon * 110;
    const podiums = targetState.career.podiums * 45;
    const averageStat =
      (targetState.stats.swim +
        targetState.stats.bike +
        targetState.stats.run +
        targetState.stats.stamina +
        targetState.stats.focus) /
      5;
    const consistency = Math.round((averageStat - 50) * 6);
    const totalScore = targetState.rankingPoints + wins + podiums + consistency;

    targetState.worldRank = clamp(Math.round(6800 - totalScore * 1.04), 1, 7000);
    targetState.rankTier = rankTierFromRank(targetState.worldRank);
    targetState.career.bestRank = Math.min(targetState.career.bestRank, targetState.worldRank);
  }

  function simulateRace(race, gameState) {
    const format = RACE_FORMATS[race.format];
    const swimPower =
      gameState.stats.swim * 0.68 +
      gameState.stats.stamina * 0.18 +
      gameState.stats.focus * 0.1 +
      gameState.gear.swim * 3 +
      gameState.energy * 0.07 -
      gameState.fatigue * 0.14 +
      randomBetween(-3, 3);

    const bikePower =
      gameState.stats.bike * 0.68 +
      gameState.stats.stamina * 0.19 +
      gameState.stats.focus * 0.09 +
      gameState.gear.bike * 3 +
      gameState.energy * 0.07 -
      gameState.fatigue * 0.14 +
      randomBetween(-3, 3);

    const runPower =
      gameState.stats.run * 0.68 +
      gameState.stats.stamina * 0.18 +
      gameState.stats.focus * 0.1 +
      gameState.gear.run * 3 +
      gameState.energy * 0.07 -
      gameState.fatigue * 0.14 +
      randomBetween(-3, 3);

    const targetScore = race.difficulty + 8;
    const swimTime = calculateLegTime(format.base.swim, swimPower, targetScore);
    const bikeTime = calculateLegTime(format.base.bike, bikePower, targetScore);
    const runTime = calculateLegTime(format.base.run, runPower, targetScore);
    const totalTime = swimTime + bikeTime + runTime + format.base.transition;

    const fieldSize = race.fieldSize;
    const opponents = [];
    const baseTotal =
      format.base.swim + format.base.bike + format.base.run + format.base.transition;
    const tierShift = numberOr(TIER_SKILL_SHIFT[race.tier], 0);

    for (let i = 0; i < fieldSize - 1; i += 1) {
      const competitorScore = race.difficulty + 8 + tierShift + randomBetween(-14, 14);
      const opponentFactor = clamp(1 + (targetScore - competitorScore) / 170, 0.74, 1.46);
      const variance = randomBetween(-4.5, 4.5);
      const opponentTime = baseTotal * opponentFactor + variance;
      opponents.push(opponentTime);
    }

    const placement = 1 + opponents.filter((time) => time < totalTime).length;
    const multiplier = placementMultiplier(placement, fieldSize);
    const pointsReward = Math.max(
      8,
      Math.round(race.points * multiplier * (1 + race.difficulty / 240))
    );
    const starsReward = Math.max(0, Math.round(race.prize * multiplier) + (placement === 1 ? 20 : 0));

    let moraleDelta = -3;
    if (placement === 1) {
      moraleDelta = 8;
    } else if (placement === 2) {
      moraleDelta = 6;
    } else if (placement === 3) {
      moraleDelta = 4;
    } else if (placement <= 10) {
      moraleDelta = 2;
    } else if (placement <= Math.ceil(fieldSize * 0.6)) {
      moraleDelta = 0;
    }

    const energyCost = Math.round(format.energyCost * (1 + race.difficulty / 260));
    const fatigueGain = Math.round(format.fatigueGain * (1 + race.difficulty / 280));

    return {
      placement,
      totalTime,
      starsReward,
      pointsReward,
      energyCost,
      fatigueGain,
      moraleDelta,
    };
  }

  function generateUpcomingRaces(targetState) {
    const rankingPoints = targetState.rankingPoints;
    const eligiblePool = RACE_TEMPLATES.filter((race) => race.minPoints <= rankingPoints + 900);
    const challengePool = RACE_TEMPLATES.filter(
      (race) => race.minPoints > rankingPoints + 900 && race.minPoints <= rankingPoints + 1700
    );
    const chosen = [];
    const usedIds = new Set();

    const localEligible = eligiblePool.filter((race) => race.location === targetState.location);
    if (localEligible.length > 0) {
      const local = randomItem(localEligible);
      chosen.push(local);
      usedIds.add(local.id);
    }

    while (chosen.length < 4) {
      const next = randomItem(eligiblePool.filter((race) => !usedIds.has(race.id)));
      if (!next) {
        break;
      }
      chosen.push(next);
      usedIds.add(next.id);
    }

    if (challengePool.length > 0 && Math.random() < 0.65) {
      const stretch = randomItem(challengePool.filter((race) => !usedIds.has(race.id)));
      if (stretch) {
        chosen.push(stretch);
        usedIds.add(stretch.id);
      }
    }

    while (chosen.length < 5) {
      const filler = randomItem(RACE_TEMPLATES.filter((race) => !usedIds.has(race.id)));
      if (!filler) {
        break;
      }
      chosen.push(filler);
      usedIds.add(filler.id);
    }

    return chosen.slice(0, 5).map((race, index) => ({
      ...race,
      instanceId: `w${targetState.week}-${index}-${race.id}`,
    }));
  }

  function spendActionIfAvailable() {
    if (state.actionsRemaining <= 0) {
      showToast("No actions left. End week to continue.");
      return false;
    }
    state.actionsRemaining -= 1;
    return true;
  }

  function confirmResetAthlete() {
    const reset = window.confirm(
      "Start a new athlete? This will clear your saved journey on this device."
    );
    if (!reset) {
      return;
    }
    clearSave();
    savedStateCandidate = null;
    state = null;
    elements.nameInput.value = "";
    showStartScreen(false);
    showToast("Save cleared. Enter a new athlete name.");
  }

  function saveState() {
    if (!state) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Could not save game state:", error);
      showToast("Could not save progress in this browser.");
    }
  }

  function loadSave() {
    let raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.error("Could not read save state:", error);
      return null;
    }

    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || typeof parsed.playerName !== "string") {
        return null;
      }
      return parsed;
    } catch (error) {
      console.error("Save file was invalid JSON:", error);
      return null;
    }
  }

  function clearSave() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Could not clear save state:", error);
    }
  }

  function calculateTravelCost(fromId, toId) {
    const fromCity = getCity(fromId);
    const toCity = getCity(toId);
    if (!fromCity || !toCity || fromId === toId) {
      return 0;
    }
    const distance = Math.hypot(fromCity.x - toCity.x, fromCity.y - toCity.y);
    return Math.max(8, Math.round(10 + distance * 13));
  }

  function getCity(cityId) {
    return CITIES.find((city) => city.id === cityId);
  }

  function getCityName(cityId) {
    const city = getCity(cityId);
    return city ? city.name : "Unknown";
  }

  function gearUpgradeCost(currentLevel) {
    return 45 + currentLevel * 55;
  }

  function upgradeLabel(type) {
    if (type === "swim") {
      return "Swim gear";
    }
    if (type === "bike") {
      return "Bike setup";
    }
    return "Run kit";
  }

  function calculateLegTime(baseMinutes, power, difficulty) {
    const factor = clamp(1 + (difficulty - power) / 170, 0.72, 1.45);
    return baseMinutes * factor;
  }

  function placementMultiplier(placement, fieldSize) {
    if (placement === 1) {
      return 1;
    }
    if (placement === 2) {
      return 0.78;
    }
    if (placement === 3) {
      return 0.62;
    }
    if (placement <= 5) {
      return 0.46;
    }
    if (placement <= 10) {
      return 0.3;
    }
    if (placement <= Math.ceil(fieldSize * 0.6)) {
      return 0.16;
    }
    return 0.08;
  }

  function rankTierFromRank(worldRank) {
    if (worldRank <= 25) {
      return "Global Icon";
    }
    if (worldRank <= 100) {
      return "World Elite";
    }
    if (worldRank <= 400) {
      return "Continental Pro";
    }
    if (worldRank <= 1200) {
      return "National Star";
    }
    if (worldRank <= 3000) {
      return "Rising Contender";
    }
    return "Club Level";
  }

  function addLog(message) {
    state.eventHistory.unshift({ week: state.week, message });
    if (state.eventHistory.length > MAX_LOG_ENTRIES) {
      state.eventHistory.length = MAX_LOG_ENTRIES;
    }
  }

  function showToast(message) {
    if (!message) {
      return;
    }
    elements.toast.textContent = message;
    elements.toast.classList.remove("hidden");
    if (toastTimerId) {
      clearTimeout(toastTimerId);
    }
    toastTimerId = setTimeout(() => {
      elements.toast.classList.add("hidden");
      elements.toast.textContent = "";
    }, 2200);
  }

  function barClass(value, invert) {
    const score = invert ? 100 - value : value;
    if (score >= 65) {
      return "bar-good";
    }
    if (score >= 40) {
      return "bar-warn";
    }
    return "bar-bad";
  }

  function isValidRaceInstance(race) {
    return (
      race &&
      typeof race.id === "string" &&
      typeof race.instanceId === "string" &&
      typeof race.name === "string" &&
      typeof race.location === "string" &&
      typeof race.format === "string" &&
      typeof race.tier === "string" &&
      Number.isFinite(race.minPoints) &&
      Number.isFinite(race.difficulty) &&
      Number.isFinite(race.entry) &&
      Number.isFinite(race.prize) &&
      Number.isFinite(race.points) &&
      Number.isFinite(race.fieldSize) &&
      RACE_FORMATS[race.format]
    );
  }

  function formatMinutes(totalMinutes) {
    const totalSeconds = Math.max(0, Math.round(totalMinutes * 60));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function ordinal(value) {
    const mod100 = value % 100;
    if (mod100 >= 11 && mod100 <= 13) {
      return `${value}th`;
    }
    const mod10 = value % 10;
    if (mod10 === 1) {
      return `${value}st`;
    }
    if (mod10 === 2) {
      return `${value}nd`;
    }
    if (mod10 === 3) {
      return `${value}rd`;
    }
    return `${value}th`;
  }

  function applyStatRanges(targetStats, ranges) {
    if (!ranges || typeof ranges !== "object") {
      return;
    }
    const statKeys = Object.keys(ranges);
    for (const statKey of statKeys) {
      applyRangeToStat(targetStats, statKey, ranges[statKey]);
    }
  }

  function applyScaledStatRanges(targetStats, ranges, benefitMultiplier, strainMultiplier) {
    if (!ranges || typeof ranges !== "object") {
      return;
    }
    const statKeys = Object.keys(ranges);
    for (const statKey of statKeys) {
      const range = ranges[statKey];
      if (!Array.isArray(range) || range.length !== 2 || !Number.isFinite(targetStats[statKey])) {
        continue;
      }
      const baseDelta = randomInt(range[0], range[1]);
      const scaledDelta = scaleTrainingDelta(baseDelta, benefitMultiplier, strainMultiplier);
      targetStats[statKey] = clamp(targetStats[statKey] + scaledDelta, MIN_STAT, MAX_STAT);
    }
  }

  function scaleTrainingDelta(delta, benefitMultiplier, strainMultiplier) {
    if (!Number.isFinite(delta)) {
      return 0;
    }
    if (delta >= 0) {
      return Math.round(delta * benefitMultiplier);
    }
    return Math.round(delta * strainMultiplier);
  }

  function applyRangeToStat(targetStats, statKey, range) {
    if (!Array.isArray(range) || range.length !== 2 || !Number.isFinite(targetStats[statKey])) {
      return;
    }
    const delta = randomInt(range[0], range[1]);
    targetStats[statKey] = clamp(targetStats[statKey] + delta, MIN_STAT, MAX_STAT);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function positiveInt(value, fallback) {
    const num = Math.round(numberOr(value, fallback));
    return Number.isFinite(num) && num > 0 ? num : fallback;
  }

  function numberOr(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    const lower = Math.ceil(min);
    const upper = Math.floor(max);
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
  }

  function randomItem(list) {
    if (!Array.isArray(list) || list.length === 0) {
      return null;
    }
    return list[Math.floor(Math.random() * list.length)];
  }
})();
