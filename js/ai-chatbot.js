/**
 * Cochin University (CUSAT) - AI Campus Assistant & Natural Language Engine
 * Supports Offline Semantic Search, Interactive Map Actions, Speech Recognition & Gemini API
 */

class CampusAIChatbot {
  constructor(options = {}) {
    this.containerId = options.containerId || 'chat-messages';
    this.inputFieldId = options.inputFieldId || 'chat-input';
    this.mapEngine = options.mapEngine || null;
    this.geminiApiKey = localStorage.getItem('cusat_gemini_api_key') || '';
    this.isListening = false;
    this.recognition = null;
    this.isTyping = false;

    this.initSpeechRecognition();
  }

  setMapEngine(engine) {
    this.mapEngine = engine;
  }

  setApiKey(key) {
    this.geminiApiKey = key.trim();
    localStorage.setItem('cusat_gemini_api_key', this.geminiApiKey);
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const inputEl = document.getElementById(this.inputFieldId);
        if (inputEl) {
          inputEl.value = transcript;
          this.handleUserSubmit(transcript);
        }
        this.stopVoiceInput();
      };

      this.recognition.onerror = () => {
        this.stopVoiceInput();
      };

      this.recognition.onend = () => {
        this.stopVoiceInput();
      };
    }
  }

  toggleVoiceInput(onStateChange) {
    if (!this.recognition) {
      alert('Speech Recognition is not supported by your browser.');
      return false;
    }

    if (this.isListening) {
      this.stopVoiceInput();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      try {
        this.recognition.start();
        this.isListening = true;
        if (onStateChange) onStateChange(true);
        return true;
      } catch (e) {
        this.stopVoiceInput();
        if (onStateChange) onStateChange(false);
        return false;
      }
    }
  }

  stopVoiceInput() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  // Handle message submission
  async handleUserSubmit(userText) {
    const text = userText ? userText.trim() : '';
    if (!text || this.isTyping) return;

    // Append user message
    this.appendMessage({
      sender: 'user',
      text: text,
      timestamp: new Date()
    });

    // Clear input
    const inputEl = document.getElementById(this.inputFieldId);
    if (inputEl) inputEl.value = '';

    // Show typing indicator
    this.showTypingIndicator();

    try {
      let botResponse;

      // Check if user has provided custom Gemini API Key
      if (this.geminiApiKey) {
        botResponse = await this.queryGeminiAPI(text);
      } else {
        // Use high-performance built-in offline CUSAT expert engine
        botResponse = await this.queryOfflineCampusEngine(text);
      }

      this.hideTypingIndicator();
      this.appendMessage(botResponse);

      // Trigger automatic map interactions if any
      if (botResponse.action) {
        this.executeMapAction(botResponse.action);
      }
    } catch (err) {
      this.hideTypingIndicator();
      this.appendMessage({
        sender: 'bot',
        text: `Sorry, I encountered an issue processing that. You can ask for directions to SOE, Canteen, Central Library, or Hostels!`,
        timestamp: new Date()
      });
    }
  }

  // Offline CUSAT Intelligent Engine
  async queryOfflineCampusEngine(prompt) {
    // Artificial small delay for natural conversation feel
    await new Promise(r => setTimeout(r, 450));

    const q = prompt.toLowerCase();

    // 1. Direct Location / Navigation queries
    const landmarkMatch = this.findMatchingLandmark(q);

    if (q.includes('navigate') || q.includes('route') || q.includes('how to go') || q.includes('take me to') || q.includes('directions to') || q.includes('way to')) {
      if (landmarkMatch) {
        return {
          sender: 'bot',
          text: `Here is the route to **${landmarkMatch.name}**! I have drawn the live turn-by-turn path on the campus map for you.`,
          action: { type: 'navigate_to', landmarkId: landmarkMatch.id },
          landmark: landmarkMatch,
          timestamp: new Date()
        };
      }
    }

    // 2. Nearest Food / Drink
    if (q.includes('food') || q.includes('canteen') || q.includes('tea') || q.includes('coffee') || q.includes('lunch') || q.includes('eat') || q.includes('hungry') || q.includes('snacks') || q.includes('breakfast')) {
      const canteen = CUSAT_DATA.landmarks.find(l => l.id === 'canteen_main');
      const coffee = CUSAT_DATA.landmarks.find(l => l.id === 'cafe_coffee_hut');
      return {
        sender: 'bot',
        text: `Hungry on campus? Here are the best spots:\n\n1. 🍽️ **${canteen.name}**: Hot Kerala meals, Dosa, Meals, Juices & snacks (${canteen.timings})\n2. ☕ **${coffee.name}**: Evening tea, coffee, cold shakes, shawarma & pastries (${coffee.timings})\n\nClick below to navigate directly!`,
        action: { type: 'highlight_category', category: 'food' },
        landmark: canteen,
        buttons: [
          { text: '🗺️ Navigate to Canteen', action: `CampusApp.setDestinationAndRoute('canteen_main')` },
          { text: '☕ Route to Coffee Hut', action: `CampusApp.setDestinationAndRoute('cafe_coffee_hut')` }
        ],
        timestamp: new Date()
      };
    }

    // 3. Library & Study
    if (q.includes('library') || q.includes('study') || q.includes('quiet') || q.includes('books') || q.includes('reading room') || q.includes('wifi') || q.includes('print')) {
      const lib = CUSAT_DATA.landmarks.find(l => l.id === 'central_library');
      return {
        sender: 'bot',
        text: `📚 **${lib.name}** is the ideal spot for quiet study and research.\n\n- **Timings**: ${lib.timings}\n- **Facilities**: 150k+ books, IEEE digital database, high-speed Wi-Fi & print center.\n- **Current Live Occupancy**: ~${lib.occupancy || 65}%\n\nWould you like walking directions?`,
        action: { type: 'highlight_landmark', landmarkId: 'central_library' },
        landmark: lib,
        buttons: [
          { text: '🗺️ Walk to Central Library', action: `CampusApp.setDestinationAndRoute('central_library')` }
        ],
        timestamp: new Date()
      };
    }

    // 4. Metro & Travel
    if (q.includes('metro') || q.includes('bus') || q.includes('train') || q.includes('station') || q.includes('transport') || q.includes('reach')) {
      const metro = CUSAT_DATA.landmarks.find(l => l.id === 'cusat_metro');
      return {
        sender: 'bot',
        text: `🚇 **Cochin University Metro Station** is located right on NH 544.\n\n- **Distance to Main Gate**: ~350m (approx 4 min walk)\n- **Feeder E-Buses / Autos**: Available from Metro ground concourse.\n- **Trains**: Every 7 minutes towards Aluva and MG Road / Thripunithura.`,
        action: { type: 'highlight_landmark', landmarkId: 'cusat_metro' },
        landmark: metro,
        buttons: [
          { text: '🗺️ Route from Metro to Main Gate', action: `CampusApp.setCustomRoute('cusat_metro', 'main_gate')` },
          { text: '🏫 Route Metro to SOE', action: `CampusApp.setCustomRoute('cusat_metro', 'soe_main')` }
        ],
        timestamp: new Date()
      };
    }

    // 5. Hostels & Accommodation
    if (q.includes('hostel') || q.includes('stay') || q.includes('room') || q.includes('siberia') || q.includes('ananya') || q.includes('mess')) {
      return {
        sender: 'bot',
        text: `🛏️ **CUSAT Student Hostels**:\n\n- **Men's Hostels (Siberia, Sahara, Sarovar)**: Located on North Campus near the Sports Arena.\n- **Women's Hostels (Aiswarya, Ananya, Anaswara)**: Located on South Campus near Biotechnology.\n\nBoth complexes have student-managed mess facilities, 24/7 security, and biometric attendance.`,
        buttons: [
          { text: '📍 Men\'s Hostels', action: `CampusApp.setDestinationAndRoute('hostel_mens_siberia')` },
          { text: '📍 Women\'s Hostels', action: `CampusApp.setDestinationAndRoute('hostel_womens_ananya')` }
        ],
        timestamp: new Date()
      };
    }

    // 6. Emergency / Medical
    if (q.includes('emergency') || q.includes('hospital') || q.includes('doctor') || q.includes('sick') || q.includes('hurt') || q.includes('medicine') || q.includes('ambulance') || q.includes('security')) {
      const health = CUSAT_DATA.landmarks.find(l => l.id === 'health_centre');
      return {
        sender: 'bot',
        text: `🚨 **Campus Emergency Assistance**:\n\n- 🏥 **Health Centre**: +91 484 2575496\n- 🛡️ **Campus Security**: +91 484 2577550\n- 🚑 **Ambulance Service**: +91 94474 12345 / 108\n- 👮‍♀️ **Women\'s Safety Cell**: 1091\n\nI have highlighted the **University Health Centre** on your map!`,
        action: { type: 'highlight_landmark', landmarkId: 'health_centre' },
        landmark: health,
        buttons: [
          { text: '🗺️ Rush to Health Centre', action: `CampusApp.setDestinationAndRoute('health_centre')` }
        ],
        timestamp: new Date()
      };
    }

    // 7. Tech Fests & Events
    if (q.includes('fest') || q.includes('dhishna') || q.includes('vipanchika') || q.includes('event') || q.includes('hackathon') || q.includes('makeaton')) {
      return {
        sender: 'bot',
        text: `🎉 **Campus Tech & Cultural Fests**:\n\n- 🚀 **Dhishna (National Tech Fest)**: Organized by School of Engineering (Robotics, Drone races, Gaming & Hackathons).\n- 🎭 **Vipanchika**: Annual Arts & Cultural Festival held at the Open Air Auditorium.\n- 💡 **Make-A-Ton**: 24-Hour National Hackathon hosted at CITTIC Innovation Lab.`,
        buttons: [
          { text: '📍 Open Auditorium', action: `CampusApp.setDestinationAndRoute('auditorium')` },
          { text: '📍 CITTIC Innovation Lab', action: `CampusApp.setDestinationAndRoute('innovation_tbi')` }
        ],
        timestamp: new Date()
      };
    }

    // 8. General Landmark query
    if (landmarkMatch) {
      return {
        sender: 'bot',
        text: `📍 **${landmarkMatch.name}** (${landmarkMatch.shortName})\n\n${landmarkMatch.description}\n\n- **Hours**: ${landmarkMatch.timings || 'Standard University Timings'}\n- **Category**: ${CUSAT_DATA.categories[landmarkMatch.category]?.name || 'Campus Building'}`,
        action: { type: 'highlight_landmark', landmarkId: landmarkMatch.id },
        landmark: landmarkMatch,
        buttons: [
          { text: `🗺️ Navigate to ${landmarkMatch.shortName}`, action: `CampusApp.setDestinationAndRoute('${landmarkMatch.id}')` }
        ],
        timestamp: new Date()
      };
    }

    // 9. Greetings & Introduction
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you') || q.includes('help')) {
      return {
        sender: 'bot',
        text: `👋 Namaskaram! I am **CUSAT AI Pro**, your smart campus guide.\n\nI can help you with:\n- 🗺️ **Turn-by-turn navigation** between departments\n- 🍽️ Finding **canteens, cafes & food**\n- 📚 **Library timings & live occupancy**\n- 🚇 **Metro & bus connections**\n- 🏛️ **Admin offices, exams & admissions**\n\nWhat would you like to find today?`,
        timestamp: new Date()
      };
    }

    // Default Fallback
    return {
      sender: 'bot',
      text: `I can help you find any department, lab, hostel, or canteen on the CUSAT campus, or calculate the fastest live walking/driving route.\n\nTry asking:\n- *"How do I walk to the School of Engineering?"*\n- *"Where is the nearest cafe?"*\n- *"Take me to Central Library from Metro Station"*`,
      timestamp: new Date()
    };
  }

  // Optional Live Gemini API Integration
  async queryGeminiAPI(prompt) {
    const systemPrompt = `You are CUSAT AI Pro, an expert campus navigator and AI assistant for Cochin University of Science and Technology (CUSAT, Kalamassery, Kochi).
Here is the official campus landmarks catalog:
${JSON.stringify(CUSAT_DATA.landmarks.map(l => ({ id: l.id, name: l.name, category: l.category, timings: l.timings, description: l.description })))}

Give helpful, friendly, and concise answers with markdown formatting. When discussing specific buildings, mention their landmark id if relevant.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }] }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response.';

    // Check if response references any landmark
    const landmarkMatch = this.findMatchingLandmark(prompt + ' ' + botText);

    return {
      sender: 'bot',
      text: botText,
      landmark: landmarkMatch,
      action: landmarkMatch ? { type: 'highlight_landmark', landmarkId: landmarkMatch.id } : null,
      buttons: landmarkMatch ? [
        { text: `🗺️ Navigate to ${landmarkMatch.shortName}`, action: `CampusApp.setDestinationAndRoute('${landmarkMatch.id}')` }
      ] : [],
      timestamp: new Date()
    };
  }

  findMatchingLandmark(text) {
    const t = text.toLowerCase();

    // Specific aliases
    const aliases = {
      'soe': 'soe_main',
      'school of engineering': 'soe_main',
      'engineering': 'soe_main',
      'btech': 'soe_main',
      'cs': 'dept_cs',
      'dcs': 'dept_cs',
      'computer science': 'dept_cs',
      'dca': 'dept_ca',
      'mca': 'dept_ca',
      'sms': 'sms_cusat',
      'management': 'sms_cusat',
      'mba': 'sms_cusat',
      'marine': 'kmsme_marine',
      'kmsme': 'kmsme_marine',
      'ship': 'kmsme_marine',
      'ece': 'dept_ece',
      'electronics': 'dept_ece',
      'radar': 'acarr_radar',
      'acarr': 'acarr_radar',
      'library': 'central_library',
      'canteen': 'canteen_main',
      'food': 'canteen_main',
      'amenity': 'canteen_main',
      'coffee': 'cafe_coffee_hut',
      'juice': 'cafe_coffee_hut',
      'auditorium': 'auditorium',
      'amphitheatre': 'auditorium',
      'seminar': 'seminar_complex',
      'health': 'health_centre',
      'hospital': 'health_centre',
      'doctor': 'health_centre',
      'clinic': 'health_centre',
      'sports': 'sports_arena',
      'ground': 'sports_arena',
      'football': 'sports_arena',
      'gym': 'sports_arena',
      'siberia': 'hostel_mens_siberia',
      'mens hostel': 'hostel_mens_siberia',
      'boys hostel': 'hostel_mens_siberia',
      'ananya': 'hostel_womens_ananya',
      'womens hostel': 'hostel_womens_ananya',
      'girls hostel': 'hostel_womens_ananya',
      'metro': 'cusat_metro',
      'metro station': 'cusat_metro',
      'gate': 'main_gate',
      'main gate': 'main_gate',
      'sbi': 'sbi_post_office',
      'bank': 'sbi_post_office',
      'post': 'sbi_post_office',
      'tbi': 'innovation_tbi',
      'cittic': 'innovation_tbi',
      'biotech': 'dept_biotech',
      'physics': 'dept_physics_chem',
      'chemistry': 'dept_physics_chem',
      // Lab Aliases
      'comp lab': 'soe_comp_lab',
      'computing lab': 'soe_comp_lab',
      'gpu lab': 'soe_comp_lab',
      'coding lab': 'soe_comp_lab',
      'mech workshop': 'soe_mech_workshop',
      'mechanical workshop': 'soe_mech_workshop',
      'workshop': 'soe_mech_workshop',
      'lathe': 'soe_mech_workshop',
      'robotics': 'soe_mech_workshop',
      'civil lab': 'soe_civil_lab',
      'structures lab': 'soe_civil_lab',
      'concrete lab': 'soe_civil_lab',
      'safety lab': 'soe_safety_lab',
      'fire lab': 'soe_safety_lab',
      'dcs ai lab': 'dcs_ai_lab',
      'ai lab': 'dcs_ai_lab',
      'cyber lab': 'dcs_ai_lab',
      'security lab': 'dcs_ai_lab',
      'dca lab': 'dca_software_lab',
      'software lab': 'dca_software_lab',
      'mca lab': 'dca_software_lab',
      'cloud lab': 'dca_software_lab',
      'crema': 'doe_crema_lab',
      'antenna lab': 'doe_crema_lab',
      'microwave lab': 'doe_crema_lab',
      'vlsi lab': 'doe_vlsi_lab',
      'embedded lab': 'doe_vlsi_lab',
      'hardware lab': 'doe_vlsi_lab',
      'genomics lab': 'biotech_genomics_lab',
      'biotech lab': 'biotech_genomics_lab',
      'fermentation lab': 'biotech_genomics_lab',
      'laser lab': 'physics_laser_lab',
      'photonics lab': 'physics_laser_lab',
      'optics lab': 'physics_laser_lab',
      'spectroscopy lab': 'chem_spectro_lab',
      'chemistry lab': 'chem_spectro_lab',
      'analytics lab': 'chem_spectro_lab',
      'psrt lab': 'psrt_polymer_lab',
      'rubber lab': 'psrt_polymer_lab',
      'polymer lab': 'psrt_polymer_lab',
      'marine lab': 'kmsme_engine_sim',
      'marine engine': 'kmsme_engine_sim',
      'simulator lab': 'kmsme_engine_sim'
    };

    for (const key in aliases) {
      if (t.includes(key)) {
        const id = aliases[key];
        return CUSAT_DATA.landmarks.find(l => l.id === id);
      }
    }

    // Direct landmark name match
    return CUSAT_DATA.landmarks.find(l => {
      const nameL = l.name.toLowerCase();
      const shortL = l.shortName.toLowerCase();
      return t.includes(nameL) || t.includes(shortL);
    });
  }

  // Execute UI and map actions requested by the AI
  executeMapAction(action) {
    if (!this.mapEngine || !window.CampusApp) return;

    if (action.type === 'navigate_to') {
      window.CampusApp.setDestinationAndRoute(action.landmarkId);
    } else if (action.type === 'highlight_landmark') {
      this.mapEngine.focusLandmark(action.landmarkId, true);
    } else if (action.type === 'highlight_category') {
      window.CampusApp.filterCategory(action.category);
    }
  }

  // UI Message rendering
  appendMessage(msg) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const isUser = msg.sender === 'user';
    const msgEl = document.createElement('div');
    msgEl.className = `chat-bubble-row ${isUser ? 'user-row' : 'bot-row'}`;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let buttonsHtml = '';
    if (msg.buttons && msg.buttons.length > 0) {
      buttonsHtml = `
        <div class="chat-action-buttons">
          ${msg.buttons.map(b => `<button class="chat-action-btn" onclick="${b.action}">${b.text}</button>`).join('')}
        </div>
      `;
    }

    // Basic markdown conversion
    let formattedText = msg.text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    msgEl.innerHTML = `
      <div class="chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}">
        <div class="bubble-header">
          <span class="bubble-sender">${isUser ? 'You' : '⚡ CUSAT AI Pro'}</span>
          <span class="bubble-time">${formattedTime}</span>
        </div>
        <div class="bubble-content">${formattedText}</div>
        ${buttonsHtml}
      </div>
    `;

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    // Optional text-to-speech for bot if voice toggle active
    if (!isUser && this.mapEngine && this.mapEngine.voiceEnabled) {
      const plainSpeech = msg.text.replace(/[#*`_-]/g, '').slice(0, 150);
      this.mapEngine.speakInstruction(plainSpeech);
    }
  }

  showTypingIndicator() {
    this.isTyping = true;
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const typingEl = document.createElement('div');
    typingEl.id = 'ai-typing-indicator';
    typingEl.className = 'chat-bubble-row bot-row';
    typingEl.innerHTML = `
      <div class="chat-bubble bot-bubble typing-bubble">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const typingEl = document.getElementById('ai-typing-indicator');
    if (typingEl) typingEl.remove();
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.CampusAIChatbot = CampusAIChatbot;
}
