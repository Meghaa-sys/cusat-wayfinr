/**
 * Cochin University (CUSAT) Wayfinder & AI Assistant - Main Application Coordinator
 * Handles UI events, Navigation HUD, Autocomplete Search, Weather, and State Management
 */

class CampusAppController {
  constructor() {
    this.mapEngine = null;
    this.aiChatbot = null;
    this.currentCategory = 'all';
    this.currentTab = 'explore'; // 'explore', 'directions', 'ai-chat', 'status'
    this.selectedOriginId = 'main_gate';
    this.selectedDestId = 'central_library';
    this.audioContext = null;
  }

  init() {
    // 1. Initialize Map Engine
    this.mapEngine = new CampusMapEngine('map-container');
    this.mapEngine.init();

    // 2. Initialize AI Chatbot
    this.aiChatbot = new CampusAIChatbot({
      containerId: 'chat-messages',
      inputFieldId: 'chat-input',
      mapEngine: this.mapEngine
    });
    this.aiChatbot.setMapEngine(this.mapEngine);

    // 3. Populate Dropdowns & Search
    this.populateSelects();
    this.setupEventListeners();
    this.setupSearchAutocomplete();
    this.renderCategoryChips();
    this.renderLandmarkCards();
    this.updateLiveStatusCards();
    this.initWeatherWidget();

    // Default route ready
    this.calculateCurrentRoute();

    // Welcome message in AI chat
    this.aiChatbot.appendMessage({
      sender: 'bot',
      text: `👋 **Welcome to CUSAT Wayfinder & AI Navigator!**\n\nI can help you navigate between any department, locate canteens & labs, or find quiet study spots in the library. Ask me anything or pick a quick shortcut below!`,
      timestamp: new Date(),
      buttons: [
        { text: '🏫 Take me to SOE', action: `CampusApp.setDestinationAndRoute('soe_main')` },
        { text: '🍽️ Nearest Canteen', action: `CampusApp.setDestinationAndRoute('canteen_main')` },
        { text: '📚 Central Library', action: `CampusApp.setDestinationAndRoute('central_library')` }
      ]
    });

    // Refresh icons
    if (window.lucide) window.lucide.createIcons();
  }

  // Synthesize soft audio chimes
  playChime(type = 'nav') {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      if (type === 'turn') {
        osc.frequency.setValueAtTime(520, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.25);
      } else if (type === 'arrive') {
        osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
        osc.frequency.setValueAtTime(554.37, this.audioContext.currentTime + 0.1);
        osc.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.45);
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.45);
      }
    } catch (e) {}
  }

  // Populate Origin & Destination Select Pickers
  populateSelects() {
    const originSel = document.getElementById('origin-select');
    const destSel = document.getElementById('dest-select');

    if (!originSel || !destSel) return;

    originSel.innerHTML = '';
    destSel.innerHTML = '';

    // Group landmarks by category
    const grouped = {};
    CUSAT_DATA.landmarks.forEach(lm => {
      if (!grouped[lm.category]) grouped[lm.category] = [];
      grouped[lm.category].push(lm);
    });

    for (const catKey in grouped) {
      const catMeta = CUSAT_DATA.categories[catKey] || { name: catKey };
      const grpOrigin = document.createElement('optgroup');
      grpOrigin.label = catMeta.name;
      const grpDest = document.createElement('optgroup');
      grpDest.label = catMeta.name;

      grouped[catKey].forEach(lm => {
        const opt1 = new Option(lm.name, lm.id);
        const opt2 = new Option(lm.name, lm.id);
        grpOrigin.appendChild(opt1);
        grpDest.appendChild(opt2);
      });

      originSel.appendChild(grpOrigin);
      destSel.appendChild(grpDest);
    }

    originSel.value = this.selectedOriginId;
    destSel.value = this.selectedDestId;
  }

  // Render Category Filter Chips
  renderCategoryChips() {
    const container = document.getElementById('category-chips');
    if (!container) return;

    container.innerHTML = `
      <button class="cat-chip active" data-category="all" onclick="CampusApp.filterCategory('all')">
        <i data-lucide="layers"></i> <span>All Places</span>
      </button>
    `;

    for (const key in CUSAT_DATA.categories) {
      const cat = CUSAT_DATA.categories[key];
      const btn = document.createElement('button');
      btn.className = 'cat-chip';
      btn.dataset.category = key;
      btn.innerHTML = `<span class="chip-emoji">${this.mapEngine.getCategoryEmoji(key)}</span> <span>${cat.name}</span>`;
      btn.onclick = () => this.filterCategory(key);
      container.appendChild(btn);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Filter Category
  filterCategory(categoryKey) {
    this.currentCategory = categoryKey;

    // Update active chip styles
    document.querySelectorAll('.cat-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.category === categoryKey);
    });

    this.mapEngine.renderLandmarks(categoryKey);
    this.renderLandmarkCards(categoryKey);
  }

  // Render Landmark Explorer Cards in Sidebar
  renderLandmarkCards(category = 'all') {
    const container = document.getElementById('landmarks-list');
    if (!container) return;

    container.innerHTML = '';

    const filtered = CUSAT_DATA.landmarks.filter(lm => category === 'all' || lm.category === category);

    filtered.forEach(lm => {
      const catMeta = CUSAT_DATA.categories[lm.category] || { color: '#3b82f6', name: lm.category };
      const card = document.createElement('div');
      card.className = 'landmark-card';
      card.innerHTML = `
        <div class="card-thumb" style="background-image: url('${lm.image || ''}')">
          <span class="card-category-badge" style="background-color: ${catMeta.color}">
            ${catMeta.name}
          </span>
        </div>
        <div class="card-info">
          <h4 class="card-title">${lm.name}</h4>
          <p class="card-desc">${lm.description}</p>
          <div class="card-meta">
            <span><i data-lucide="clock"></i> ${lm.timings || 'Open'}</span>
            ${lm.occupancy ? `<span class="card-occ"><i data-lucide="users"></i> ${lm.occupancy}% Crowded</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="btn-card-nav" onclick="CampusApp.setDestinationAndRoute('${lm.id}')">
              <i data-lucide="navigation"></i> Navigate
            </button>
            <button class="btn-card-view" onclick="CampusApp.focusLandmark('${lm.id}')">
              <i data-lucide="eye"></i> View
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // Search Autocomplete
  setupSearchAutocomplete() {
    const searchInput = document.getElementById('search-input');
    const resultsBox = document.getElementById('search-results');

    if (!searchInput || !resultsBox) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        resultsBox.style.display = 'none';
        return;
      }

      const matches = CUSAT_DATA.landmarks.filter(lm => {
        return lm.name.toLowerCase().includes(query) ||
               lm.shortName.toLowerCase().includes(query) ||
               lm.tags.some(t => t.toLowerCase().includes(query)) ||
               lm.description.toLowerCase().includes(query);
      });

      if (matches.length === 0) {
        resultsBox.innerHTML = `<div class="search-empty">No campus location matching "${e.target.value}"</div>`;
        resultsBox.style.display = 'block';
        return;
      }

      resultsBox.innerHTML = matches.map(lm => {
        const catMeta = CUSAT_DATA.categories[lm.category] || { name: lm.category };
        return `
          <div class="search-item" onclick="CampusApp.onSelectSearchResult('${lm.id}')">
            <div class="search-icon">${this.mapEngine.getCategoryEmoji(lm.category)}</div>
            <div class="search-text">
              <div class="search-title">${lm.name}</div>
              <div class="search-sub">${catMeta.name} • ${lm.timings || 'Open'}</div>
            </div>
            <button class="search-nav-btn" title="Route here" onclick="event.stopPropagation(); CampusApp.setDestinationAndRoute('${lm.id}')">
              <i data-lucide="navigation-2"></i>
            </button>
          </div>
        `;
      }).join('');

      resultsBox.style.display = 'block';
      if (window.lucide) window.lucide.createIcons();
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsBox.contains(e.target)) {
        resultsBox.style.display = 'none';
      }
    });
  }

  onSelectSearchResult(landmarkId) {
    document.getElementById('search-results').style.display = 'none';
    const lm = CUSAT_DATA.landmarks.find(l => l.id === landmarkId);
    if (lm) {
      document.getElementById('search-input').value = lm.name;
      this.mapEngine.focusLandmark(landmarkId, true);
    }
  }

  // Calculate & Draw Current Route
  async calculateCurrentRoute() {
    const originSel = document.getElementById('origin-select');
    const destSel = document.getElementById('dest-select');

    if (!originSel || !destSel) return;

    this.selectedOriginId = originSel.value;
    this.selectedDestId = destSel.value;

    if (this.selectedOriginId === this.selectedDestId) {
      alert('Please select two different points on campus.');
      return;
    }

    const route = await this.mapEngine.calculateRoute(this.selectedOriginId, this.selectedDestId);
    if (!route) {
      alert('Could not find a direct path between these two points.');
      return;
    }

    this.renderRouteHUD(route);
  }

  // Render Google Maps Style Turn-by-Turn HUD
  renderRouteHUD(route) {
    const hud = document.getElementById('live-nav-hud');
    const routeSummary = document.getElementById('route-summary-panel');
    const stepsList = document.getElementById('turn-by-turn-steps');

    if (routeSummary) {
      document.getElementById('hud-origin-name').textContent = route.originLandmark.shortName;
      document.getElementById('hud-dest-name').textContent = route.destLandmark.shortName;
      document.getElementById('hud-distance').textContent = `${route.totalMeters} m`;
      document.getElementById('hud-eta').textContent = `${route.durationMinutes} min`;
      document.getElementById('hud-steps-count').textContent = `${route.stepCount} steps`;
    }

    if (stepsList) {
      stepsList.innerHTML = route.maneuvers.map((step, idx) => `
        <div class="turn-step-card ${idx === 0 ? 'current-step' : ''}" id="step-card-${idx}">
          <div class="turn-icon-box">
            <i data-lucide="${step.icon || 'arrow-up'}"></i>
          </div>
          <div class="turn-details">
            <div class="turn-instruction">${step.instruction}</div>
            <div class="turn-sub">${step.street} ${step.distance > 0 ? `• In ${step.distance}m` : ''}</div>
          </div>
        </div>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Start Live Simulation Navigation
  startLiveNavigationSimulation() {
    this.switchTab('directions');
    const navOverlay = document.getElementById('live-sim-banner');
    if (navOverlay) navOverlay.classList.add('active');

    const playBtn = document.getElementById('btn-sim-play');
    if (playBtn) playBtn.innerHTML = `<i data-lucide="pause"></i> Pause`;

    this.playChime('turn');

    this.mapEngine.startSimulation(
      (state) => {
        // Real-time progress update
        document.getElementById('sim-dist-remain').textContent = `${state.remainingMeters} m`;
        document.getElementById('sim-eta-remain').textContent = `${state.remainingMinutes} min`;

        if (state.currentStep) {
          document.getElementById('sim-current-instruction').textContent = state.currentStep.instruction;
          document.getElementById('sim-current-street').textContent = state.currentStep.street || 'Campus Road';
        }

        // Highlight active step card in list
        document.querySelectorAll('.turn-step-card').forEach((card, i) => {
          card.classList.toggle('current-step', i === state.currentStepIndex);
        });
      },
      () => {
        // Simulation finished
        this.playChime('arrive');
        if (playBtn) playBtn.innerHTML = `<i data-lucide="play"></i> Restart`;
        if (window.confetti) {
          window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
    );

    if (window.lucide) window.lucide.createIcons();
  }

  toggleSimulationPause() {
    if (this.mapEngine.isSimulating) {
      this.mapEngine.stopSimulation();
      document.getElementById('btn-sim-play').innerHTML = `<i data-lucide="play"></i> Resume`;
    } else {
      this.startLiveNavigationSimulation();
    }
    if (window.lucide) window.lucide.createIcons();
  }

  stopLiveNavigation() {
    this.mapEngine.stopSimulation();
    const navOverlay = document.getElementById('live-sim-banner');
    if (navOverlay) navOverlay.classList.remove('active');
    const playBtn = document.getElementById('btn-sim-play');
    if (playBtn) playBtn.innerHTML = `<i data-lucide="play"></i> Start Simulation`;
    if (window.lucide) window.lucide.createIcons();
  }

  // Quick Action: Set Destination and Route immediately
  async setDestinationAndRoute(destLandmarkId) {
    this.selectedDestId = destLandmarkId;
    const destSel = document.getElementById('dest-select');
    if (destSel) destSel.value = destLandmarkId;

    this.switchTab('directions');
    await this.calculateCurrentRoute();
    this.mapEngine.focusLandmark(destLandmarkId, false);
  }

  // Quick Action: Set Origin
  async setOrigin(originLandmarkId) {
    this.selectedOriginId = originLandmarkId;
    const originSel = document.getElementById('origin-select');
    if (originSel) originSel.value = originLandmarkId;
    await this.calculateCurrentRoute();
  }

  async setCustomRoute(originId, destId) {
    this.selectedOriginId = originId;
    this.selectedDestId = destId;

    const originSel = document.getElementById('origin-select');
    const destSel = document.getElementById('dest-select');
    if (originSel) originSel.value = originId;
    if (destSel) destSel.value = destId;

    this.switchTab('directions');
    await this.calculateCurrentRoute();
  }

  async swapOriginDestination() {
    const originSel = document.getElementById('origin-select');
    const destSel = document.getElementById('dest-select');
    if (!originSel || !destSel) return;

    const temp = originSel.value;
    originSel.value = destSel.value;
    destSel.value = temp;

    await this.calculateCurrentRoute();
  }

  focusLandmark(landmarkId) {
    this.mapEngine.focusLandmark(landmarkId, true);
  }

  // Tab Switcher
  switchTab(tabKey) {
    this.currentTab = tabKey;

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabKey);
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-panel-${tabKey}`);
    });

    if (window.innerWidth < 768) {
      document.getElementById('sidebar-drawer').classList.add('mobile-open');
    }
  }

  collapseMobilePanels() {
    const drawer = document.getElementById('sidebar-drawer');
    if (drawer) drawer.classList.remove('mobile-open');
  }

  // Real-world GPS locate me toggle
  toggleLiveGps() {
    const gpsBtn = document.getElementById('btn-gps-locate');
    if (!this.mapEngine.watchId) {
      gpsBtn.classList.add('active-tracking');
      this.mapEngine.startLiveGpsTracking(
        (pos, accuracy) => {
          this.mapEngine.map.flyTo(pos, 18);
        },
        (err) => {
          alert('GPS Error: ' + err);
          gpsBtn.classList.remove('active-tracking');
        }
      );
    } else {
      gpsBtn.classList.remove('active-tracking');
      this.mapEngine.stopLiveGpsTracking();
    }
  }

  // Live Simulated Status updates
  updateLiveStatusCards() {
    const list = document.getElementById('live-status-list');
    if (!list) return;

    const places = [
      { name: 'Central Library Reading Hall', status: '68% Full', level: 'Moderate', color: '#f59e0b', icon: 'book-open' },
      { name: 'Student Amenity Canteen', status: '82% Full', level: 'Busy', color: '#ef4444', icon: 'utensils' },
      { name: 'CITTIC Innovation Lab', status: '35% Full', level: 'Quiet', color: '#10b981', icon: 'cpu' },
      { name: 'SOE Seminar Hall', status: 'In Session', level: 'Busy', color: '#ef4444', icon: 'presentation' },
      { name: 'Sports Complex Arena', status: 'Evening Matches', level: 'Moderate', color: '#f59e0b', icon: 'trophy' }
    ];

    list.innerHTML = places.map(p => `
      <div class="status-card-row">
        <div class="status-icon" style="background-color: ${p.color}20; color: ${p.color}">
          <i data-lucide="${p.icon}"></i>
        </div>
        <div class="status-info">
          <div class="status-title">${p.name}</div>
          <div class="status-meta">${p.status}</div>
        </div>
        <div class="status-badge" style="background-color: ${p.color}20; color: ${p.color}">
          ${p.level}
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // Kochi Kalamassery Weather Widget
  initWeatherWidget() {
    const tempEl = document.getElementById('weather-temp');
    const condEl = document.getElementById('weather-condition');
    if (tempEl && condEl) {
      tempEl.textContent = '29°C';
      condEl.textContent = 'Kochi • Humid & Tropical';
    }
  }

  // Setup Event Listeners
  setupEventListeners() {
    // Mode Travel Switchers
    document.querySelectorAll('.travel-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.dataset.mode;
        document.querySelectorAll('.travel-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.mapEngine.setNavigationMode(mode);
        this.calculateCurrentRoute();
      });
    });

    // Voice Input Mic Button
    const micBtn = document.getElementById('btn-chat-mic');
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        this.aiChatbot.toggleVoiceInput((isListening) => {
          micBtn.classList.toggle('listening', isListening);
        });
      });
    }

    // Voice Audio Readout Mute Toggle
    const voiceBtn = document.getElementById('btn-voice-toggle');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const enabled = this.mapEngine.toggleVoice();
        voiceBtn.classList.toggle('muted', !enabled);
        voiceBtn.innerHTML = enabled ? `<i data-lucide="volume-2"></i>` : `<i data-lucide="volume-x"></i>`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Quick AI Chips
    document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt;
        this.switchTab('ai-chat');
        this.aiChatbot.handleUserSubmit(prompt);
      });
    });

    // Map Layer Switcher buttons
    document.querySelectorAll('.layer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const layerKey = btn.dataset.layer;
        document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.mapEngine.switchLayer(layerKey);
      });
    });
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.CampusApp = new CampusAppController();
  window.CampusApp.init();
});
